import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';
import { validateEventUpdate } from '$lib/server/validation/events.js';

export async function PUT(event) {
	const userId = requireAuth(event);
	const id = event.params.id;

	// Load the event first to get the REAL orgId from the database.
	// This prevents a user from editing another org's event by spoofing orgId in the body.
	const existing = await db.query.events.findFirst({
		columns: { id: true, organizationId: true, startTime: true, endTime: true },
		where: eq(events.id, id)
	});

	if (!existing) return json({ error: 'Not found' }, { status: 404 });

	// Enforce per-org leadership (or admin)
	await requireCanManageOrg(userId, existing.organizationId);

	let patch: unknown;
	try {
		patch = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const validation = validateEventUpdate(patch, {
		existingStartTime: existing.startTime,
		existingEndTime: existing.endTime
	});

	if (!validation.ok) {
		return json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
	}

	const updated = await db
		.update(events)
		.set(validation.value)
		.where(eq(events.id, id))
		.returning();
	return json(updated[0]);
}

export async function DELETE(event) {
	const userId = requireAuth(event);
	const id = event.params.id;

	// Same pattern: load event -> enforce based on event's orgId -> then delete.
	const existing = await db.query.events.findFirst({
		columns: { id: true, organizationId: true },
		where: eq(events.id, id)
	});

	if (!existing) return json({ error: 'Not found' }, { status: 404 });

	await requireCanManageOrg(userId, existing.organizationId);

	await db.delete(events).where(eq(events.id, id));
	return json({ ok: true });
}
