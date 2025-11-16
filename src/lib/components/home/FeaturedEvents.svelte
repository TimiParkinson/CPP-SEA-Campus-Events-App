<script lang="ts">
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import { ArrowRight } from '@lucide/svelte';

	interface Event {
		id: string;
		title: string;
		description?: string | null;
		location: string;
		startTime: string;
		endTime: string;
		imageUrl?: string | null;
		attendeeCount?: number | null;
		tags?: Array<{ name: string; color: string }>;
		organization?: { name: string };
	}

	interface Props {
		events: Event[];
		title?: string;
		subtitle?: string;
	}

	let {
		events,
		title = 'Featured Events',
		subtitle = "Don't miss out on these trending events"
	}: Props = $props();

	// Dialog state
	let selectedEvent = $state<Event | null>(null);
	let dialogOpen = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());

	function openEvent(event: Event) {
		selectedEvent = event;
		dialogOpen = true;
	}

	function toggleBookmark(eventId: string) {
		if (bookmarkedEvents.has(eventId)) {
			bookmarkedEvents.delete(eventId);
		} else {
			bookmarkedEvents.add(eventId);
		}
		bookmarkedEvents = bookmarkedEvents;
	}

	function handleRSVP() {
		console.log('RSVP clicked');
	}
</script>

<section class="bg-black py-10 sm:py-12 lg:py-16">
	<div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div
			class="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end"
		>
			<div>
				<h2 class="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
					{title}
				</h2>
				<p class="text-sm text-gray-400 sm:text-base">
					{subtitle}
				</p>
			</div>
			<a
				href="/discover?tab=events"
				class="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
			>
				<span>Discover more events</span>
				<ArrowRight class="size-4 transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		<!-- Event Grid - Using CardGrid with featured variant and event type -->
		<CardGrid itemCount={events.length} variant="featured" cardType="event">
			{#each events as event (event.id)}
				<EventCard
					{event}
					variant="featured"
					onclick={() => openEvent(event)}
					onBookmark={() => toggleBookmark(event.id)}
					isBookmarked={bookmarkedEvents.has(event.id)}
				/>
			{/each}
		</CardGrid>
	</div>
</section>

<!-- Event Dialog -->
<EventDialog
	event={selectedEvent}
	open={dialogOpen}
	onOpenChange={(open) => (dialogOpen = open)}
	onBookmark={() => selectedEvent && toggleBookmark(selectedEvent.id)}
	onRSVP={handleRSVP}
	isBookmarked={selectedEvent ? bookmarkedEvents.has(selectedEvent.id) : false}
/>
