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

<div class="flex min-h-screen flex-col bg-black">
	<Navbar {routes} {currentPath} session={data.session} />

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
