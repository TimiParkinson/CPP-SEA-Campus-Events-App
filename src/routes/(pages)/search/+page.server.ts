import type { PageServerLoad } from './$types.js';
import {
	getAllEvents,
	getAllOrganizations,
	getAllEventTags,
	getAllOrganizationCategories
} from '$lib/server/db/dataHelpers.js';

export const load: PageServerLoad = async () => {
	// Currently return seed mock data
	return {
		events: getAllEvents(),
		organizations: getAllOrganizations(),
		eventTags: getAllEventTags(),
		organizationCategories: getAllOrganizationCategories()
	};

	// when backend ready:

	// const [eventsRes, orgsRes, tagsRes, categoriesRes] = await Promise.all([
	//   fetch('/api/events'),
	//   fetch('/api/organizations'),
	//   fetch('/api/event-tags'),
	//   fetch('/api/organization-categories')
	// ]);
	// const [events, organizations, eventTags, organizationCategories] = await Promise.all([
	//   eventsRes.json(),
	//   orgsRes.json(),
	//   tagsRes.json(),
	//   categoriesRes.json()
	// ]);
	// return { events, organizations, eventTags, organizationCategories };
};
