import type { PageServerLoad } from './$types.js';
import { getOrganizationById, getEventsByOrganization } from '$lib/server/db/dataHelpers.js';
import { canManageOrg } from '$lib/server/authz.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { params } = event;

	// Fetch organization and events from database
	const [organization, allOrgEvents] = await Promise.all([
		getOrganizationById(params.organization),
		getEventsByOrganization(params.organization)
	]);

	if (!organization) {
		throw error(404, 'Organization not found');
	}

	// Filter upcoming/past events by date
	const now = new Date();
	const upcomingEvents = allOrgEvents.filter((e) => new Date(e.startTime) > now).slice(0, 2);
	const pastEvents = allOrgEvents.filter((e) => new Date(e.startTime) < now);

	const userId = event.locals.session?.user?.id;
	const canEdit = userId ? await canManageOrg(userId, organization.id) : false;

	return {
		organization,
		upcomingEvents,
		pastEvents,
		canEdit
	};
};
