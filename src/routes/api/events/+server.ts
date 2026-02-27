// src/routes/api/events/+server.ts
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { error as kitError, isHttpError, isRedirect, json } from '@sveltejs/kit';
import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function parseDate(value: unknown): Date | null {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	if (typeof value === 'string') {
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}
	return null;
}

export async function GET() {
	// Public list for now, if we want private drafts later, we can add authz here
	try {
		const allEvents = await db.select().from(events);
		return json(allEvents);
	} catch (error) {
		console.error('Error fetching events:', error);
		return json({ error: 'Failed to fetch events' }, { status: 500 });
	}
}

export async function POST(event) {
	// Server enforcement, students should not be able to POST /api/events unless they manage that org
	const userId = requireAuth(event); // Blocks anonymous users

	try {
		const data = await event.request.json();

		// Security: organizationId MUST come from the request for a create,
		// but we validate it and then check membership on the server
		const organizationId = data.organizationId;
		if (!isNonEmptyString(organizationId)) {
			return json({ error: 'organizationId is required' }, { status: 400 });
		}

		if (!isNonEmptyString(data.title)) {
			return json({ error: 'title is required' }, { status: 400 });
		}
		if (!isNonEmptyString(data.location)) {
			return json({ error: 'location is required' }, { status: 400 });
		}

		// Drizzle timestamps are configured to expect Date objects.
		const startTime = parseDate(data.startTime);
		const endTime = parseDate(data.endTime);
		if (!startTime) {
			return json({ error: 'startTime must be a valid ISO date string' }, { status: 400 });
		}
		if (!endTime) {
			return json({ error: 'endTime must be a valid ISO date string' }, { status: 400 });
		}

		// Blocks: non-admin users who are not board_member/president for this org
		await requireCanManageOrg(userId, organizationId);

		// Security: never trust client-provided createdBy
		const insertData = {
			...data,
			startTime,
			endTime,
			createdBy: userId
		};

		const created = await db.insert(events).values(insertData).returning();
		return json(created[0], { status: 201 });
	} catch (err) {
		// Keep intentional redirects / HTTP errors (e.g., 303 to /signin, 403 Forbidden)
		if (isRedirect(err) || isHttpError(err)) throw err;

		console.error('Error creating event:', err);
		throw kitError(500, 'Failed to create event');
	}
}
