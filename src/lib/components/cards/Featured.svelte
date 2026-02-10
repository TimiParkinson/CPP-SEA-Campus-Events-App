<script lang="ts">
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import OrgCard from '$lib/components/cards/OrgCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import OrgDialog from '$lib/components/dialogs/OrgDialog.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import ScrollRow from '../shared/ScrollRow.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import type { Event, Organization } from '$lib/types/index.js';

	interface Props {
		variant: 'events' | 'orgs';
		events?: Event[] | null;
		organizations?: Organization[] | null;
		title?: string;
		viewHref?: string;
		viewText?: string;
	}

	let {
		events,
		organizations,
		title,
		variant,
		viewHref = '/search',
		viewText = 'View all'
	}: Props = $props();

	// Event States and Functions
	let selectedEvent = $state<Event | null>(null);
	let eventDialogOpen = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());

	function openEvent(event: Event) {
		selectedEvent = event;
		eventDialogOpen = true;
	}

	function toggleEventBookmark(eventId: string) {
		bookmarkedEvents.has(eventId)
			? bookmarkedEvents.delete(eventId)
			: bookmarkedEvents.add(eventId);
		bookmarkedEvents = bookmarkedEvents;
	}

	// Organization States and Functions
	let selectedOrg = $state<Organization | null>(null);
	let orgDialogOpen = $state(false);
	let bookmarkedOrgs = $state<Set<string>>(new Set());

	function openOrg(org: Organization) {
		selectedOrg = org;
		orgDialogOpen = true;
	}

	function toggleOrgBookmark(orgId: string) {
		bookmarkedOrgs.has(orgId) ? bookmarkedOrgs.delete(orgId) : bookmarkedOrgs.add(orgId);
		bookmarkedOrgs = bookmarkedOrgs;
	}

	function handleRSVP() {
		console.log('RSVP clicked');
	}

	function handleJoin() {
		console.log('Join clicked');
	}

	// Derived Values
	const cardType = $derived(variant === 'orgs' ? 'org' : 'event');
	const defaultTitle = $derived(variant === 'orgs' ? 'Featured Organizations' : 'Featured Events');
	const itemCount = $derived(
		variant === 'events' ? (events?.length ?? 0) : (organizations?.length ?? 0)
	);
</script>

<section>
	<div class="mb-4 flex flex-row items-center justify-between gap-3">
		<h2 class="text-2xl font-bold sm:text-3xl lg:text-4xl">
			{title ?? defaultTitle}
		</h2>

		<a
			href={viewHref}
			class="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
		>
			<span class="hidden sm:inline">{viewText}</span>
			<ArrowRight class="size-4 transition-transform group-hover:translate-x-1" />
		</a>
	</div>

	{#if variant === 'events' && events}
		<CardGrid {itemCount} variant="featured" {cardType}>
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
	{:else if variant === 'orgs' && organizations}
		<ScrollRow showArrows={false}>
			{#each organizations as organization (organization.id)}
				<div class="w-32 shrink-0 sm:w-36 md:w-40 lg:w-50">
					<OrgCard {organization} variant="featured" onclick={() => openOrg(organization)} />
				</div>
			{/each}
		</ScrollRow>
	{/if}
</section>

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
