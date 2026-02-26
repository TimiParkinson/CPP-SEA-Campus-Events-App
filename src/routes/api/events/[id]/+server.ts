import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, requireCanManageOrg } from '$lib/server/authz';
import { getOrganizationById } from '$lib/server/db/dataHelpers.js';

export async function PUT(event) {
	const userId = requireAuth(event);
	const id = event.params.id;

	// Load the event first to get the REAL orgId from the database
	// This pervents a user from editing another org's event by spoofing ordId in the body
	const existing = await db.query.event.findFirst({
		columns: { id: true, organizationId: true },
		where: eq(event.id, id)
	});

	if (!existing) return json({ error: 'Not found ' }, { status: 404 });

	// Enforce per-org leadership (or admin)
	await requireCanManageOrg(userId, existing.organizationId);

	const patch = await event.request.json();

	// Security: never allow clients to rewrite ownership fields
	delete patch.createdBy;
	delete patch.organizationId;

	const updated = await db.update(events).set(patch).where(eq(events.id, id)).returning();
	return json(updated[0]);
}

export async function DELETE(event) {
    const userId = requireAuth(event);
    const id = event.params.id;

    // This is the same pattern: load event -> enforce based on events orgID -> then delete
    const existing = await db.query.events.findFirst({
        columns: { id: true, organizationId: true },
        where: eq(events.id, id);
    });

    if (!existing) return json({ error: 'Not found' }, { status: 404});

    await requireCanManageOrg(userId, existing.organizationId);

    await db.delete(events).where(eq(events.id, id));
    return json({ ok: true });
}
