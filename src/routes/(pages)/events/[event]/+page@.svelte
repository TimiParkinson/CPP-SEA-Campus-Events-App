<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Calendar, Clock, MapPin, Send, UsersRound } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Detail from '$lib/components/shared/Detail.svelte';
	import BookmarkButton from '$lib/components/shared/BookmarkBtn.svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { formatDateRange, formatTimeRange } from '$lib/utils/dateFormatters.js';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';

	const eventId = $page.params.event;

	const mockEvent = {
		id: eventId as string,
		title: 'This is an example event',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		location: 'Insert a longer than usual location name',
		startTime: '2025-11-03T12:00:00Z',
		endTime: '2025-11-07T16:00:00Z',
		attendeeCount: 127,
		imageUrl:
			'https://educationsnapshots.com/wp-content/uploads/sites/4/2020/07/cal-poly-pomona-student-housing-phase-i-dining-commons-1-700x467.jpg',
		tags: [
			{ name: 'Upcoming', color: '#8B5CF6' },
			{ name: 'Upcoming', color: '#3B82F6' },
			{ name: 'Upcoming', color: '#10B981' }
		],
		organizations: [
			{
				id: 'org-1',
				name: 'Software Engineering Association',
				abbreviation: 'SEA',
				logoUrl: null
			},
			{
				id: 'org-2',
				name: 'Computer Science Society',
				abbreviation: 'CSS',
				logoUrl: 'https://cppcss.club/images/logo_for_web_2_2025.png'
			},
			{
				id: 'org-3',
				name: 'Cal Poly Pomona',
				abbreviation: 'CPP',
				logoUrl: 'https://logos-world.net/wp-content/uploads/2025/02/Cal-Poly-Pomona-Symbol.png'
			}
		],
		rsvpUrl: null,
		feedbackUrl: null
	};

	let gradient = $derived(getRandomGradient(mockEvent.id));
	let isBookmarked = $state(false);
	let hostsMenuOpen = $state(false);

	const hostsDisplay = $derived(() => {
		const orgs = mockEvent.organizations;
		if (orgs.length === 0) return 'No host';
		if (orgs.length === 1) {
			const orgName = orgs[0].name;
			// If org name too long, generate abbreviation
			if (orgName.length > 80) {
				return orgs[0].abbreviation || generateAbbreviation(orgName);
			}
			return orgName;
		}
		return `Hosted by ${orgs.length} Organizations`;
	});

	const isLocationLong = $derived(mockEvent.location.length > 35);
	const isMultiDayEvent = $derived(
		new Date(mockEvent.startTime).toDateString() !== new Date(mockEvent.endTime).toDateString()
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
		if (mockEvent.rsvpUrl) {
			window.open(mockEvent.rsvpUrl, '_blank');
		} else {
			console.log('RSVP clicked - not yet implemented');
		}
	}

	function handleFeedback() {
		if (mockEvent.feedbackUrl) {
			window.open(mockEvent.feedbackUrl, '_blank');
		} else {
			console.log('Send Feedback clicked - not yet implemented');
		}
	}

	function handleOrgClick(orgId: string) {
		window.location.href = `/organizations/${orgId}`;
		hostsMenuOpen = false;
	}

	function handleTagClick(tagName: string) {
		console.log('Filter by tag:', tagName);
		// Navigate to search/discover with tag filter
	}
</script>

<svelte:head>
	<title>{mockEvent.title} - Campus Events</title>
</svelte:head>

