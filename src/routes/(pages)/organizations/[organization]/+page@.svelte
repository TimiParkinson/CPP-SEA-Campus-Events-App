<script lang="ts">
	import { Calendar, Globe, Mail, Users, Send, User, Pencil } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Detail from '$lib/components/shared/Detail.svelte';
	import BookmarkButton from '$lib/components/shared/BookmarkBtn.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import OrgPageShell from '$lib/components/orgs/OrgPageShell.svelte';
	import OrgPageContent from '$lib/components/orgs/OrgPageContent.svelte';
	import { formatFullDate } from '$lib/utils/dateFormatters.js';

	// Import types
	import type { Organization, Event } from '$lib/types/index.js';

	// Receive data from +page.server.ts
	let { data } = $props();
	const org: Organization = data.organization;
	const upcomingEvents: Event[] = data.upcomingEvents;
	const pastEvents: Event[] = data.pastEvents;

	let isBookmarked = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());
	let selectedEvent = $state<Event | null>(null);
	let eventDialogOpen = $state(false);

	function toggleBookmark() {
		isBookmarked = !isBookmarked;
	}

	function handleJoin() {
		console.log('Join organization clicked');
	}

	function handleFeedback() {
		if (org.feedbackUrl) {
			window.open(org.feedbackUrl, '_blank');
		} else {
			console.log('Send Feedback clicked - not yet implemented');
		}
	}

	function handleCategoryClick(categoryName: string) {
		console.log('Filter by category:', categoryName);
	}

	function handleWebsiteClick() {
		if (org.websiteUrl) {
			window.open(org.websiteUrl, '_blank');
		}
	}

	function handleEmailClick() {
		if (org.contactEmail) {
			window.location.href = `mailto:${org.contactEmail}`;
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
	<title>{org.name} - Campus Events</title>
</svelte:head>

<OrgPageShell {org}>
	{#snippet topRight()}
		{#if org.memberCount}
			<div
				class="flex items-center gap-2 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-white backdrop-blur-sm sm:px-4"
			>
				<Users size="17" />
				<span class="text-sm font-semibold">{org.memberCount} members</span>
			</div>
		{/if}
	{/snippet}

	{#snippet actions()}
		{#if data.canEdit}
			<Button
				href="/organizations/{org.id}/edit"
				variant="secondary"
				class="relative cursor-pointer border-0 shadow-lg backdrop-blur-sm"
			>
				<Pencil class="size-4" />
			</Button>
		{/if}
		<BookmarkButton {isBookmarked} onclick={toggleBookmark} variant="secondary" />
		<Button
			onclick={handleJoin}
			size="lg"
			class="cursor-pointer px-4 text-sm shadow-lg sm:px-6 sm:text-base"
		>
			Join
		</Button>
	{/snippet}

	<OrgPageContent>
		<!-- Organization Header -->
		<div class="my-8">
			<h1 class="mb-3 text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
				{org.name}
			</h1>

			{#if org.categories && org.categories.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each org.categories as category}
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
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
				{#if org.establishedDate}
					<Detail icon={Calendar} label="Established" value={formatFullDate(org.establishedDate)} />
				{/if}

				{#if org.contactEmail}
					<Detail icon={Mail} label="Contact" value={org.contactEmail} onclick={handleEmailClick} />
				{/if}

				{#if org.websiteUrl}
					<Detail
						icon={Globe}
						label="Website"
						value={org.websiteUrl}
						onclick={handleWebsiteClick}
					/>
				{/if}
			</div>
		</div>

		<!-- About Organization -->
		<div class="mb-8">
			<h2 class="mb-4 text-xl font-bold sm:text-2xl">About Organization</h2>
			<p class="text-sm leading-relaxed sm:text-base">
				{org.description}
			</p>
		</div>

		<!-- Meet the Board -->
		{#if org.boardMembers && org.boardMembers.length > 0}
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold sm:text-2xl">Meet the Board</h2>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{#each org.boardMembers as member}
						<Detail icon={User} label={member.role} value={member.name} />
					{/each}
				</div>
			</div>
		{/if}

		<!-- Send Feedback -->
		<Button
			onclick={handleFeedback}
			variant="secondary"
			size="lg"
			class="mb-8 w-full gap-2 sm:w-auto"
		>
			<Send class="size-4" />
			Send Feedback
		</Button>

		<!-- Upcoming Events -->
		{#if upcomingEvents && upcomingEvents.length > 0}
			<div class="mb-8">
				<a
					href="/search?org={encodeURIComponent(org.name)}&time=upcoming"
					class="group mb-4 inline-flex items-center gap-2 transition-colors hover:opacity-80"
				>
					<h2 class="text-xl font-bold group-hover:underline sm:text-2xl">Upcoming Events</h2>
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
				<h2 class="mb-4 text-xl font-bold sm:text-2xl">Past Events</h2>
				<div class="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 md:grid-cols-3 md:gap-6">
					{#each pastEvents as event (event.id)}
						<EventCard
							{event}
							variant="general"
							onclick={() => openEvent(event)}
							onBookmark={() => toggleEventBookmark(event.id)}
							isBookmarked={bookmarkedEvents.has(event.id)}
						/>
					{/each}
				</div>
			</div>
		{/if}
	</OrgPageContent>
</OrgPageShell>

<!-- Event Dialog -->
<EventDialog
	event={selectedEvent}
	open={eventDialogOpen}
	onOpenChange={(open) => (eventDialogOpen = open)}
	onBookmark={() => selectedEvent && toggleEventBookmark(selectedEvent.id)}
	onRSVP={handleRSVP}
	isBookmarked={selectedEvent ? bookmarkedEvents.has(selectedEvent.id) : false}
/>
