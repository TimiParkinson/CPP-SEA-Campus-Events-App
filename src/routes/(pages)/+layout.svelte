<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	interface Route {
		name: string;
		path: string;
	}

	let { children } = $props();

	const currentPath = $derived($page.url.pathname);

	// Get all routes dynamically
	const routeModules = import.meta.glob('/src/routes/**/+page.svelte', { eager: true });

	function normalizeKey(key: string): string {
		return key
			.replace(/^[./]+/, '')
			.replace(/^src\/routes\/?/, '')
			.replace(/\/\+page\.svelte$/, '')
			.replace(/^\/+/, '');
	}

	const routes: Route[] = Object.keys(routeModules)
		.map((rawKey) => {
			const key = normalizeKey(rawKey);
			const pagesIndex = key.indexOf('(pages)');

			if (pagesIndex === -1) return null;

			const after = key.slice(pagesIndex + '(pages)'.length).replace(/^\/+/, '');
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
		.filter((route): route is Route => route !== null)
		.sort((a, b) => a.name.localeCompare(b.name));
</script>

<div class="flex min-h-screen flex-col bg-black">

	<Navbar {routes} {currentPath} />

	<main>
		{@render children()}
	</main>

	<Footer />
</div>
