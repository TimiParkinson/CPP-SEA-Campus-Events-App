import type { ClientInit } from '@sveltejs/kit'; // SvelteKit client init hook type
import { invalidateAll } from '$app/navigation'; // Re-run all load() functions
import { supabaseBrowser } from '$lib/supabaseClient.js'; // Browser Supabase client

let initialized = false; // Prevent duplicate listeners (dev/HMR)

export const init: ClientInit = async () => {
	if (initialized) return; // Exit if already wired up
	initialized = true; // Mark initialized

	supabaseBrowser.auth.onAuthStateChange(() => {
		invalidateAll(); // Refresh SSR-derived session + auth-gated data
	}); // End auth subscription
}; // End init hook
