// src/routes/api/events/+server.ts
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { error as kitError, isHttpError, isRedirect, json } from '@sveltejs/kit';
import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';
import { validateEventCreate } from '$lib/server/validation/events.js';

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

	let data: unknown;
	try {
		data = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const validation = validateEventCreate(data);
	if (!validation.ok) {
		return json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
	}

	try {
		// Blocks: non-admin users who are not board_member/president for this org
		await requireCanManageOrg(userId, validation.value.organizationId);

		// Security: never trust client-provided createdBy
		const insertData = {
			...validation.value,
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
