<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import Footer from '$lib/components/shared/Footer.svelte';

	interface Route {
		name: string;
		path: string;
	}

	let { children, data } = $props();

	const currentPath = $derived($page.url.pathname);

	// Hardcoded routes
	const routes: Route[] = [
		{ name: 'Calendar', path: '/calendar' },
		{ name: 'Discover', path: '/discover' }
	];
</script>

<div class="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
	<Navbar {routes} {currentPath} session={data.session} />

	{@render children()}

	<Footer />
</div>
