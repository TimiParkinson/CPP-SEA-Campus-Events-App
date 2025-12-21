import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, organizationMembers, organizations, events } from '$lib/server/db/schema';
import { eq, and, inArray, gte, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	// 1. Auth guard
	if (!locals.session?.user) {
		throw redirect(303, '/signin');
	}

	const authUserId = locals.session.user.id;

	// 2. Fetch user profile
	const user = await db.query.users.findFirst({
		where: eq(users.id, authUserId)
	});

	if (!user) {
		// This should never happen if trigger/backfill worked
		throw redirect(303, '/signin');
	}

	// 3. Fetch user's organizations (subscriptions)
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

	const organizationIds = memberships.map((m) => m.id);

	// 4. Fetch upcoming events from user's organizations
	const now = new Date();

	const upcomingRaw =
		organizationIds.length === 0
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
					.where(and(inArray(events.organizationId, organizationIds), gte(events.startTime, now)))
					.orderBy(asc(events.startTime))
					.limit(20);

	// 5. Convert Dates → ISO strings (boundary step)
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

	// 6. Return data to the page
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
};
