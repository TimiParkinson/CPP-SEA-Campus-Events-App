<script lang="ts">
	import { ArrowLeft, Calendar, Clock, MapPin, Send, UsersRound } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Detail from '$lib/components/shared/Detail.svelte';
	import BookmarkButton from '$lib/components/shared/BookmarkBtn.svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { formatDateRange, formatTimeRange } from '$lib/utils/dateFormatters.js';
	import OrgHostsDisplay from '$lib/components/orgs/OrgHostsDisplay.svelte';
	import type { Event } from '$lib/types/index.js';

	// Data
	let { data } = $props();
	const event: Event = data.event;

	let gradient = $derived(getRandomGradient(event.id));
	let isBookmarked = $state(false);

	const isLocationLong = $derived(event.location.length > 35);
	const isMultiDayEvent = $derived(
		new Date(event.startTime).toDateString() !== new Date(event.endTime).toDateString()
	);

	const detailsLayout = $derived(() => {
		if (isMultiDayEvent) {
			return {
				firstRow: ['date'],
				secondRow: ['time', 'location'],
				thirdRow: []
			};
		} else if (isLocationLong) {
			return {
				firstRow: ['date', 'time'],
				secondRow: ['location'],
				thirdRow: []
			};
		} else {
			return {
				firstRow: ['date', 'time', 'location'],
				secondRow: [],
				thirdRow: []
			};
		}
	});

	function handleBack() {
		window.history.back();
	}

	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}

	function handleRSVP() {
		if (event.rsvpUrl) {
			window.open(event.rsvpUrl, '_blank');
		} else {
			console.log('RSVP clicked - not yet implemented');
		}
	}

	function handleFeedback() {
		if (event.feedbackUrl) {
			window.open(event.feedbackUrl, '_blank');
		} else {
			console.log('Send Feedback clicked - not yet implemented');
		}
	}

	function handleOrgClick(orgId: string) {
		window.location.href = `/organizations/${orgId}`;
	}

	function handleTagClick(tagName: string) {
		console.log('Filter by tag:', tagName);
		// Navigate to search/discover with tag filter
	}
</script>

<svelte:head>
	<title>{event.title} - Campus Events</title>
</svelte:head>

<div class="min-h-screen">
	<!-- Banner -->
	<div class="relative h-64 overflow-hidden sm:h-80 md:h-96">
		<!-- Background Image/Gradient -->
		{#if event.imageUrl}
			<img src={event.imageUrl} alt={event.title} class="size-full object-cover object-center" />
		{:else}
			<div class="size-full" style="background: {gradient};"></div>
		{/if}

		<!-- Dark overlay -->
		<div class="absolute inset-0 bg-linear-to-t from-black/30 to-black/10"></div>

		<!-- Back Button -->
		<div class="absolute top-4 left-4 sm:top-6 sm:left-6">
			<button
				onclick={handleBack}
				class="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-white/90 hover:text-black sm:size-12"
				aria-label="Go back"
			>
				<ArrowLeft class="size-5 sm:size-6" />
			</button>
		</div>

		<!-- Attendee Count -->
		{#if event.attendeeCount}
			<div class="absolute top-4 right-4 sm:top-6 sm:right-6">
				<div
					class="flex items-center gap-2 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-white backdrop-blur-sm sm:px-4"
				>
					<UsersRound size="17" />
					<span class="text-sm font-semibold">{event.attendeeCount} attending</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Primary CTA -->
	<div class="relative px-4 sm:px-6 lg:px-8">
		<div class="container mx-auto max-w-4xl">
			<div class="flex -translate-y-6 items-end justify-between gap-3 sm:gap-4">
				<!-- Hosts -->
				{#if event.organizations && event.organizations.length > 0}
					<div class="relative">
						<OrgHostsDisplay organizations={event.organizations} onOrgClick={handleOrgClick} />
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex shrink-0 items-center gap-2 sm:gap-3">
					<BookmarkButton {isBookmarked} onclick={toggleBookmark} variant="secondary" />
					<Button
						onclick={handleRSVP}
						size="lg"
						class="cursor-pointer px-4 text-sm shadow-lg sm:px-6 sm:text-base"
					>
						RSVP
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="container mx-auto max-w-4xl px-4 pt-2 pb-12 sm:px-6 sm:pt-4 lg:px-8">
		<!-- Event Header -->
		<div class="mb-6">
			<!-- Title -->
			<h1 class="mb-3 text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
				{event.title}
			</h1>

			<!-- Tags -->
			{#if event.tags && event.tags.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each event.tags as tag}
						<button
							onclick={() => handleTagClick(tag.name)}
							class="cursor-pointer transition-opacity hover:opacity-80"
						>
							<Badge
								variant="secondary"
								style="background-color: {tag.color}20; border: 1px solid {tag.color}; color: {tag.color};"
								class="text-xs sm:text-sm"
							>
								{tag.name}
							</Badge>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Quick Details-->
		<div class="mb-8 space-y-4">
			{#if detailsLayout().firstRow.length > 0}
				<div
					class="grid gap-4 lg:gap-6 {detailsLayout().firstRow.length === 1
						? 'grid-cols-1'
						: detailsLayout().firstRow.length === 2
							? 'grid-cols-1 sm:grid-cols-2'
							: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}"
				>
					{#each detailsLayout().firstRow as detail}
						{#if detail === 'date'}
							<Detail
								icon={Calendar}
								label="Date"
								value={formatDateRange(event.startTime, event.endTime)}
							/>
						{:else if detail === 'time'}
							<Detail
								icon={Clock}
								label="Time"
								value={formatTimeRange(event.startTime, event.endTime)}
							/>
						{:else if detail === 'location'}
							<Detail
								icon={MapPin}
								label="Location"
								value={event.location}
								onclick={() => console.log('Open map for:', event.location)}
							/>
						{/if}
					{/each}
				</div>
			{/if}

			{#if detailsLayout().secondRow.length > 0}
				<div
					class="grid gap-4 lg:gap-6 {detailsLayout().secondRow.length === 1
						? 'grid-cols-1'
						: 'grid-cols-1 sm:grid-cols-2'}"
				>
					{#each detailsLayout().secondRow as detail}
						{#if detail === 'time'}
							<Detail
								icon={Clock}
								label="Time"
								value={formatTimeRange(event.startTime, event.endTime)}
							/>
						{:else if detail === 'location'}
							<Detail
								icon={MapPin}
								label="Location"
								value={event.location}
								onclick={() => console.log('Open map for:', event.location)}
							/>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		<!-- Event Description -->
		<div class="mb-8">
			<h2 class="mb-4 text-xl font-bold sm:text-2xl">About Event</h2>
			<p class="text-sm leading-relaxed sm:text-base">
				{event.description}
			</p>
		</div>

		<!-- Send Feedback -->
		<Button onclick={handleFeedback} variant="secondary" size="lg" class="w-full gap-2 sm:w-auto">
			<Send class="size-4" />
			Send Feedback
		</Button>
	</div>
</div>
