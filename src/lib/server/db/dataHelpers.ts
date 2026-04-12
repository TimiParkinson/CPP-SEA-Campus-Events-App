/**
 * Helper functions to transform database rows to match required frontend types.
 * Handles missing schema fields by returning null for fields not yet implemented.
 */

import { and, desc, eq, gte, ilike, inArray, lte, or, sql } from 'drizzle-orm';
import type { Event, Organization, EventTag, OrganizationCategory } from '$lib/types/index.js';
import { db } from './index.js';
import {
	events,
	organizations,
	eventTags,
	eventTagAssignments,
	organizationCategories,
	organizationCategoryAssignments
} from './schema.js';

/**
 * Get all events with joined organization and tag data
 *
 * Currently handles single org via organization_id foreign key.
 * Tags are joined via event_tag_assignments junction table.
 */
export async function getAllEvents(): Promise<Event[]> {
	// Get all events
	const allEvents = await db.select().from(events);

	// Transform each event with joined data
	const enrichedEvents = await Promise.all(
		allEvents.map(async (event) => {
			// Get organization for this event
			const org = await db
				.select()
				.from(organizations)
				.where(eq(organizations.id, event.organizationId))
				.limit(1);

			// Get tags for this event
			const tagAssignments = await db
				.select()
				.from(eventTagAssignments)
				.where(eq(eventTagAssignments.eventId, event.id));

			const tags = await Promise.all(
				tagAssignments.map(async (assignment) => {
					const tag = await db
						.select()
						.from(eventTags)
						.where(eq(eventTags.id, assignment.tagId))
						.limit(1);
					return tag[0];
				})
			);

			return {
				id: event.id,
				title: event.title,
				description: event.description,
				location: event.location,
				startTime: event.startTime.toISOString(),
				endTime: event.endTime.toISOString(),
				// Fields not yet in schema - return null/undefined
				imageUrl: null,
				attendeeCount: null,
				rsvpUrl: null,
				feedbackUrl: null,
				// Joined organization (single org for now)
				organizations: org[0]
					? [
							{
								id: org[0].id,
								name: org[0].name,
								abbreviation: null, // Not yet in schema
								logoUrl: null // Not yet in schema
							}
						]
					: [],
				// Joined tags
				tags: tags
					.filter((tag) => tag != null)
					.map((tag) => ({
						id: tag.id,
						name: tag.name,
						color: tag.color
					}))
			} satisfies Event;
		})
	);

	return enrichedEvents;
}

export type EventDiscoveryFilters = {
	organizationId?: string;
	tagNames?: string[];
	orgCategoryNames?: string[];
	startDate?: Date;
	endDate?: Date;
	search?: string;
};

export type EventDiscoveryPagination = {
	page: number;
	pageSize: number;
};

