import type { PageServerLoad } from './$types.js';
import {
	getAllEvents,
	getAllOrganizations,
	getAllEventTags,
	getAllOrganizationCategories
} from '$lib/server/db/dataHelpers.js';

export const load: PageServerLoad = async () => {
	// Fetch all data from database
	const [events, organizations, eventTags, organizationCategories] = await Promise.all([
		getAllEvents(),
		getAllOrganizations(),
		getAllEventTags(),
		getAllOrganizationCategories()
	]);

	return {
		events,
		organizations,
		eventTags,
		organizationCategories
	};
};
