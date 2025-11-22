/**
 * Helper functions to transform database rows to match required frontend types.
 * Currently, with mock data, only simulates JOINs between tables (events ↔ orgs, events ↔ tags, orgs ↔ categories).
 * Logic to grab data will need to be slightly modified when real database query results are connected.
 * Some fields may also need to be changed from null to a value when implemented.
 *
 * /api/../+server.ts will need to call these helpers when database is connected to transform
 * database DB data into frontend types -> also handles missing data.
 */

import type { Event, Organization, EventTag, OrganizationCategory } from '$lib/types/index.js';
import { seedMock } from './mockData.js';

// Generate slugs based on names (mock data doesn't contain id)
function generateId(name: string): string {
	return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get all events with joined organization and tag data
 *
 * Handles both single org (current schema) and multiple orgs via junction table (future)
 *
 * CURRENT:
 *   event.org = 'Computer Science Club'  (single string)
 *   → Returns: organizations: [{ id: 'computer-science-club', name: 'Computer Science Club' }]
 *
 * FUTURE?:
 *   eventOrganizationAssignments: [
 *     { eventTitle: 'Workshop', org: 'Computer Science Club' },
 *     { eventTitle: 'Workshop', org: 'Career Center' }
 *   ]
 *   → Returns: organizations: [
 *       { id: 'computer-science-club', name: 'Computer Science Club' },
 *       { id: 'career-center', name: 'Career Center' }
 *     ]
 */
export function getAllEvents(): Event[] {
	return seedMock.events.map((event) => {
		// Handle organizations
		let organizations: Array<{
			id: string;
			name: string;
			abbreviation: string | null;
			logoUrl: string | null;
		}> = [];

		// Check if junction table for multiple orgs exists
		const orgAssignments = (seedMock as any).eventOrganizationAssignments?.filter(
			(a: any) => a.eventTitle === event.title
		);

		if (orgAssignments && orgAssignments.length > 0) {
			// Multiple orgs
			organizations = orgAssignments.map((assignment: any) => {
				const org = seedMock.organizations.find((o) => o.name === assignment.org);
				return {
					id: generateId(org?.name || ''),
					name: org?.name || '',
					abbreviation: null,
					logoUrl: null
				};
			});
		} else if ((event as any).org) {
			// Single org field
			const org = seedMock.organizations.find((o) => o.name === (event as any).org);
			organizations = org
				? [
						{
							id: generateId(org.name),
							name: org.name,
							abbreviation: null,
							logoUrl: null
						}
					]
				: [];
		}

		// Handle tags
		const tagAssignment = seedMock.eventTagAssignments.find((a) => a.eventTitle === event.title);

		return {
			id: generateId(event.title),
			title: event.title,
			description: event.description,
			location: event.location,
			startTime: event.startTime.toISOString(),
			endTime: event.endTime.toISOString(),
			organizations,
			// Tags array (simulates join)
			tags: tagAssignment
				? tagAssignment.tags.map((tagName) => {
						const tag = seedMock.eventTags.find((t) => t.name === tagName);
						return {
							id: generateId(tagName),
							name: tagName,
							color: tag?.color || '#999999'
						};
					})
				: []
		};
	});
}

/**
 * Get a single event by ID (slug)
 *
 * Handles both single org (current schema) and multiple orgs via junction table (future)
 */
export function getEventById(id: string): Event | null {
	const event = seedMock.events.find((e) => generateId(e.title) === id);
	if (!event) return null;

	// Handle organizations
	let organizations: Array<{
		id: string;
		name: string;
		abbreviation: string | null;
		logoUrl: string | null;
	}> = [];

	// Check if junction table for multiple orgs exists
	const orgAssignments = (seedMock as any).eventOrganizationAssignments?.filter(
		(a: any) => a.eventTitle === event.title
	);

	if (orgAssignments && orgAssignments.length > 0) {
		// Multiple orgs
		organizations = orgAssignments.map((assignment: any) => {
			const org = seedMock.organizations.find((o) => o.name === assignment.org);
			return {
				id: generateId(org?.name || ''),
				name: org?.name || '',
				abbreviation: null,
				logoUrl: null
			};
		});
	} else if ((event as any).org) {
		// Single org
		const org = seedMock.organizations.find((o) => o.name === (event as any).org);
		organizations = org
			? [
					{
						id: generateId(org.name),
						name: org.name,
						abbreviation: null,
						logoUrl: null
					}
				]
			: [];
	}

	const tagAssignment = seedMock.eventTagAssignments.find((a) => a.eventTitle === event.title);

	return {
		id: generateId(event.title),
		title: event.title,
		description: event.description,
		location: event.location,
		startTime: event.startTime.toISOString(),
		endTime: event.endTime.toISOString(),
		organizations,
		tags: tagAssignment
			? tagAssignment.tags.map((tagName) => {
					const tag = seedMock.eventTags.find((t) => t.name === tagName);
					return {
						id: generateId(tagName),
						name: tagName,
						color: tag?.color || '#999999'
					};
				})
			: []
	};
}

/**
 * Get all organizations with joined category data
 */
export function getAllOrganizations(): Organization[] {
	return seedMock.organizations.map((org) => {
		const categoryAssignments = seedMock.organizationCategoryAssignments.filter(
			(a) => a.org === org.name
		);

		return {
			id: generateId(org.name),
			name: org.name,
			description: org.description,
			contactEmail: org.contactEmail,
			abbreviation: null,
			logoUrl: null,
			// Categories array (simulates join)
			categories: categoryAssignments.map((assignment) => {
				const cat = seedMock.organizationCategories.find((c) => c.name === assignment.cat);
				return {
					id: generateId(assignment.cat),
					name: assignment.cat,
					color: cat?.color || '#999999'
				};
			})
		};
	});
}

/**
 * Get a single organization by ID (slug)
 */
export function getOrganizationById(id: string): Organization | null {
	const org = seedMock.organizations.find((o) => generateId(o.name) === id);
	if (!org) return null;

	const categoryAssignments = seedMock.organizationCategoryAssignments.filter(
		(a) => a.org === org.name
	);

	return {
		id: generateId(org.name),
		name: org.name,
		description: org.description,
		contactEmail: org.contactEmail,
		abbreviation: null, // TODO: Add to mockData when available
		logoUrl: null, // TODO: Add to mockData when available
		categories: categoryAssignments.map((assignment) => {
			const cat = seedMock.organizationCategories.find((c) => c.name === assignment.cat);
			return {
				id: generateId(assignment.cat),
				name: assignment.cat,
				color: cat?.color || '#999999'
			};
		})
	};
}

/**
 * Get all event tags
 */
export function getAllEventTags(): EventTag[] {
	return seedMock.eventTags.map((tag) => ({
		id: generateId(tag.name),
		name: tag.name,
		color: tag.color
	}));
}

/**
 * Get all organization categories
 */
export function getAllOrganizationCategories(): OrganizationCategory[] {
	return seedMock.organizationCategories.map((cat) => ({
		id: generateId(cat.name),
		name: cat.name,
		color: cat.color
	}));
}

/**
 * Get events for a specific organization
 */
export function getEventsByOrganization(orgId: string): Event[] {
	const org = seedMock.organizations.find((o) => generateId(o.name) === orgId);
	if (!org) return [];

	return getAllEvents().filter((event) => event.organizations?.some((o) => o.id === orgId));
}