export async function getEventsForDiscovery(
	filters: EventDiscoveryFilters,
	pagination: EventDiscoveryPagination
): Promise<{ events: Event[]; total: number }> {
	const tagNames = filters.tagNames ?? [];
	const orgCategoryNames = filters.orgCategoryNames ?? [];

	let tagEventIds: string[] | undefined;
	if (tagNames.length > 0) {
		const tagMatches = await db
			.select({ eventId: eventTagAssignments.eventId })
			.from(eventTagAssignments)
			.innerJoin(eventTags, eq(eventTagAssignments.tagId, eventTags.id))
			.where(inArray(eventTags.name, tagNames));
		tagEventIds = Array.from(new Set(tagMatches.map((row) => row.eventId)));
		if (tagEventIds.length === 0) {
			return { events: [], total: 0 };
		}
	}

	let orgIdsFromCategory: string[] | undefined;
	if (orgCategoryNames.length > 0) {
		const orgMatches = await db
			.select({ organizationId: organizationCategoryAssignments.organizationId })
			.from(organizationCategoryAssignments)
			.innerJoin(
				organizationCategories,
				eq(organizationCategoryAssignments.categoryId, organizationCategories.id)
			)
			.where(inArray(organizationCategories.name, orgCategoryNames));
		orgIdsFromCategory = Array.from(new Set(orgMatches.map((row) => row.organizationId)));
		if (orgIdsFromCategory.length === 0) {
			return { events: [], total: 0 };
		}
	}

	let orgIdsFromSearch: string[] | undefined;
	if (filters.search) {
		const searchMatches = await db
			.select({ id: organizations.id })
			.from(organizations)
			.where(ilike(organizations.name, `%${filters.search}%`));
		orgIdsFromSearch = searchMatches.map((row) => row.id);
	}

	const whereClauses = [] as Array<ReturnType<typeof and>>;
	if (filters.organizationId) {
		whereClauses.push(eq(events.organizationId, filters.organizationId));
	}
	if (filters.startDate) {
		whereClauses.push(gte(events.startTime, filters.startDate));
	}
	if (filters.endDate) {
		whereClauses.push(lte(events.startTime, filters.endDate));
	}
	if (tagEventIds && tagEventIds.length > 0) {
		whereClauses.push(inArray(events.id, tagEventIds));
	}
	if (orgIdsFromCategory && orgIdsFromCategory.length > 0) {
		whereClauses.push(inArray(events.organizationId, orgIdsFromCategory));
	}
	if (filters.search) {
		const searchTerm = `%${filters.search}%`;
		const searchClauses = [ilike(events.title, searchTerm), ilike(events.description, searchTerm)];
		if (orgIdsFromSearch && orgIdsFromSearch.length > 0) {
			searchClauses.push(inArray(events.organizationId, orgIdsFromSearch));
		}
		whereClauses.push(or(...searchClauses));
	}

	const whereExpression = whereClauses.length > 0 ? and(...whereClauses) : undefined;
	const offset = (pagination.page - 1) * pagination.pageSize;

	let totalQuery = db.select({ count: sql<number>`count(*)` }).from(events);
	if (whereExpression) {
		totalQuery = totalQuery.where(whereExpression);
	}
	const totalResult = await totalQuery;
	const total = totalResult[0]?.count ?? 0;

	let eventsQuery = db.select().from(events);
	if (whereExpression) {
		eventsQuery = eventsQuery.where(whereExpression);
	}
	const eventRows = await eventsQuery
		.orderBy(desc(events.startTime))
		.limit(pagination.pageSize)
		.offset(offset);

	if (eventRows.length === 0) {
		return { events: [], total };
	}

	const eventIds = eventRows.map((event) => event.id);
	const orgIds = Array.from(new Set(eventRows.map((event) => event.organizationId)));

	const [orgRows, tagRows, orgCategoryRows] = await Promise.all([
		db.select().from(organizations).where(inArray(organizations.id, orgIds)),
		db
			.select({
				eventId: eventTagAssignments.eventId,
				tagId: eventTags.id,
				tagName: eventTags.name,
				tagColor: eventTags.color
			})
			.from(eventTagAssignments)
			.innerJoin(eventTags, eq(eventTagAssignments.tagId, eventTags.id))
			.where(inArray(eventTagAssignments.eventId, eventIds)),
		db
			.select({
				organizationId: organizationCategoryAssignments.organizationId,
				categoryId: organizationCategories.id,
				categoryName: organizationCategories.name,
				categoryColor: organizationCategories.color
			})
			.from(organizationCategoryAssignments)
			.innerJoin(
				organizationCategories,
				eq(organizationCategoryAssignments.categoryId, organizationCategories.id)
			)
			.where(inArray(organizationCategoryAssignments.organizationId, orgIds))
	]);

	const orgById = new Map(orgRows.map((org) => [org.id, org]));
	const tagsByEventId = new Map<string, Event['tags']>();
	for (const row of tagRows) {
		const existing = tagsByEventId.get(row.eventId) ?? [];
		existing.push({ id: row.tagId, name: row.tagName, color: row.tagColor });
		tagsByEventId.set(row.eventId, existing);
	}

	const categoriesByOrgId = new Map<string, Array<{ id: string; name: string; color: string }>>();
	for (const row of orgCategoryRows) {
		const existing = categoriesByOrgId.get(row.organizationId) ?? [];
		existing.push({
			id: row.categoryId,
			name: row.categoryName,
			color: row.categoryColor
		});
		categoriesByOrgId.set(row.organizationId, existing);
	}

	const enrichedEvents = eventRows.map((event) => {
		const org = orgById.get(event.organizationId);
		const orgCategories = categoriesByOrgId.get(event.organizationId) ?? [];
		return {
			id: event.id,
			title: event.title,
			description: event.description,
			location: event.location,
			startTime: event.startTime.toISOString(),
			endTime: event.endTime.toISOString(),
			imageUrl: null,
			attendeeCount: null,
			rsvpUrl: null,
			feedbackUrl: null,
			organizations: org
				? [
						{
							id: org.id,
							name: org.name,
							abbreviation: null,
							logoUrl: null,
							categories: orgCategories
						}
					]
				: [],
			tags: tagsByEventId.get(event.id) ?? []
		} satisfies Event;
	});

	return { events: enrichedEvents, total };
}