<div class="min-h-screen bg-black">
	<!-- Banner -->
	<div class="relative h-64 overflow-hidden sm:h-80 md:h-96">
		<!-- Background Image/Gradient -->
		{#if mockEvent.imageUrl}
			<img
				src={mockEvent.imageUrl}
				alt={mockEvent.title}
				class="size-full object-cover object-center"
			/>
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

		<!-- Attendee Count -->
		{#if mockEvent.attendeeCount}
			<div class="absolute top-4 right-4 sm:top-6 sm:right-6">
				<div
					class="flex items-center gap-2 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-white backdrop-blur-sm sm:px-4"
				>
					<UsersRound size="17" />
					<span class="text-sm font-semibold">{mockEvent.attendeeCount} attending</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Primary CTA -->
	<div class="relative px-4 sm:px-6 lg:px-8">
		<div class="container mx-auto max-w-4xl">
			<div class="flex -translate-y-5 items-end justify-between gap-3 sm:gap-4">
				<!-- Hosts -->
				<div class="relative">
					{#if mockEvent.organizations.length === 1}
						<!-- Single Organization -->
						<button
							type="button"
							onclick={() => handleOrgClick(mockEvent.organizations[0].id)}
							class="group flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-black/80 px-3 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90 sm:h-11 sm:gap-3 sm:px-4"
						>
							{#if mockEvent.organizations[0].logoUrl}
								<img
									src={mockEvent.organizations[0].logoUrl}
									alt={mockEvent.organizations[0].name}
									class="size-7 shrink-0 rounded-full object-cover"
								/>
							{:else}
								<div
									class="flex size-7 shrink-0 items-center justify-center rounded-full"
									style="background: {getRandomGradient(mockEvent.organizations[0].id)};"
								>
									<span class="text-[10px] font-bold text-white">
										{generateAbbreviation(mockEvent.organizations[0].name)}
									</span>
								</div>
							{/if}
							<span
								class="hidden text-sm font-semibold whitespace-nowrap text-white transition-opacity group-hover:opacity-80 sm:inline sm:text-base"
							>
								{hostsDisplay()}
							</span>
						</button>
					{:else}
						<!-- Multiple Organizations -->
						<Popover.Root bind:open={hostsMenuOpen}>
							<Popover.Trigger
								class="group flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-black/80 px-3 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90 sm:h-11 sm:gap-3 sm:px-4"
							>
								<!-- Logos -->
								<div class="flex shrink-0 -space-x-4">
									{#each mockEvent.organizations.slice(0, 3) as org, i}
										{#if org.logoUrl}
											<img
												src={org.logoUrl}
												alt={org.name}
												class="size-7 rounded-full border-2 border-black object-cover"
												style="z-index: {3 - i}"
											/>
										{:else}
											<div
												class="flex size-7 items-center justify-center rounded-full border-2 border-black"
												style="background: {getRandomGradient(org.id)}; z-index: {3 - i}"
											>
												<span class="text-[10px] font-bold text-white">
													{generateAbbreviation(org.name)}
												</span>
											</div>
										{/if}
									{/each}
								</div>
								<span
									class="hidden text-sm font-semibold whitespace-nowrap text-white transition-opacity group-hover:opacity-80 sm:inline sm:text-base"
								>
									{hostsDisplay()}
								</span>
							</Popover.Trigger>
							<Popover.Content
								class="w-[calc(100vw-2rem)] max-w-xs border-white/20 bg-black/80 p-2 backdrop-blur-sm sm:w-80"
								align="start"
								side="top"
								sideOffset={8}
							>
								<div class="space-y-1">
									{#each mockEvent.organizations as org}
										<button
											type="button"
											onclick={() => handleOrgClick(org.id)}
											class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/10"
										>
											{#if org.logoUrl}
												<img
													src={org.logoUrl}
													alt={org.name}
													class="size-10 shrink-0 rounded-full object-cover"
												/>
											{:else}
												<div
													class="flex size-10 shrink-0 items-center justify-center rounded-full"
													style="background: {getRandomGradient(org.id)};"
												>
													<span class="text-sm font-bold text-white">
														{generateAbbreviation(org.name)}
													</span>
												</div>
											{/if}
											<span class="min-w-0 flex-1 truncate text-sm font-medium text-white">
												{org.name}
											</span>
										</button>
									{/each}
								</div>
							</Popover.Content>
						</Popover.Root>
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

					<!-- RSVP -->
					<Button
						onclick={handleRSVP}
						size="lg"
						class="h-10 cursor-pointer px-4 text-sm shadow-lg sm:h-11 sm:px-6 sm:text-base"
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
			<h1 class="mb-3 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl">
				{mockEvent.title}
			</h1>

			<!-- Tags -->
			{#if mockEvent.tags && mockEvent.tags.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each mockEvent.tags as tag}
						<button
							type="button"
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
								value={formatDateRange(mockEvent.startTime, mockEvent.endTime)}
							/>
						{:else if detail === 'time'}
							<Detail
								icon={Clock}
								label="Time"
								value={formatTimeRange(mockEvent.startTime, mockEvent.endTime)}
							/>
						{:else if detail === 'location'}
							<Detail
								icon={MapPin}
								label="Location"
								value={mockEvent.location}
								clickable={true}
								onclick={() => console.log('Open map for:', mockEvent.location)}
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
								value={formatTimeRange(mockEvent.startTime, mockEvent.endTime)}
							/>
						{:else if detail === 'location'}
							<Detail
								icon={MapPin}
								label="Location"
								value={mockEvent.location}
								clickable={true}
								onclick={() => console.log('Open map for:', mockEvent.location)}
							/>
						{/if}
					{/each}
				</div>
			{/if}
		</div>

		<!-- Event Description -->
		<div class="mb-8">
			<h2 class="mb-4 text-xl font-bold text-white sm:text-2xl">About Event</h2>
			<p class="text-sm leading-relaxed text-gray-300 sm:text-base">
				{mockEvent.description}
			</p>
		</div>

		<!-- Send Feedback -->
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
</div>
