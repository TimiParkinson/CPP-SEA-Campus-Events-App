import type { PageServerLoad } from './$types.js';
import { getAllEvents, getAllOrganizations } from '$lib/server/db/dataHelpers.js';

export const load: PageServerLoad = async () => {
	// Currently return seed mock data
	// What is considered "Featured" is yet to be confirmed
	const allEvents = getAllEvents();
	const allOrgs = getAllOrganizations();

	return {
		featuredOrgs: allOrgs.slice(0, 5),
		featuredEvents: allEvents.slice(0, 4)
	};

	// when backend ready:

	// const response = await fetch('/api/events');
	// const events = await response.json();
	// const orgResponse = await fetch('/api/organizations');
	// const orgs = await orgResponse.json();
	// return {
	//   featuredOrgs: orgs.slice(0, 5),
	//   featuredEvents: events.slice(0, 4)
	// };
};