/**
 * Get a single event by ID
 */
export async function getEventById(id: string): Promise<Event | null> {
	// Get event by ID
	const eventResult = await db.select().from(events).where(eq(events.id, id)).limit(1);

	if (eventResult.length === 0) return null;

	const event = eventResult[0];

	// Get organization for this event
	const org = await db
		.select()
		.from(organizations)
		.where(eq(organizations.id, event.organizationId))
		.limit(1);

	// Get tags for this event
	const tagAssignments = await db
		.select()
		.from(eventTagAssignments)
		.where(eq(eventTagAssignments.eventId, event.id));

	const tags = await Promise.all(
		tagAssignments.map(async (assignment) => {
			const tag = await db
				.select()
				.from(eventTags)
				.where(eq(eventTags.id, assignment.tagId))
				.limit(1);
			return tag[0];
		})
	);

	return {
		id: event.id,
		title: event.title,
		description: event.description,
		location: event.location,
		startTime: event.startTime.toISOString(),
		endTime: event.endTime.toISOString(),
		// Fields not yet in schema
		imageUrl: null,
		attendeeCount: null,
		rsvpUrl: null,
		feedbackUrl: null,
		// Joined organization
		organizations: org[0]
			? [
					{
						id: org[0].id,
						name: org[0].name,
						abbreviation: null,
						logoUrl: null
					}
				]
			: [],
		// Joined tags
		tags: tags
			.filter((tag) => tag != null)
			.map((tag) => ({
				id: tag.id,
				name: tag.name,
				color: tag.color
			}))
	} satisfies Event;
}

/**
 * Get all organizations with joined category data
 */
export async function getAllOrganizations(): Promise<Organization[]> {
	// Get all organizations
	const allOrgs = await db.select().from(organizations);

	// Transform each organization with joined data
	const enrichedOrgs = await Promise.all(
		allOrgs.map(async (org) => {
			// Get categories for this organization
			const categoryAssignments = await db
				.select()
				.from(organizationCategoryAssignments)
				.where(eq(organizationCategoryAssignments.organizationId, org.id));

			const categories = await Promise.all(
				categoryAssignments.map(async (assignment) => {
					const cat = await db
						.select()
						.from(organizationCategories)
						.where(eq(organizationCategories.id, assignment.categoryId))
						.limit(1);
					return cat[0];
				})
			);

			return {
				id: org.id,
				name: org.name,
				description: org.description,
				contactEmail: org.contactEmail,
				// Fields not yet in schema
				abbreviation: null,
				logoUrl: null,
				bannerImageUrl: null,
				memberCount: null,
				establishedDate: null,
				websiteUrl: null,
				feedbackUrl: null,
				// Joined categories
				categories: categories
					.filter((cat) => cat != null)
					.map((cat) => ({
						id: cat.id,
						name: cat.name,
						color: cat.color
					})),
				// Board members not yet implemented
				boardMembers: []
			} satisfies Organization;
		})
	);

	return enrichedOrgs;
}

/**
 * Get a single organization by ID
 */
export async function getOrganizationById(id: string): Promise<Organization | null> {
	// Get organization by ID
	const orgResult = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);

	if (orgResult.length === 0) return null;

	const org = orgResult[0];

	// Get categories for this organization
	const categoryAssignments = await db
		.select()
		.from(organizationCategoryAssignments)
		.where(eq(organizationCategoryAssignments.organizationId, org.id));

	const categories = await Promise.all(
		categoryAssignments.map(async (assignment) => {
			const cat = await db
				.select()
				.from(organizationCategories)
				.where(eq(organizationCategories.id, assignment.categoryId))
				.limit(1);
			return cat[0];
		})
	);

	return {
		id: org.id,
		name: org.name,
		description: org.description,
		contactEmail: org.contactEmail,
		// Fields not yet in schema
		abbreviation: null,
		logoUrl: null,
		bannerImageUrl: null,
		memberCount: null,
		establishedDate: null,
		websiteUrl: null,
		feedbackUrl: null,
		// Joined categories
		categories: categories
			.filter((cat) => cat != null)
			.map((cat) => ({
				id: cat.id,
				name: cat.name,
				color: cat.color
			})),
		// Board members not yet implemented
		boardMembers: []
	} satisfies Organization;
}

