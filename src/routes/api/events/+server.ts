// src/routes/api/events/+server.ts
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';
import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';

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
		if (!organizationId) {
			return json({ error: 'organizationId is required' }, { status: 400 });
		}

		// Blocks: non-admin users who are not board_member/president for this org
		await requireCanManageOrg(userId, organizationId);

		// Security: never trust client-provided createdBy
		const insertData = {
			...data,
			createdBy: userId
		};

		const created = await db.insert(events).values(insertData).returning();
		return json(created[0], { status: 201 });
	} catch (error) {
		console.error('Error creating event:', error);
		return json({ error: 'Failed to create event' }, { status: 500 });
	}
}
