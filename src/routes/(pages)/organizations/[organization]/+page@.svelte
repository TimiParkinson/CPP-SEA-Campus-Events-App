<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Calendar, Globe, Mail, Users, Send, User } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Detail from '$lib/components/shared/Detail.svelte';
	import BookmarkButton from '$lib/components/shared/BookmarkBtn.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { formatFullDate } from '$lib/utils/dateFormatters.js';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';

	// Import types and mock data
	import type { Organization, Event } from '$lib/types/index.js';
	import { getOrganization, mockEvents } from '$lib/mock/index.js';

	const orgId = $page.params.organization ?? 'org-1';

	// Try to get the organization from mock data, fallback to org-8 (CSS)
	const mockOrg: Organization = (() => {
		try {
			return getOrganization(orgId);
		} catch {
			// If org not found, use CSS as default
			return getOrganization('org-8');
		}
	})();

	// Filter events by this organization (use first 2 for upcoming)
	const upcomingEvents: Event[] = mockEvents
		.filter((e) => e.organizations?.some(o => o.name === mockOrg.name))
		.slice(0, 2);

	// Mock past events (empty for now, could be filtered from mockEvents by date)
	const pastEvents: Event[] = [];

	let gradient = $derived(getRandomGradient(mockOrg.id));
	let isBookmarked = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());
	let selectedEvent = $state<Event | null>(null);
	let eventDialogOpen = $state(false);

	function handleBack() {
		window.history.back();
	}

	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}

	function handleJoin() {
		console.log('Join organization clicked');
	}

	function handleFeedback() {
		if (mockOrg.feedbackUrl) {
			window.open(mockOrg.feedbackUrl, '_blank');
		} else {
			console.log('Send Feedback clicked - not yet implemented');
		}
	}

	function handleCategoryClick(categoryName: string) {
		console.log('Filter by category:', categoryName);
	}

	function handleWebsiteClick() {
		if (mockOrg.websiteUrl) {
			window.open(mockOrg.websiteUrl, '_blank');
		}
	}

	function handleEmailClick() {
		if (mockOrg.contactEmail) {
			window.location.href = `mailto:${mockOrg.contactEmail}`;
		}
	}

	function openEvent(event: any) {
		selectedEvent = event;
		eventDialogOpen = true;
	}

	function toggleEventBookmark(eventId: string) {
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

<svelte:head>
	<title>{mockOrg.name} - Campus Events</title>
</svelte:head>

<div class="min-h-screen bg-black">
	<!-- Banner -->
	<div class="relative h-64 overflow-hidden sm:h-80 md:h-96">
		<!-- Background Image/Gradient -->
		{#if mockOrg.bannerImageUrl}
			<img src={mockOrg.bannerImageUrl} alt={mockOrg.name} class="size-full object-cover object-center" />
		{:else}
			<div class="size-full" style="background: {gradient};"></div>
		{/if}

		<!-- Dark overlay -->
		<div class="absolute inset-0 bg-linear-to-t from-black/30 to-black/10"></div>

		<!-- Back Button -->
		<div class="absolute top-4 left-4 sm:top-6 sm:left-6">
			<button
				type="button"
				onclick={handleBack}
				class="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-white/90 hover:text-black sm:size-12"
				aria-label="Go back"
			>
				<ArrowLeft class="size-5 sm:size-6" />
			</button>
		</div>

		<!-- Member Count -->
		{#if mockOrg.memberCount}
			<div class="absolute top-4 right-4 sm:top-6 sm:right-6">
				<div
					class="flex items-center gap-2 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-white backdrop-blur-sm sm:px-4"
				>
					<Users size="17" />
					<span class="text-sm font-semibold">{mockOrg.memberCount} members</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Logo & CTAs -->
	<div class="relative px-4 sm:px-6 lg:px-8">
		<div class="container mx-auto max-w-4xl">
			<div class="shift-content-up | flex items-center justify-between gap-3 sm:gap-4">
				<!-- Logo - Increased size with inline width/height -->
				<div class="relative">
					{#if mockOrg.logoUrl}
						<img
							src={mockOrg.logoUrl}
							alt={mockOrg.name}
							class="rounded-full border-4 border-black object-cover shadow-lg"
							style="width: 120px; height: 120px;"
						/>
					{:else}
						<div
							class="overflow-hidden rounded-full border-4 border-black shadow-lg"
							style="width: 96px; height: 96px; background: {gradient};"
						>
							<div class="flex size-full items-center justify-center">
								<span
									class="text-center text-2xl leading-none font-bold tracking-tight whitespace-nowrap text-white select-none"
								>
									{mockOrg.abbreviation || generateAbbreviation(mockOrg.name)}
								</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex shrink-0 items-center gap-2 sm:gap-3">
					<!-- Bookmark -->
					<BookmarkButton
						{isBookmarked}
						onclick={toggleBookmark}
						size="dialog"
						class="size-10 border border-white/20 bg-background shadow-lg sm:size-11"
					/>

					<!-- Join -->
					<Button
						onclick={handleJoin}
						size="lg"
						class="h-10 cursor-pointer px-4 text-sm shadow-lg sm:h-11 sm:px-6 sm:text-base"
					>
						Join
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="container mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8" style="transform: translateY(-40px);">
		<!-- Organization Header -->
		<div class="mb-8">
			<h1 class="mb-3 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl">
				{mockOrg.name}
			</h1>

			{#if mockOrg.categories && mockOrg.categories.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each mockOrg.categories as category}
						<button
							type="button"
							onclick={() => handleCategoryClick(category.name)}
							class="cursor-pointer transition-opacity hover:opacity-80"
						>
							<Badge
								variant="secondary"
								style="background-color: {category.color}20; border: 1px solid {category.color}; color: {category.color};"
								class="text-xs sm:text-sm"
							>
								{category.name}
							</Badge>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Quick Details -->
		<div class="mb-8 space-y-4">
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{#if mockOrg.establishedDate}
					<Detail
						icon={Calendar}
						label="Established"
						value={formatFullDate(mockOrg.establishedDate)}
					/>
				{/if}

				{#if mockOrg.contactEmail}
					<Detail
						icon={Mail}
						label="Contact"
						value={mockOrg.contactEmail}
						clickable={true}
						onclick={handleEmailClick}
					/>
				{/if}

				{#if mockOrg.websiteUrl}
					<Detail
						icon={Globe}
						label="Website"
						value={mockOrg.websiteUrl}
						clickable={true}
						onclick={handleWebsiteClick}
					/>
				{/if}
			</div>
		</div>

		<!-- About Organization -->
		<div class="mb-8">
			<h2 class="mb-4 text-xl font-bold text-white sm:text-2xl">About Organization</h2>
			<p class="text-sm leading-relaxed text-gray-300 sm:text-base">
				{mockOrg.description}
			</p>
		</div>

		<!-- Meet the Board -->
		{#if mockOrg.boardMembers && mockOrg.boardMembers.length > 0}
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-white sm:text-2xl">Meet the Board</h2>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{#each mockOrg.boardMembers as member}
						<Detail icon={User} label={member.role} value={member.name} />
					{/each}
				</div>
			</div>
		{/if}

		<!-- Send Feedback -->
		<div class="mb-8">
			<Button
				onclick={handleFeedback}
				variant="outline"
				size="lg"
				class="w-full cursor-pointer gap-2 sm:w-auto"
			>
				<Send class="size-4" />
				Send Feedback
			</Button>
		</div>

		<!-- Upcoming Events -->
		{#if upcomingEvents && upcomingEvents.length > 0}
			<div class="mb-8">
				<a
					href="/search?org={encodeURIComponent(mockOrg.name)}&time=upcoming"
					class="group mb-4 inline-flex items-center gap-2 transition-colors hover:opacity-80"
				>
					<h2 class="text-xl font-bold text-white group-hover:underline sm:text-2xl">
						Upcoming Events
					</h2>
				</a>
				<CardGrid itemCount={upcomingEvents.length} variant="featured" cardType="event">
					{#each upcomingEvents as event (event.id)}
						<EventCard
							{event}
							variant="featured"
							onclick={() => openEvent(event)}
							onBookmark={() => toggleEventBookmark(event.id)}
							isBookmarked={bookmarkedEvents.has(event.id)}
						/>
					{/each}
				</CardGrid>
			</div>
		{/if}

		<!-- Past Events -->
		{#if pastEvents && pastEvents.length > 0}
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold text-white sm:text-2xl">Past Events</h2>
				<CardGrid itemCount={pastEvents.length} variant="general" cardType="event">
					{#each pastEvents as event (event.id)}
						<EventCard
							{event}
							variant="general"
							onclick={() => openEvent(event)}
							onBookmark={() => toggleEventBookmark(event.id)}
							isBookmarked={bookmarkedEvents.has(event.id)}
						/>
					{/each}
				</CardGrid>
			</div>
		{/if}
	</div>
</div>

<!-- Event Dialog -->
<EventDialog
	event={selectedEvent}
	open={eventDialogOpen}
	onOpenChange={(open) => (eventDialogOpen = open)}
	onBookmark={() => selectedEvent && toggleEventBookmark(selectedEvent.id)}
	onRSVP={handleRSVP}
	isBookmarked={selectedEvent ? bookmarkedEvents.has(selectedEvent.id) : false}
/>

<style>
	.shift-content-up {
		transform: translateY(-60px);
	}
</style>
