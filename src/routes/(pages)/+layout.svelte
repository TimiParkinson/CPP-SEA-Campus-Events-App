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

	// Hardcoded routes
	const routes: Route[] = [
		{ name: 'Calendar', path: '/calendar' },
		{ name: 'Discover', path: '/discover' }
	];
</script>

<div class="flex min-h-screen flex-col bg-black">
	<Navbar {routes} {currentPath} />

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
