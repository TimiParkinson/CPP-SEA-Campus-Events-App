<script lang="ts">
	import { filteredItems, searchQuery, type EventItem } from '$lib/stores/filters.js';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let selectedEvent = $state<EventItem | null>(null);
	let dialogOpen = $state(false);

	function openEvent(event: EventItem | null) {
		selectedEvent = event;
		dialogOpen = true;
	}
</script>

<svelte:head>
	<title>Your Events</title>
</svelte:head>

<main class="container mx-auto max-w-7xl px-4 py-8">
	<h1 class="mb-6 text-3xl">Your Events</h1>

	<div class="mb-6">
		<SearchBar value={$searchQuery} onInput={(e) => ($searchQuery = e)} placeholder="Search events..." />
	</div>

	<CardGrid itemCount={$filteredItems.length} emptyMessage="No events found">
		{#each $filteredItems as event (event.title)}
			<EventCard title={event.title} date={event.date} onclick={() => openEvent(event)} />
		{/each}
	</CardGrid>

	<EventDialog
		event={selectedEvent}
		open={dialogOpen}
		onOpenChange={(open) => (dialogOpen = open)}
	/>
</main>
