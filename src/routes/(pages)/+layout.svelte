<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	interface Route {
		name: string;
		path: string;
	}

	let { children } = $props();

	const currentPath = $derived($page.url.pathname);

	// Pages that should NOT show footer
	const hideFooterPaths = ['/search'];

	const shouldShowFooter = $derived(!hideFooterPaths.some((path) => currentPath.startsWith(path)));

	// Hide navbar on mobile for search page
	const hideNavbarOnMobile = $derived(currentPath.startsWith('/search'));

	// Hardcoded routes (cleaner than dynamic discovery)
	const routes: Route[] = [
		{ name: 'Calendar', path: '/calendar' },
		{ name: 'Discover', path: '/discover' }
	];
</script>

<div class="flex min-h-screen flex-col bg-black">
	<!-- Navbar (conditional on mobile for search page) -->
	<div class:hidden={hideNavbarOnMobile} class="sm:block">
		<Navbar {routes} {currentPath} />
	</div>

	<!-- Main content area (no top margin - navbar overlays) -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer (conditional) -->
	{#if shouldShowFooter}
		<Footer />
	{/if}
</div>
