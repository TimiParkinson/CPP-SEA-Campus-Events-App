import type { PageServerLoad } from './$types.js';
import { getEventById } from '$lib/server/db/dataHelpers.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	// Currently return seed mock data for event
	const event = getEventById(params.event);

	if (!event) {
		throw error(404, 'Event not found');
	}

	return { event };

	// when backend ready:

	// try {
	//   const response = await fetch(`/api/events/${params.event}`);
	//   if (!response.ok) {
	//     throw error(response.status, 'Event not found');
	//   }
	//   const event = await response.json();
	//   return { event };
	// } catch (err) {
	//   throw error(404, 'Event not found');
	// }
};
