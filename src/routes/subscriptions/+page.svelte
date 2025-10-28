<script lang="ts">
	import { filteredItems, searchQuery } from '$lib/stores/filters.js';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import SubscriptionCard from '$lib/components/cards/SubscriptionCard.svelte';

	let subscriptions = $derived($filteredItems.filter((item) => item.type === 'Organization'));
</script>

<svelte:head>
	<title>Your Subscriptions</title>
</svelte:head>

<main class="container mx-auto max-w-7xl px-4 py-8">
	<h1 class="mb-6 text-3xl">Your Subscriptions</h1>

	<div class="mb-6">
		<SearchBar
			value={$searchQuery}
			onInput={(e) => ($searchQuery = e)}
			placeholder="Search subscriptions..."
		/>
	</div>

	<CardGrid itemCount={$filteredItems.length} emptyMessage="No subscriptions found">
		{#each subscriptions as sub (sub.title)}
			<SubscriptionCard title={sub.title} date={sub.date} />
		{/each}
	</CardGrid>
</main>
