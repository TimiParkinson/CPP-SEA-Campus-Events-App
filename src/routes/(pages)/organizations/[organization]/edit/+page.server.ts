// TODO: re-enable auth + permission checks once test accounts have the correct roles assigned
import type { PageServerLoad, Actions } from './$types.js';
import { error, redirect, fail } from '@sveltejs/kit';
// import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';
import {
	getOrganizationById,
	getAllOrganizationCategories,
	getEventsByOrganization,
	updateOrganization
} from '$lib/server/db/dataHelpers.js';

export const load: PageServerLoad = async (event) => {
	// const userId = requireAuth(event); // redirects to /signin if not authenticated
	const orgId = event.params.organization;

	const [organization, allCategories, allOrgEvents] = await Promise.all([
		getOrganizationById(orgId),
		getAllOrganizationCategories(),
		getEventsByOrganization(orgId)
	]);

	const now = new Date();
	const upcomingEvents = allOrgEvents.filter((e) => new Date(e.startTime) > now).slice(0, 2);
	const pastEvents = allOrgEvents.filter((e) => new Date(e.startTime) < now);

	if (!organization) throw error(404, 'Organization not found');

	// await requireCanManageOrg(userId, orgId); // throws 403 if not board_member/president/admin

	return { organization, allCategories, upcomingEvents, pastEvents };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/;

export const actions: Actions = {
	default: async (event) => {
		// const userId = requireAuth(event);
		const orgId = event.params.organization;

		// Re-verify permission on POST
		// await requireCanManageOrg(userId, orgId);

		const formData = await event.request.formData();

		const name = (formData.get('name') as string)?.trim() ?? '';
		const description = (formData.get('description') as string)?.trim() || null;
		const contactEmail = (formData.get('contactEmail') as string)?.trim() ?? '';
		const categoryIds = formData.getAll('categoryIds') as string[];

		// Validate — only fields that are currently persisted need strict validation
		const errors: Record<string, string> = {};

		if (name.length < 2) errors.name = 'Name must be at least 2 characters.';
		if (name.length > 320) errors.name = 'Name must be 320 characters or fewer.';
		if (!EMAIL_RE.test(contactEmail)) errors.contactEmail = 'Enter a valid email address.';

		// Optional URL fields — validate format only if a value was provided
		const websiteUrl = (formData.get('websiteUrl') as string)?.trim() || null;
		const feedbackUrl = (formData.get('feedbackUrl') as string)?.trim() || null;
		if (websiteUrl && !URL_RE.test(websiteUrl))
			errors.websiteUrl = 'Enter a valid URL (must start with http:// or https://).';
		if (feedbackUrl && !URL_RE.test(feedbackUrl))
			errors.feedbackUrl = 'Enter a valid URL (must start with http:// or https://).';

		if (Object.keys(errors).length > 0) {
			return fail(422, {
				errors,
				values: { name, description, contactEmail, categoryIds, websiteUrl, feedbackUrl }
			});
		}

		await updateOrganization(orgId, { name, description, contactEmail, categoryIds });

		throw redirect(303, `/organizations/${orgId}`);
	}
};
