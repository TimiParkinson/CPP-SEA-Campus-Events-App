import { json, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, organizationMembers, organizations, events } from '$lib/server/db/schema';
import { and, eq, gte, inArray, asc } from 'drizzle-orm';

export async function GET({ locals }) {
	if (!locals.session?.user) throw redirect(303, '/signin');

	const authId = locals.session.user.id;

	const user = await db.query.users.findFirst({ where: eq(users.id, authId) });
	if (!user) throw redirect(303, '/signin');

	const memberships = await db
		.select({
			orgId: organizations.id,
			orgName: organizations.name,
			orgDescription: organizations.description,
			orgContactEmail: organizations.contactEmail,
			memberRole: organizationMembers.role
		})
		.from(organizationMembers)
		.innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
		.where(eq(organizationMembers.userId, user.id));

	const orgIds = memberships.map((m) => m.orgId);
	const now = new Date();

	const upcomingEvents =
		orgIds.length === 0
			? []
			: await db
					.select()
					.from(events)
					.where(and(inArray(events.organizationId, orgIds), gte(events.startTime, now)))
					.orderBy(asc(events.startTime))
					.limit(25);

	return json({ user, organizations: memberships, upcomingEvents });
}
