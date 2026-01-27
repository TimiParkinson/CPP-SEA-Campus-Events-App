import { json } from '@sveltejs/kit';
import { getCurrentUserProfileBundle } from '$lib/server/db/user/getCurrentUserProfileBundle';

export async function GET({ locals }) {
	const data = await getCurrentUserProfileBundle(locals);
	return json(data);
}
