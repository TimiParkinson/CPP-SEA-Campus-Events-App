<script lang="ts">
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';
	import { X } from '@lucide/svelte';
	import SearchBar from '$lib/components/shared/SearchBar.svelte';
	import FilterDialog from '$lib/components/dialogs/FilterDialog.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import OrgCard from '$lib/components/cards/OrgCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import OrgDialog from '$lib/components/dialogs/OrgDialog.svelte';
	import type { Event, Organization } from '$lib/types/index.js';

	// Data
	let { data } = $props();
	const eventData = data.events;
	const orgData = data.organizations;
	const allTags = data.eventTags;
	const allCategories = data.organizationCategories;

	// State
	let searchQuery = $state($page.url.searchParams.get('q') || '');
	let debouncedQuery = $state($page.url.searchParams.get('q') || '');
	let filterDialogOpen = $state(false);

	// Filter state
	let selectedView = $state<'all' | 'events' | 'organizations'>('all');
	let selectedTimeFilter = $state<'all' | 'upcoming' | 'past' | 'thisMonth'>('all');
	let selectedTags = $state<string[]>([]);
	let selectedCategories = $state<string[]>([]);
	let tagFilterMode = $state<'any' | 'all'>('any');

	// Show more state
	let orgRowsShown = $state(2);
	let eventRowsShown = $state(4);
	const ITEMS_PER_ROW = 5;

	// Dialog state
	let selectedEvent = $state<Event | null>(null);
	let selectedOrg = $state<Organization | null>(null);
	let eventDialogOpen = $state(false);
	let orgDialogOpen = $state(false);
	let bookmarkedEvents = $state<Set<string>>(new Set());
	let bookmarkedOrgs = $state<Set<string>>(new Set());

	// Read URL params on mount and apply filters
	onMount(() => {
		const params = $page.url.searchParams;

		// Pre-apply tag filter from URL
		const tagParam = params.get('tag');
		if (tagParam) {
			selectedTags = [tagParam];
			selectedView = 'events';
		}

		// Pre-apply category filter from URL
		const categoryParam = params.get('category');
		if (categoryParam) {
			selectedCategories = [categoryParam];
			selectedView = 'organizations';
		}
	});

	// Debounce search input - filter immediately, update URL after delay
	let debounceTimeout: ReturnType<typeof setTimeout>;
	function handleSearchInput(value: string) {
		searchQuery = value;
		debouncedQuery = value;

		// Debounce URL via replaceState
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			const url = new URL($page.url);
			if (value) {
				url.searchParams.set('q', value);
			} else {
				url.searchParams.delete('q');
			}
			replaceState(url, {});
		}, 500);
	}

	function handleSearchClear() {
		searchQuery = '';
		debouncedQuery = '';
		const url = new URL($page.url);
		url.searchParams.delete('q');
		replaceState(url, {});
	}

	// Filter logic
	const filteredEvents = $derived(() => {
		const query = debouncedQuery.toLowerCase();
		let events = eventData;

		if (query) {
			events = events.filter(
				(e) =>
					e.title.toLowerCase().includes(query) ||
					e.description?.toLowerCase().includes(query) ||
					e.organizations?.some((org) => org.name.toLowerCase().includes(query)) ||
					e.tags?.some((t) => t.name.toLowerCase().includes(query))
			);
		}

		// Tag filtering (fixed 'all' mode)
		if (selectedTags.length > 0) {
			if (tagFilterMode === 'all') {
				// Event must have ALL selected tags
				events = events.filter((e) =>
					selectedTags.every((selectedTag) => e.tags?.some((t) => t.name === selectedTag))
				);
			} else {
				// Event must have ANY of the selected tags
				events = events.filter((e) => e.tags?.some((t) => selectedTags.includes(t.name)));
			}
		}

		if (selectedTimeFilter === 'upcoming') {
			const now = new Date();
			events = events.filter((e) => new Date(e.startTime) > now);
		} else if (selectedTimeFilter === 'past') {
			const now = new Date();
			events = events.filter((e) => new Date(e.startTime) < now);
		}

		return events;
	});

	const filteredOrgs = $derived(() => {
		const query = debouncedQuery.toLowerCase();
		let filterOrgs = orgData;

		if (query) {
			filterOrgs = filterOrgs.filter(
				(o) =>
					o.name.toLowerCase().includes(query) ||
					o.description?.toLowerCase().includes(query) ||
					o.categories?.some((c) => c.name.toLowerCase().includes(query))
			);
		}

		// Category filtering for filterOrgs
		if (selectedCategories.length > 0) {
			filterOrgs = filterOrgs.filter((o) =>
				o.categories?.some((c) => selectedCategories.includes(c.name))
			);
		}

		return filterOrgs;
	});

	const displayedOrgs = $derived(filteredOrgs().slice(0, orgRowsShown * ITEMS_PER_ROW));
	const displayedEvents = $derived(filteredEvents().slice(0, eventRowsShown * ITEMS_PER_ROW));

	const activeFilters = $derived(() => {
		const filters: Array<{ type: string; value: string; label: string }> = [];

		if (selectedView !== 'all') {
			filters.push({
				type: 'view',
				value: selectedView,
				label: selectedView === 'events' ? 'Events Only' : 'Organizations Only'
			});
		}

		if (selectedTimeFilter !== 'all') {
			filters.push({
				type: 'time',
				value: selectedTimeFilter,
				label:
					selectedTimeFilter === 'upcoming'
						? 'Upcoming'
						: selectedTimeFilter === 'past'
							? 'Past'
							: 'This Month'
			});
		}

		selectedTags.forEach((tag) => {
			filters.push({ type: 'tag', value: tag, label: tag });
		});

		selectedCategories.forEach((cat) => {
			filters.push({ type: 'category', value: cat, label: cat });
		});

		return filters;
	});

	function removeFilter(filter: { type: string; value: string }) {
		if (filter.type === 'view') {
			selectedView = 'all';
		} else if (filter.type === 'time') {
			selectedTimeFilter = 'all';
		} else if (filter.type === 'tag') {
			selectedTags = selectedTags.filter((t) => t !== filter.value);
		} else if (filter.type === 'category') {
			selectedCategories = selectedCategories.filter((c) => c !== filter.value);
		}
	}

	function clearAllFilters() {
		selectedView = 'all';
		selectedTimeFilter = 'all';
		selectedTags = [];
		selectedCategories = [];
		tagFilterMode = 'any';
		searchQuery = '';
		debouncedQuery = '';
		const url = new URL($page.url);
		url.searchParams.delete('q');
		url.searchParams.delete('tag');
		url.searchParams.delete('category');
		replaceState(url, {});
	}

	function openEvent(event: Event) {
		selectedEvent = event;
		eventDialogOpen = true;
	}

	function openOrg(org: Organization) {
		selectedOrg = org;
		orgDialogOpen = true;
	}

	function toggleEventBookmark(id: string) {
		if (bookmarkedEvents.has(id)) {
			bookmarkedEvents.delete(id);
		} else {
			bookmarkedEvents.add(id);
		}
		bookmarkedEvents = bookmarkedEvents;
	}

	function toggleOrgBookmark(id: string) {
		if (bookmarkedOrgs.has(id)) {
			bookmarkedOrgs.delete(id);
		} else {
			bookmarkedOrgs.add(id);
		}
		bookmarkedOrgs = bookmarkedOrgs;
	}
