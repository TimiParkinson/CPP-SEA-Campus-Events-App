import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, organizationMembers, organizations, events } from '$lib/server/db/schema';
import { and, eq, gte, inArray, asc } from 'drizzle-orm';

type LocalsLike = {
	session?: {
		user?: { id: string };
	};
};

export async function getCurrentUserProfileBundle(locals: LocalsLike) {
	// 1) Auth guard
	if (!locals.session?.user) {
		throw redirect(303, '/signin');
	}

	const authUserId = locals.session.user.id;

	// 2) User profile
	const user = await db.query.users.findFirst({
		where: eq(users.id, authUserId)
	});

	if (!user) {
		// Should not happen if trigger/backfill worked
		throw redirect(303, '/signin');
	}

	// 3) Org memberships
	const memberships = await db
		.select({
			id: organizations.id,
			name: organizations.name,
			description: organizations.description,
			role: organizationMembers.role
		})
		.from(organizationMembers)
		.innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
		.where(eq(organizationMembers.userId, user.id));

	const orgIds = memberships.map((m) => m.id);

	// 4) Upcoming events
	const now = new Date();
	const upcomingRaw =
		orgIds.length === 0
			? []
			: await db
					.select({
						id: events.id,
						title: events.title,
						location: events.location,
						startTime: events.startTime,
						endTime: events.endTime,
						organizationId: organizations.id,
						organizationName: organizations.name
					})
					.from(events)
					.innerJoin(organizations, eq(events.organizationId, organizations.id))
					.where(and(inArray(events.organizationId, orgIds), gte(events.startTime, now)))
					.orderBy(asc(events.startTime))
					.limit(20);

	// 5) Date → ISO boundary conversion
	const upcomingEvents = upcomingRaw.map((e) => ({
		id: e.id,
		title: e.title,
		location: e.location,
		startTime: e.startTime.toISOString(),
		endTime: e.endTime.toISOString(),
		organization: {
			id: e.organizationId,
			name: e.organizationName
		}
	}));

	// 6) Return consistent shape
	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			age: user.age ?? null
		},
		organizations: memberships,
		upcomingEvents
	};
}
