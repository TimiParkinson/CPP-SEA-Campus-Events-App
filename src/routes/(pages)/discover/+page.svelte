<script lang="ts">
	import TabSwitcher from '$lib/components/discover/TabSwitcher.svelte';
	import Featured from '$lib/components/cards/Featured.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import OrgCard from '$lib/components/cards/OrgCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import OrgDialog from '$lib/components/dialogs/OrgDialog.svelte';
	import ScrollRow from '$lib/components/shared/ScrollRow.svelte';
	import type { Event, Organization } from '$lib/types/index.js';

	let { data } = $props();
	const orgsData = data.organizations;
	const eventData = data.events;
	const eventTagsData = data.eventTags;
	const orgCategoriesData = data.organizationCategories;

	// Tab state
	let selectedTab = $state('events');

	// Dialog state
	let selectedEvent = $state<Event | null>(null);
	let selectedOrg = $state<Organization | null>(null);
	let eventDialogOpen = $state(false);
	let orgDialogOpen = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());
	let bookmarkedOrgs = $state<Set<string>>(new Set());

	// Organize events by tag
	const eventsByTag = $derived(() => {
		const map = new Map<string, Event[]>();
		eventData.forEach((event) => {
			event.tags?.forEach((tag) => {
				if (!map.has(tag.name)) {
					map.set(tag.name, []);
				}
				map.get(tag.name)!.push(event);
			});
		});
		return map;
	});

	// Organize orgs by category
	const orgsByCategory = $derived(() => {
		const map = new Map<string, Organization[]>();
		orgsData.forEach((org) => {
			org.categories?.forEach((category) => {
				const key = category.name.toLowerCase().replace(/\s+/g, '_');
				if (!map.has(key)) {
					map.set(key, []);
				}
				map.get(key)!.push(org);
			});
		});
		return map;
	});

	// Featured items
	const featuredEvents = $derived(eventData.slice(0, 2));
	const featuredOrgs = $derived(orgsData.slice(0, 5));

	// Helper functions
	function getEventTagLabel(tagName: string): string {
		const labels: Record<string, string> = {
			workshop: 'Workshops',
			social: 'Social Events',
			networking: 'Networking',
			competition: 'Competitions',
			volunteer: 'Volunteer',
			lecture: 'Lectures',
			fundraiser: 'Fundraisers',
			'free-food': 'Free Food'
		};
		return labels[tagName] || tagName;
	}

	function getOrgCategoryLabel(categoryName: string): string {
		const labels: Record<string, string> = {
			academic: 'Academic',
			cultural: 'Cultural',
			sports: 'Sports',
			service: 'Service',
			special_interest: 'Special Interest'
		};
		return labels[categoryName] || categoryName;
	}

	const eventCategories = $derived(() => {
		return eventTagsData
			.map((tag) => ({
				key: tag.name,
				label: getEventTagLabel(tag.name),
				color: tag.color
			}))
			.filter((cat) => eventsByTag().has(cat.key));
	});

	const orgCategories = $derived(() => {
		return orgCategoriesData
			.map((category) => ({
				key: category.name.toLowerCase().replace(/\s+/g, '_'),
				label: getOrgCategoryLabel(category.name),
				color: category.color
			}))
			.filter((cat) => orgsByCategory().has(cat.key));
	});

	// Dialog handlers
	function openEvent(event: Event) {
		selectedEvent = event;
		eventDialogOpen = true;
	}

	function openOrg(org: Organization) {
		selectedOrg = org;
		orgDialogOpen = true;
	}

	function toggleEventBookmark(eventId: string) {
		bookmarkedEvents.has(eventId)
			? bookmarkedEvents.delete(eventId)
			: bookmarkedEvents.add(eventId);
		bookmarkedEvents = bookmarkedEvents;
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

	function navigateToSearchWithFilter(type: 'tag' | 'category', value: string) {
		window.location.href = `/search?${type}=${encodeURIComponent(value)}`;
	}
</script>

<svelte:head>
	<title>Discover - Campus Events</title>
	<meta name="description" content="Discover events and organizations on campus" />
</svelte:head>

<div class="pt-24 space-y-16">
	<!-- Header -->
	<div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="mb-2 text-3xl font-bold sm:text-4xl lg:text-5xl">Discover</h1>
			<p class="text-sm sm:text-base">Explore campus events and organizations</p>
		</div>

		<TabSwitcher
			tabs={[
				{ value: 'events', label: 'Events' },
				{ value: 'organizations', label: 'Organizations' }
			]}
			selected={selectedTab}
			onSelect={(value) => (selectedTab = value)}
		/>
	</div>

	<!-- Events Tab -->
	{#if selectedTab === 'events'}
		<!-- Featured Events -->
		<Featured variant="events" events={featuredEvents} title="Featured Events" viewHref="/search" />

		<!-- Event Categories -->
		{#each eventCategories() as category}
			{@const categoryEvents = eventsByTag().get(category.key) || []}
			{#if categoryEvents.length > 0}
				<div class="mb-10 sm:mb-12">
					<ScrollRow
						title={category.label}
						onTitleClick={() => navigateToSearchWithFilter('tag', category.key)}
					>
						{#each categoryEvents as event (event.id)}
							<EventCard
								{event}
								variant="general"
								onclick={() => openEvent(event)}
								onBookmark={() => toggleEventBookmark(event.id)}
								isBookmarked={bookmarkedEvents.has(event.id)}
							/>
						{/each}
					</ScrollRow>
				</div>
			{/if}
		{/each}
	{/if}

	<!-- Organizations Tab -->
	{#if selectedTab === 'organizations'}
		<!-- Featured Organizations -->
		<Featured
			variant="orgs"
			organizations={featuredOrgs}
			title="Featured Organizations"
			viewHref="/search"
		/>

		<!-- Org Categories -->
		{#each orgCategories() as category}
			{@const categoryOrgs = orgsByCategory().get(category.key) || []}
			{#if categoryOrgs.length > 0}
				<div class="mb-10 sm:mb-12">
					<ScrollRow
						title={category.label}
						onTitleClick={() => navigateToSearchWithFilter('category', category.key)}
					>
						{#each categoryOrgs as org (org.id)}
							<div class="w-44 shrink-0 sm:w-48 md:w-52">
								<OrgCard organization={org} variant="general" onclick={() => openOrg(org)} />
							</div>
						{/each}
					</ScrollRow>
				</div>
			{/if}
		{/each}
	{/if}
</div>

<!-- Dialogs -->
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
