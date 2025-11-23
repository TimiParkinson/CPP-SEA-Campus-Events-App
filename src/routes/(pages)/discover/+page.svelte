<script lang="ts">
	import TabSwitcher from '$lib/components/discover/TabSwitcher.svelte';
	import CategoryRow from '$lib/components/discover/CategoryRow.svelte';
	import Featured from '$lib/components/cards/Featured.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import OrgCard from '$lib/components/cards/OrgCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import OrgDialog from '$lib/components/dialogs/OrgDialog.svelte';

	// Import types
	import type { Event, Organization } from '$lib/types/index.js';

	// Receive data from +page.server.ts
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

	// Featured items (first 2 events, first 5 orgs)
	const featuredEvents = $derived(eventData.slice(0, 2));
	const featuredOrgs = $derived(orgsData.slice(0, 5));

	// Helper to get display labels for event tags
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

	// Event categories to display (from consolidated mock data)
	const eventCategories = $derived(() => {
		return eventTagsData
			.map((tag) => ({
				key: tag.name,
				label: getEventTagLabel(tag.name),
				color: tag.color
			}))
			.filter((cat) => eventsByTag().has(cat.key));
	});

	// Helper to format organization category labels
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

	// Org categories to display (from consolidated mock data)
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

	// Navigation handlers
	function navigateToSearchWithFilter(type: 'tag' | 'category', value: string) {
		window.location.href = `/search?${type}=${encodeURIComponent(value)}`;
	}
</script>

<svelte:head>
	<title>Discover - Campus Events</title>
	<meta name="description" content="Discover events and organizations on campus" />
</svelte:head>

<div class="min-h-screen bg-black pt-24 pb-16">
	<div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Page Header with Tab Switcher -->
		<div
			class="mb-8 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
		>
			<div>
				<h1 class="mb-2 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Discover</h1>
				<p class="text-sm text-gray-400 sm:text-base">Explore campus events and organizations</p>
			</div>

			<!-- Tab Switcher -->
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
			<section class="mb-10 sm:mb-12">
				<div class="mb-6 flex items-center justify-between sm:mb-8">
					<h2 class="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">Featured Events</h2>
					<a
						href="/search"
						class="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
					>
						<span>View all</span>
						<span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
					</a>
				</div>
				<Featured variant="events" events={featuredEvents} minimal={true} />
			</section>

			<!-- Event Categories -->
			{#each eventCategories() as category}
				{@const categoryEvents = eventsByTag().get(category.key) || []}
				{#if categoryEvents.length > 0}
					<div class="mb-10 sm:mb-12">
						<CategoryRow
							title={category.label}
							cardType="event"
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
						</CategoryRow>
					</div>
				{/if}
			{/each}
		{/if}

		<!-- Organizations Tab -->
		{#if selectedTab === 'organizations'}
			<!-- Featured Organizations -->
			<section class="mb-10 sm:mb-12">
				<div class="mb-6 flex items-center justify-between sm:mb-8">
					<h2 class="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
						Featured Organizations
					</h2>
					<a
						href="/search"
						class="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
					>
						<span>View all</span>
						<span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
					</a>
				</div>
				<Featured variant="orgs" organizations={featuredOrgs} minimal={true} />
			</section>

			<!-- Org Categories -->
			{#each orgCategories() as category}
				{@const categoryOrgs = orgsByCategory().get(category.key) || []}
				{#if categoryOrgs.length > 0}
					<div class="mb-10 sm:mb-12">
						<CategoryRow
							title={category.label}
							cardType="org"
							onTitleClick={() => navigateToSearchWithFilter('category', category.key)}
						>
							{#each categoryOrgs as org (org.id)}
								<OrgCard organization={org} variant="general" onclick={() => openOrg(org)} />
							{/each}
						</CategoryRow>
					</div>
				{/if}
			{/each}
		{/if}
	</div>
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
