import type { PageServerLoad } from './$types';
import { getCurrentUserProfileBundle } from '$lib/server/db/user/getCurrentUserProfileBundle';

export const load: PageServerLoad = async ({ locals }) => {
	return await getCurrentUserProfileBundle(locals);
};
