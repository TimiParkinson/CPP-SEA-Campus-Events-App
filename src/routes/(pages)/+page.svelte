<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import CTA from '$lib/components/home/CTA.svelte';
	import Featured from '$lib/components/cards/Featured.svelte';

	// Receive data from +page.server.ts
	let { data } = $props();
	const featuredOrgs = data.featuredOrgs;
	const featuredEvents = data.featuredEvents;
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
