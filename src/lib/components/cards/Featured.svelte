<script lang="ts">
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import OrgCard from '$lib/components/cards/OrgCard.svelte';
	import OrgDialog from '$lib/components/dialogs/OrgDialog.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import type { Event, Organization } from '$lib/types/index.js';

	interface Props {
		events?: Event[] | null;
		organizations?: Organization[] | null;
		title?: string;
		variant: 'events' | 'orgs';
		minimal?: boolean; // Skip section wrapper
	}

	let { events, organizations, title, variant, minimal = false }: Props = $props();

	let selectedEvent = $state<Event | null>(null);
	let selectedOrg = $state<Organization | null>(null);
	let eventDialogOpen = $state(false);
	let orgDialogOpen = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());
	let bookmarkedOrgs = $state<Set<string>>(new Set());

	function openEvent(event: Event) {
		selectedEvent = event;
		eventDialogOpen = true;
	}

	function openOrg(org: Organization) {
		selectedOrg = org;
		orgDialogOpen = true;
	}

	function toggleEventBookmark(eventId: string) {
		if (bookmarkedEvents.has(eventId)) {
			bookmarkedEvents.delete(eventId);
		} else {
			bookmarkedEvents.add(eventId);
		}
		bookmarkedEvents = bookmarkedEvents;
	}

	function toggleOrgBookmark(orgId: string) {
		if (bookmarkedOrgs.has(orgId)) {
			bookmarkedOrgs.delete(orgId);
		} else {
			bookmarkedOrgs.add(orgId);
		}
		bookmarkedOrgs = bookmarkedOrgs;
	}

	function handleRSVP() {
		console.log('RSVP clicked');
	}

	function handleJoin() {
		console.log('Join clicked');
	}

	// Show header only if title provided OR not in minimal mode
	const showHeader = $derived(!minimal || title);
</script>

{#if minimal}
	{#if variant === 'events' && events !== null && events !== undefined}
		<CardGrid itemCount={events.length} variant="featured" cardType="event">
			{#each events as event (event.id)}
				<EventCard
					{event}
					variant="featured"
					onclick={() => openEvent(event)}
					onBookmark={() => toggleEventBookmark(event.id)}
					isBookmarked={bookmarkedEvents.has(event.id)}
				/>
			{/each}
		</CardGrid>
	{:else if variant === 'orgs' && organizations !== null && organizations !== undefined}
		<CardGrid itemCount={organizations.length} variant="featured" cardType="org">
			{#each organizations as org (org.id)}
				<OrgCard organization={org} variant="featured" onclick={() => openOrg(org)} />
			{/each}
		</CardGrid>
	{/if}
{:else}
	<section class="py-10 sm:py-12 lg:py-14">
		<!-- Section Header -->
		{#if showHeader}
			<div
				class="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center sm:gap-4"
			>
				<h2 class="text-2xl font-bold sm:text-3xl lg:text-4xl">
					{title ? title : variant === 'orgs' ? 'Featured Organizations' : 'Featured Events'}
				</h2>

				<a
					href={variant === 'orgs' ? '/search' : '/search'}
					class="group flex items-center gap-2 text-sm"
				>
					<span>Discover more {variant}</span>
					<ArrowRight class="size-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		{/if}

		{#if variant === 'events' && events !== null && events !== undefined}
			<CardGrid itemCount={events.length} variant="featured" cardType="event">
				{#each events as event (event.id)}
					<EventCard
						{event}
						variant="featured"
						onclick={() => openEvent(event)}
						onBookmark={() => toggleEventBookmark(event.id)}
						isBookmarked={bookmarkedEvents.has(event.id)}
					/>
				{/each}
			</CardGrid>
		{:else if variant === 'orgs' && organizations !== null && organizations !== undefined}
			<CardGrid itemCount={organizations.length} variant="featured" cardType="org">
				{#each organizations as org (org.id)}
					<OrgCard organization={org} variant="featured" onclick={() => openOrg(org)} />
				{/each}
			</CardGrid>
		{/if}
	</section>
{/if}

<EventDialog
	event={selectedEvent}
	open={eventDialogOpen}
	onOpenChange={(open) => (eventDialogOpen = open)}
	onBookmark={() => selectedEvent && toggleEventBookmark(selectedEvent.id)}
	onRSVP={handleRSVP}
	isBookmarked={selectedEvent ? bookmarkedEvents.has(selectedEvent.id) : false}
/>

<OrgDialog
	organization={selectedOrg}
	open={orgDialogOpen}
	onOpenChange={(open) => (orgDialogOpen = open)}
	onBookmark={() => selectedOrg && toggleOrgBookmark(selectedOrg.id)}
	onJoin={handleJoin}
	isBookmarked={selectedOrg ? bookmarkedOrgs.has(selectedOrg.id) : false}
/>
