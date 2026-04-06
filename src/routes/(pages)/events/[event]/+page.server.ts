import type { PageServerLoad } from './$types.js';
import { getEventById } from '$lib/server/db/dataHelpers.js';
import { canManageOrg } from '$lib/server/authz.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { params } = event;

	const eventData = await getEventById(params.event);

	if (!eventData) {
		throw error(404, 'Event not found');
	}

	const userId = event.locals.session?.user?.id;
	const orgId = eventData.organizations?.[0]?.id;
	const canEdit = userId && orgId ? await canManageOrg(userId, orgId) : false;

	return { event: eventData, canEdit };
};
