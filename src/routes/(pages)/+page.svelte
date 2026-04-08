<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import CTA from '$lib/components/home/CTA.svelte';
	import Featured from '$lib/components/cards/Featured.svelte';

	let { data } = $props();
	const featuredOrgs = $derived(data.featuredOrgs);
	const featuredEvents = $derived(data.featuredEvents);
</script>

<svelte:head>
	<title>Campus Events</title>
	<meta
		name="description"
		content="Explore campus events, clubs, and opportunities at Cal Poly Pomona"
	/>
</svelte:head>

<Hero />
<div class="space-y-6 sm:space-y-12">
	<Featured
		variant="orgs"
		organizations={featuredOrgs}
		viewText="Discover more orgs"
		viewHref="/discover"
	/>
	<Featured
		variant="events"
		events={featuredEvents}
		viewText="Discover more events"
		viewHref="/discover"
	/>
	<CTA />
</div>
