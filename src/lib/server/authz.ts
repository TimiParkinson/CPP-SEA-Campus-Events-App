import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db/index.js';
import { organizationMembers, users } from '$lib/server/db/schema.js';

// Authentication: "Is the user logged in?"
//- Uses SvelteKit `event.locals.session` (Supabase session set by hooks)
//- If no session, redirect to /signin.
// Returns the authenticated user's id for later checks
export function requireAuth(event: RequestEvent): string {
	const userId = event.locals.session?.user?.id;
	if (!userId) throw redirect(303, '/signin');
	return userId;
}

// Authorization: "Is the user a school admin?"
// - Looks up the user's role from the table 'public.users'
// - This is a GLOBAL role (not per org)
export async function isAdmin(userId: string): Promise<boolean> {
	const row = await db.query.users.findFirst({
		columns: { role: true },
		where: eq(users.id, userId)
	});

	return row?.role === 'admin';
}

// Authorization: "Can this user manage this specific org?"
// - Allowed if user is Admin or user is board_member/president in organization_members for that specific org
export async function canManageOrg(userId: string, orgId: string): Promise<boolean> {
	// Admins can manage everything (global ovveride)
	if (await isAdmin(userId)) return true;

	// Otherwise, check membership role for this org
	const membership = await db.query.organizationMembers.findFirst({
		columns: { role: true },
		where: and(
			eq(organizationMembers.userId, userId),
			eq(organizationMembers.organizationId, orgId)
		)
	});

	// Only board_members/president can manage an org
	return membership?.role === 'board_member' || membership?.role === 'president';
}

// Authorization helper:
// - We use this inside endpoints/actions to actually BLOCK unauthorized requests
// - Throws a 403 (Forbidden) instead of returning boolean
export async function requireCanManageOrg(userId: string, orgId: string): Promise<void> {
	const ok = await canManageOrg(userId, orgId);
	if (!ok) throw error(403, 'Forbidden');
}
