import type { RequestHandler } from '@sveltejs/kit';

// Server-side signout so Supabase SSR cookies (sb-*) are cleared.
export const POST: RequestHandler = async ({ locals }) => {
	await locals.supabase.auth.signOut();
	return new Response(null, { status: 204 });
};
