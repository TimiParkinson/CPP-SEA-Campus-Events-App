import type { PageServerLoad } from './$types.js';
import { getEventById } from '$lib/server/db/dataHelpers.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	// Fetch event from database
	const event = await getEventById(params.event);

	if (!event) {
		throw error(404, 'Event not found');
	}

	return { event };
};
