<script>
	import '$css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// Get all +page.svelte files inside src/routes/(pages)
	const routeModules = import.meta.glob('/src/routes/**/+page.svelte', { eager: true });

	// Normalize key so we don't break if paths move
	function normalizeKey(key) {
		// remove leading ./ or /
		key = key.replace(/^[./]+/, '');

		// strip src/routes prefix
		key = key.replace(/^src\/routes\/?/, '');

		// strip trailing /+page.svelte
		key = key.replace(/\/\+page\.svelte$/, '');

		// remove leading slashes
		return key.replace(/^\/+/, '');
	}

	// Build route objects
	const routes = Object.keys(routeModules)
		.map((rawKey) => {
			const key = normalizeKey(rawKey);

			const pagesIndex = key.indexOf('(pages)');
			if (pagesIndex === -1) return null;

			let after = key.slice(pagesIndex + '(pages)'.length).replace(/^\/+/, '');
			const parts = after.split('/').filter(Boolean);

			// Only include top-level routes in (pages)
			if (parts.length !== 1) return null;

			const segment = parts[0];
			if (!segment || segment.startsWith('_') || segment === 'auth') return null;

			const name = segment
				.split('-')
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(' ');

			return { name, path: `/${segment}` };
		})
		.filter(Boolean)
		.sort((a, b) => a.name.localeCompare(b.name));

	const currentPath = $derived($page.url.pathname);
	import { supabaseBrowser } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseBrowser.auth.onAuthStateChange(async (_event, _session) => {
			// When auth state changes on the client, refresh the current page to re-run server loads
			await goto(window.location.pathname, { invalidateAll: true });
		});
		return () => subscription.unsubscribe();
	});
</script>

<div class="min-h-screen bg-black">
  <!-- <Navbar /> -->

  <main>
    {@render children()}
  </main>

  <Footer />
</div>
