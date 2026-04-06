// TODO: re-enable auth + permission checks once test accounts have the correct roles assigned
import type { PageServerLoad, Actions } from './$types.js';
import { error, redirect, fail } from '@sveltejs/kit';
// import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';
import {
	getEventById,
	getAllEventTags,
	updateEvent
} from '$lib/server/db/dataHelpers.js';

export const load: PageServerLoad = async (event) => {
	// const userId = requireAuth(event); // redirects to /signin if not authenticated
	const eventId = event.params.event;

	const [eventData, allTags] = await Promise.all([getEventById(eventId), getAllEventTags()]);

	if (!eventData) throw error(404, 'Event not found');

	// await requireCanManageOrg(userId, eventData.organizations?.[0]?.id ?? '');

	return { event: eventData, allTags };
};

const URL_RE = /^https?:\/\/.+/;

export const actions: Actions = {
	default: async (event) => {
		// const userId = requireAuth(event);
		const eventId = event.params.event;

		// Re-verify permission on POST
		// const eventData = await getEventById(eventId);
		// await requireCanManageOrg(userId, eventData?.organizations?.[0]?.id ?? '');

		const formData = await event.request.formData();

		const title = (formData.get('title') as string)?.trim() ?? '';
		const description = (formData.get('description') as string)?.trim() || null;
		const location = (formData.get('location') as string)?.trim() ?? '';
		const startTimeRaw = (formData.get('startTime') as string)?.trim() ?? '';
		const endTimeRaw = (formData.get('endTime') as string)?.trim() ?? '';
		const tagIds = formData.getAll('tagIds') as string[];

		const errors: Record<string, string> = {};

		if (title.length < 2) errors.title = 'Title must be at least 2 characters.';
		if (title.length > 320) errors.title = 'Title must be 320 characters or fewer.';
		if (location.length < 1) errors.location = 'Location is required.';
		if (!startTimeRaw) errors.startTime = 'Start time is required.';
		if (!endTimeRaw) errors.endTime = 'End time is required.';

		const startTime = startTimeRaw ? new Date(startTimeRaw) : null;
		const endTime = endTimeRaw ? new Date(endTimeRaw) : null;

		if (startTime && endTime && endTime <= startTime) {
			errors.endTime = 'End time must be after start time.';
		}

		// Optional URL fields — validate format only if a value was provided
		const rsvpUrl = (formData.get('rsvpUrl') as string)?.trim() || null;
		const feedbackUrl = (formData.get('feedbackUrl') as string)?.trim() || null;
		const imageUrl = (formData.get('imageUrl') as string)?.trim() || null;
		if (rsvpUrl && !URL_RE.test(rsvpUrl))
			errors.rsvpUrl = 'Enter a valid URL (must start with http:// or https://).';
		if (feedbackUrl && !URL_RE.test(feedbackUrl))
			errors.feedbackUrl = 'Enter a valid URL (must start with http:// or https://).';
		if (imageUrl && !URL_RE.test(imageUrl))
			errors.imageUrl = 'Enter a valid URL (must start with http:// or https://).';

		if (Object.keys(errors).length > 0) {
			return fail(422, {
				errors,
				values: { title, description, location, startTimeRaw, endTimeRaw, tagIds, rsvpUrl, feedbackUrl, imageUrl }
			});
		}

		await updateEvent(eventId, {
			title,
			description,
			location,
			startTime: startTime!,
			endTime: endTime!,
			tagIds
		});

		throw redirect(303, `/events/${eventId}`);
	}
};
