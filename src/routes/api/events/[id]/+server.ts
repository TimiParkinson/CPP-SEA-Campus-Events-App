import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';

function parseDate(value: unknown): Date | null {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	if (typeof value === 'string') {
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}
	return null;
}

export async function PUT(event) {
	const userId = requireAuth(event);
	const id = event.params.id;

	// Load the event first to get the REAL orgId from the database.
	// This prevents a user from editing another org's event by spoofing orgId in the body.
	const existing = await db.query.events.findFirst({
		columns: { id: true, organizationId: true },
		where: eq(events.id, id)
	});

	if (!existing) return json({ error: 'Not found' }, { status: 404 });

	// Enforce per-org leadership (or admin)
	await requireCanManageOrg(userId, existing.organizationId);

	const patch = await event.request.json();

	// If client sends ISO strings for timestamps, convert them to Date objects for Drizzle.
	if ('startTime' in patch) {
		const parsed = parseDate(patch.startTime);
		if (!parsed)
			return json({ error: 'startTime must be a valid ISO date string' }, { status: 400 });
		patch.startTime = parsed;
	}
	if ('endTime' in patch) {
		const parsed = parseDate(patch.endTime);
		if (!parsed) return json({ error: 'endTime must be a valid ISO date string' }, { status: 400 });
		patch.endTime = parsed;
	}

	// Security: never allow clients to rewrite ownership fields.
	delete patch.createdBy;
	delete patch.organizationId;

	const updated = await db.update(events).set(patch).where(eq(events.id, id)).returning();
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
