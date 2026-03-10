import type { PageServerLoad } from './$types.js';
import { getAllEvents, getAllOrganizations } from '$lib/server/db/dataHelpers.js';

export const load: PageServerLoad = async () => {
	// Fetch data from database
	// What is considered "Featured" is yet to be confirmed
	const [allEvents, allOrgs] = await Promise.all([getAllEvents(), getAllOrganizations()]);

	return {
		featuredOrgs: allOrgs.slice(0, 5),
		featuredEvents: allEvents.slice(0, 4)
	};
};
