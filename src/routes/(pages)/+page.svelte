<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import CTA from '$lib/components/home/CTA.svelte';
	import Featured from '$lib/components/cards/Featured.svelte';

	// Import mock data from centralized location
	import { mockEvents, mockOrganizations } from '$lib/mock/index.js';

	// What is considered "Featured" is yet to be confirmed
	const featuredOrgs = mockOrganizations.slice(0, 5);
	const featuredEvents = mockEvents.slice(0, 4);
</script>

<svelte:head>
	<title>Campus Events</title>
	<meta
		name="description"
		content="Explore campus events, clubs, and opportunities at Cal Poly Pomona"
	/>
</svelte:head>

<div class="bg-black">
	<Hero />
	<Featured variant="orgs" organizations={featuredOrgs} />
	<Featured variant="events" events={featuredEvents} />
	<CTA />
</div>