</script>

<svelte:head>
	<title>Search - Campus Events</title>
</svelte:head>

<div class="pt-24">
	<!-- Page Header -->
	<div class="mb-3 flex items-center justify-between gap-4">
		<div class="min-w-0 flex-1">
			{#if debouncedQuery}
				<h1 class="text-4xl leading-tight font-bold">
					Results for "<span class="text-primary">{debouncedQuery}</span>"
				</h1>
				<p class="mt-1 text-sm">
					{filteredEvents().length} event{filteredEvents().length !== 1 ? 's' : ''} · {filteredOrgs()
						.length} organization{filteredOrgs().length !== 1 ? 's' : ''}
				</p>
			{:else}
				<h1 class="text-4xl leading-tight font-bold">Explore</h1>
				<p class="mt-1 text-sm">Browse all events and organizations</p>
			{/if}
		</div>
	</div>

	<!-- Filter Pills -->
	{#if activeFilters().length > 0}
		<div class="mb-4 flex flex-wrap items-center gap-2">
			{#each activeFilters() as filter}
				<button
					onclick={() => removeFilter(filter)}
					class="group flex items-center gap-1.5 rounded-full bg-primary/80 px-3 py-1.5 text-sm transition-all hover:bg-primary"
				>
					<span>{filter.label}</span>
					<X class="size-3 transition-transform group-hover:scale-110" />
				</button>
			{/each}
			<button
				onclick={clearAllFilters}
				class="text-sm underline transition-colors hover:text-primary/80"
			>
				Clear all
			</button>
		</div>
	{/if}

	<!-- Search Bar -->
	<div class="mb-6">
		<SearchBar
			bind:value={searchQuery}
			onInput={handleSearchInput}
			onClear={handleSearchClear}
			onFilterClick={() => (filterDialogOpen = true)}
			autofocus={true}
			activeFiltersCount={activeFilters().length}
		/>
	</div>

	<!-- Events Section -->
	{#if selectedView === 'all' || selectedView === 'events'}
		{#if filteredEvents().length > 0}
			<section class="mb-12">
				<h2 class="mb-4 text-xl font-bold sm:text-2xl">Events</h2>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
					{#each displayedEvents as event}
						<EventCard
							{event}
							variant="general"
							onclick={() => openEvent(event)}
							onBookmark={() => toggleEventBookmark(event.id)}
							isBookmarked={bookmarkedEvents.has(event.id)}
						/>
					{/each}
				</div>

				{#if filteredEvents().length > displayedEvents.length}
					<div class="mt-6 text-center">
						<button
							onclick={() => (eventRowsShown += 2)}
							class="cursor-pointer text-sm font-medium transition-colors hover:text-primary hover:underline"
						>
							View more events ({filteredEvents().length - displayedEvents.length} remaining)
						</button>
					</div>
				{/if}
			</section>
		{/if}
	{/if}

	<!-- Organizations Section -->
	{#if selectedView === 'all' || selectedView === 'organizations'}
		{#if filteredOrgs().length > 0}
			<section class="mb-12">
				<h2 class="mb-4 text-xl font-bold sm:text-2xl">Organizations</h2>
				<div
					class="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
				>
					{#each displayedOrgs as org}
						<OrgCard organization={org} variant="general" onclick={() => openOrg(org)} />
					{/each}
				</div>

				{#if filteredOrgs().length > displayedOrgs.length}
					<div class="mt-6 text-center">
						<button
							onclick={() => (orgRowsShown += 2)}
							class="cursor-pointer text-sm font-medium transition-colors hover:text-primary hover:underline"
						>
							View more organizations ({filteredOrgs().length - displayedOrgs.length} remaining)
						</button>
					</div>
				{/if}
			</section>
		{/if}
	{/if}

	<!-- Empty State -->
	{#if (selectedView === 'all' && filteredEvents().length === 0 && filteredOrgs().length === 0) || (selectedView === 'events' && filteredEvents().length === 0) || (selectedView === 'organizations' && filteredOrgs().length === 0)}
		<div class="flex min-h-[400px] flex-col items-center justify-center py-12 text-center">
			<div class="mb-4 flex size-20 items-center justify-center rounded-full bg-white/5">
				<svg class="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<h2 class="mb-2 text-xl font-bold">No results found</h2>
			<p class="mb-6 max-w-md text-sm">
				{#if debouncedQuery}
					Try adjusting your search or filters to find what you're looking for.
				{:else}
					Start typing to search for events and organizations.
				{/if}
			</p>
			{#if activeFilters().length > 0}
				<button
					onclick={clearAllFilters}
					class="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/80"
				>
					Clear Search
				</button>
			{/if}
		</div>
	{/if}
</div>

<!-- Dialogs -->
<FilterDialog
	bind:open={filterDialogOpen}
	bind:selectedView
	bind:selectedTimeFilter
	bind:selectedTags
	bind:selectedCategories
	bind:tagFilterMode
	{allTags}
	{allCategories}
	onViewChange={(v) => (selectedView = v)}
	onTimeFilterChange={(f) => (selectedTimeFilter = f)}
	onTagToggle={(tag) => {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}}
	onCategoryToggle={(cat) => {
		if (selectedCategories.includes(cat)) {
			selectedCategories = selectedCategories.filter((c) => c !== cat);
		} else {
			selectedCategories = [...selectedCategories, cat];
		}
	}}
	onTagModeChange={(mode) => (tagFilterMode = mode)}
	onReset={clearAllFilters}
/>

<EventDialog
	event={selectedEvent}
	open={eventDialogOpen}
	onOpenChange={(open) => (eventDialogOpen = open)}
	onBookmark={() => selectedEvent && toggleEventBookmark(selectedEvent.id)}
	isBookmarked={selectedEvent ? bookmarkedEvents.has(selectedEvent.id) : false}
/>

<OrgDialog
	organization={selectedOrg}
	open={orgDialogOpen}
	onOpenChange={(open) => (orgDialogOpen = open)}
	onBookmark={() => selectedOrg && toggleOrgBookmark(selectedOrg.id)}
	isBookmarked={selectedOrg ? bookmarkedOrgs.has(selectedOrg.id) : false}
/>
