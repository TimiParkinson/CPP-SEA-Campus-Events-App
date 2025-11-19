<script lang="ts">
	import TabSwitcher from '$lib/components/discover/TabSwitcher.svelte';
	import CategoryRow from '$lib/components/discover/CategoryRow.svelte';
	import Featured from '$lib/components/cards/Featured.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import OrgCard from '$lib/components/cards/OrgCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import OrgDialog from '$lib/components/dialogs/OrgDialog.svelte';

	// Mock data organized by categories (from seed.ts)
	const mockEvents = [
		{
			id: 'event-1',
			title: 'Intro to Web Development Workshop',
			description: 'Learn HTML, CSS, and JavaScript basics',
			location: 'Engineering Building, Room 205',
			startTime: '2025-10-05T14:00:00Z',
			endTime: '2025-10-05T16:00:00Z',
			attendeeCount: 45,
			imageUrl: null,
			tags: [
				{ name: 'workshop', color: '#8B5CF6' },
				{ name: 'free-food', color: '#EF4444' }
			],
			organization: { name: 'Computer Science Club' }
		},
		{
			id: 'event-2',
			title: 'Salsa Night Social',
			description: 'Join us for an evening of salsa dancing',
			location: 'Student Center Ballroom',
			startTime: '2025-10-03T19:00:00Z',
			endTime: '2025-10-03T22:00:00Z',
			attendeeCount: 92,
			imageUrl: null,
			tags: [{ name: 'social', color: '#EC4899' }],
			organization: { name: 'Latin Dance Society' }
		},
		{
			id: 'event-3',
			title: 'Campus Cleanup Day',
			description: 'Help us make our campus beautiful',
			location: 'Meet at Main Quad',
			startTime: '2025-10-07T09:00:00Z',
			endTime: '2025-10-07T12:00:00Z',
			attendeeCount: 78,
			imageUrl: null,
			tags: [{ name: 'volunteer', color: '#14B8A6' }],
			organization: { name: 'Environmental Action Coalition' }
		},
		{
			id: 'event-4',
			title: 'Tech Career Fair Prep Session',
			description: 'Get ready for the upcoming career fair',
			location: 'Library, Study Room 3A',
			startTime: '2025-10-01T17:00:00Z',
			endTime: '2025-10-01T18:30:00Z',
			attendeeCount: 67,
			imageUrl: null,
			tags: [
				{ name: 'networking', color: '#3B82F6' },
				{ name: 'workshop', color: '#8B5CF6' }
			],
			organization: { name: 'Computer Science Club' }
		},
		{
			id: 'event-5',
			title: 'Soccer Tournament Finals',
			description: 'Championship game of the fall season',
			location: 'West Field',
			startTime: '2025-10-10T15:00:00Z',
			endTime: '2025-10-10T17:00:00Z',
			attendeeCount: 234,
			imageUrl: null,
			tags: [{ name: 'competition', color: '#F59E0B' }],
			organization: { name: 'Intramural Soccer League' }
		},
		{
			id: 'event-6',
			title: 'Board Game Night',
			description: 'Weekly game night featuring Catan and more',
			location: 'Student Lounge, 2nd Floor',
			startTime: '2025-10-04T18:00:00Z',
			endTime: '2025-10-04T21:00:00Z',
			attendeeCount: 54,
			imageUrl: null,
			tags: [
				{ name: 'social', color: '#EC4899' },
				{ name: 'free-food', color: '#EF4444' }
			],
			organization: { name: 'Board Game Club' }
		},
		{
			id: 'event-7',
			title: 'Resume Workshop',
			description: 'Learn how to craft a compelling resume',
			location: 'Career Center',
			startTime: '2025-10-02T13:00:00Z',
			endTime: '2025-10-02T14:30:00Z',
			attendeeCount: 89,
			imageUrl: null,
			tags: [
				{ name: 'workshop', color: '#8B5CF6' },
				{ name: 'networking', color: '#3B82F6' }
			],
			organization: { name: 'Career Development Center' }
		},
		{
			id: 'event-8',
			title: 'Climate Change Speaker Series',
			description: 'Dr. Maria Santos discusses local climate action',
			location: 'Science Building Auditorium',
			startTime: '2025-10-08T16:00:00Z',
			endTime: '2025-10-08T17:30:00Z',
			attendeeCount: 156,
			imageUrl: null,
			tags: [{ name: 'lecture', color: '#6366F1' }],
			organization: { name: 'Environmental Action Coalition' }
		},
		{
			id: 'event-9',
			title: 'Hackathon Kickoff',
			description: '24-hour coding marathon with prizes',
			location: 'Engineering Building',
			startTime: '2025-10-12T18:00:00Z',
			endTime: '2025-10-13T18:00:00Z',
			attendeeCount: 287,
			imageUrl: null,
			tags: [
				{ name: 'competition', color: '#F59E0B' },
				{ name: 'free-food', color: '#EF4444' }
			],
			organization: { name: 'Computer Science Club' }
		},
		{
			id: 'event-10',
			title: 'Bachata Technique Workshop',
			description: 'Advanced technique workshop for members',
			location: 'Dance Studio B',
			startTime: '2025-10-06T15:00:00Z',
			endTime: '2025-10-06T17:00:00Z',
			attendeeCount: 43,
			imageUrl: null,
			tags: [{ name: 'workshop', color: '#8B5CF6' }],
			organization: { name: 'Latin Dance Society' }
		},
		{
			id: 'event-11',
			title: 'Dungeons & Dragons Campaign Start',
			description: 'Starting a new D&D 5e campaign',
			location: 'Student Lounge, 2nd Floor',
			startTime: '2025-10-09T19:00:00Z',
			endTime: '2025-10-09T22:00:00Z',
			attendeeCount: 32,
			imageUrl: null,
			tags: [{ name: 'social', color: '#EC4899' }],
			organization: { name: 'Board Game Club' }
		},
		{
			id: 'event-12',
			title: 'E-Waste Collection Drive',
			description: 'Bring your old electronics for recycling',
			location: 'Parking Lot C',
			startTime: '2025-10-11T10:00:00Z',
			endTime: '2025-10-11T14:00:00Z',
			attendeeCount: 91,
			imageUrl: null,
			tags: [
				{ name: 'volunteer', color: '#14B8A6' },
				{ name: 'fundraiser', color: '#10B981' }
			],
			organization: { name: 'Environmental Action Coalition' }
		}
	];

	const mockOrgs = [
		{
			id: 'org-1',
			name: 'Computer Science Club',
			description: 'A community for students interested in software development',
			logoUrl: null,
			abbreviation: 'CS',
			categories: [{ name: 'academic', color: '#3B82F6' }],
			memberCount: 156
		},
		{
			id: 'org-2',
			name: 'Latin Dance Society',
			description: 'Learn salsa, bachata, and other Latin dance styles',
			logoUrl: null,
			abbreviation: 'LDS',
			categories: [{ name: 'cultural', color: '#F97316' }],
			memberCount: 127
		},
		{
			id: 'org-3',
			name: 'Environmental Action Coalition',
			description: 'Students working together for campus sustainability',
			logoUrl: null,
			abbreviation: 'EAC',
			categories: [
				{ name: 'service', color: '#6366F1' },
				{ name: 'academic', color: '#3B82F6' }
			],
			memberCount: 89
		},
		{
			id: 'org-4',
			name: 'Intramural Soccer League',
			description: 'Competitive and recreational soccer for all skill levels',
			logoUrl: null,
			abbreviation: 'ISL',
			categories: [{ name: 'sports', color: '#10B981' }],
			memberCount: 234
		},
		{
			id: 'org-5',
			name: 'Board Game Club',
			description: 'Weekly meetups to play strategy games and tabletop RPGs',
			logoUrl: null,
			abbreviation: 'BGC',
			categories: [{ name: 'special_interest', color: '#8B5CF6' }],
			memberCount: 67
		},
		{
			id: 'org-6',
			name: 'Career Development Center',
			description: 'Official university career services',
			logoUrl: null,
			abbreviation: 'CDC',
			categories: [{ name: 'academic', color: '#3B82F6' }],
			memberCount: 312
		}
	];

	// Tab state
	let selectedTab = $state('events');

	// Dialog state
	let selectedEvent = $state<(typeof mockEvents)[0] | null>(null);
	let selectedOrg = $state<(typeof mockOrgs)[0] | null>(null);
	let eventDialogOpen = $state(false);
	let orgDialogOpen = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());
	let bookmarkedOrgs = $state<Set<string>>(new Set());

	// Organize events by tag
	const eventsByTag = $derived(() => {
		const map = new Map<string, typeof mockEvents>();

		mockEvents.forEach((event) => {
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
		const map = new Map<string, typeof mockOrgs>();

		mockOrgs.forEach((org) => {
			org.categories?.forEach((category) => {
				if (!map.has(category.name)) {
					map.set(category.name, []);
				}
				map.get(category.name)!.push(org);
			});
		});

		return map;
	});

	// Featured items (first 2 events, first 5 orgs)
	const featuredEvents = $derived(mockEvents.slice(0, 2));
	const featuredOrgs = $derived(mockOrgs.slice(0, 5));

	// Event categories to display (with items)
	const eventCategories = $derived(() => {
		const categories = [
			{ key: 'workshop', label: 'Workshops', color: '#8B5CF6' },
			{ key: 'social', label: 'Social Events', color: '#EC4899' },
			{ key: 'networking', label: 'Networking', color: '#3B82F6' },
			{ key: 'competition', label: 'Competitions', color: '#F59E0B' },
			{ key: 'volunteer', label: 'Volunteer', color: '#14B8A6' },
			{ key: 'lecture', label: 'Lectures', color: '#6366F1' }
		];

		// Filter out empty categories
		return categories.filter((cat) => eventsByTag().has(cat.key));
	});

	// Org categories to display (with items)
	const orgCategories = $derived(() => {
		const categories = [
			{ key: 'academic', label: 'Academic', color: '#3B82F6' },
			{ key: 'cultural', label: 'Cultural', color: '#F97316' },
			{ key: 'sports', label: 'Sports', color: '#10B981' },
			{ key: 'service', label: 'Service', color: '#6366F1' },
			{ key: 'special_interest', label: 'Special Interest', color: '#8B5CF6' }
		];

		// Filter out empty categories
		return categories.filter((cat) => orgsByCategory().has(cat.key));
	});

	// Dialog handlers
	function openEvent(event: (typeof mockEvents)[0]) {
		selectedEvent = event;
		eventDialogOpen = true;
	}

	function openOrg(org: (typeof mockOrgs)[0]) {
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
