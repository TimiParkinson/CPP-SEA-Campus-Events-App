import type { PageServerLoad } from './$types.js';
import { getOrganizationById, getEventsByOrganization } from '$lib/server/db/dataHelpers.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	// Currently return seed mock data for organization
	const organization = getOrganizationById(params.organization);

	if (!organization) {
		throw error(404, 'Organization not found');
	}

	// Get events for this organization
	const allOrgEvents = getEventsByOrganization(params.organization);

	// Filter upcoming/past events by date
	const now = new Date();
	const upcomingEvents = allOrgEvents.filter((e) => new Date(e.startTime) > now).slice(0, 2);
	const pastEvents = allOrgEvents.filter((e) => new Date(e.startTime) < now);

	return {
		organization,
		upcomingEvents,
		pastEvents
	};

	// when backend ready:

	// try {
	//   const [orgRes, eventsRes] = await Promise.all([
	//     fetch(`/api/organizations/${params.organization}`),
	//     fetch(`/api/events?organization=${params.organization}`)
	//   ]);
	//   if (!orgRes.ok) {
	//     throw error(orgRes.status, 'Organization not found');
	//   }
	//   const organization = await orgRes.json();
	//   const allEvents = await eventsRes.json();
	//   const now = new Date();
	//   const upcomingEvents = allEvents.filter(e => new Date(e.startTime) > now).slice(0, 2);
	//   const pastEvents = allEvents.filter(e => new Date(e.startTime) < now);
	//   return { organization, upcomingEvents, pastEvents };
	// } catch (err) {
	//   throw error(404, 'Organization not found');
	// }
};