/**
 * Get all event tags
 */
export async function getAllEventTags(): Promise<EventTag[]> {
	const tags = await db.select().from(eventTags);

	return tags.map((tag) => ({
		id: tag.id,
		name: tag.name,
		color: tag.color
	}));
}

/**
 * Get all organization categories
 */
export async function getAllOrganizationCategories(): Promise<OrganizationCategory[]> {
	const categories = await db.select().from(organizationCategories);

	return categories.map((cat) => ({
		id: cat.id,
		name: cat.name,
		color: cat.color
	}));
}

/**
 * Get events for a specific organization
 */
export async function getEventsByOrganization(orgId: string): Promise<Event[]> {
	// Get all events for this organization
	const orgEvents = await db.select().from(events).where(eq(events.organizationId, orgId));

	// Transform each event with joined data
	const enrichedEvents = await Promise.all(
		orgEvents.map(async (event) => {
			// Get organization for this event
			const org = await db
				.select()
				.from(organizations)
				.where(eq(organizations.id, event.organizationId))
				.limit(1);

			// Get tags for this event
			const tagAssignments = await db
				.select()
				.from(eventTagAssignments)
				.where(eq(eventTagAssignments.eventId, event.id));

			const tags = await Promise.all(
				tagAssignments.map(async (assignment) => {
					const tag = await db
						.select()
						.from(eventTags)
						.where(eq(eventTags.id, assignment.tagId))
						.limit(1);
					return tag[0];
				})
			);

			return {
				id: event.id,
				title: event.title,
				description: event.description,
				location: event.location,
				startTime: event.startTime.toISOString(),
				endTime: event.endTime.toISOString(),
				// Fields not yet in schema
				imageUrl: null,
				attendeeCount: null,
				rsvpUrl: null,
				feedbackUrl: null,
				// Joined organization
				organizations: org[0]
					? [
							{
								id: org[0].id,
								name: org[0].name,
								abbreviation: null,
								logoUrl: null
							}
						]
					: [],
				// Joined tags
				tags: tags
					.filter((tag) => tag != null)
					.map((tag) => ({
						id: tag.id,
						name: tag.name,
						color: tag.color
					}))
			} satisfies Event;
		})
	);

	return enrichedEvents;
}

/**
 * Update an event's editable fields and sync its tag assignments.
 *
 * Only persists fields that currently exist in the DB schema.
 * TODO: persist when DB columns exist:
 *   imageUrl, rsvpUrl, feedbackUrl
 */
export async function updateEvent(
	id: string,
	data: {
		title: string;
		description: string | null;
		location: string;
		startTime: Date;
		endTime: Date;
		tagIds: string[];
	}
): Promise<Event | null> {
	const { title, description, location, startTime, endTime, tagIds } = data;

	// Update the core event row
	await db
		.update(events)
		.set({ title, description, location, startTime, endTime, updatedAt: new Date() })
		.where(eq(events.id, id));

	// Sync tags
	await db.delete(eventTagAssignments).where(eq(eventTagAssignments.eventId, id));

	if (tagIds.length > 0) {
		await db.insert(eventTagAssignments).values(
			tagIds.map((tagId) => ({
				eventId: id,
				tagId
			}))
		);
	}

	return getEventById(id);
}

/**
 * Update an organization's editable fields and sync its category assignments.
 *
 * Only persists fields that currently exist in the DB schema.
 * TODO: persist when DB columns exist:
 *   websiteUrl, feedbackUrl, logoUrl, bannerImageUrl, abbreviation, establishedDate
 */
export async function updateOrganization(
	id: string,
	data: {
		name: string;
		description: string | null;
		contactEmail: string;
		categoryIds: string[];
	}
): Promise<Organization | null> {
	const { name, description, contactEmail, categoryIds } = data;

	// Update the core org row
	await db
		.update(organizations)
		.set({ name, description, contactEmail, updatedAt: new Date() })
		.where(eq(organizations.id, id));

	// Sync categories
	await db
		.delete(organizationCategoryAssignments)
		.where(eq(organizationCategoryAssignments.organizationId, id));

	if (categoryIds.length > 0) {
		await db.insert(organizationCategoryAssignments).values(
			categoryIds.map((categoryId) => ({
				organizationId: id,
				categoryId
			}))
		);
	}

	return getOrganizationById(id);
}
