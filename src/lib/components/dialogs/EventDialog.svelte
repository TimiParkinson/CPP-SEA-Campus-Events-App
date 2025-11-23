<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Calendar, Clock, MapPin, Users, Icon } from '@lucide/svelte';
	import {
		formatDateRange,
		formatFullDate,
		formatTimeRange,
		isMultiDayEvent
	} from '$lib/utils/dateFormatters.js';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import BookmarkButton from '$lib/components/shared/BookmarkBtn.svelte';
	import Detail from '../shared/Detail.svelte';
	import { formatMultipleOrgs } from '$lib/utils/orgNameFormatters.js';
	import type { Event } from '$lib/types/index.js';

	interface Props {
		event: Event | null;
		open: boolean;
		onOpenChange: (open: boolean) => void;
		onBookmark?: () => void;
		onRSVP?: () => void;
		isBookmarked?: boolean;
	}

	let { event, open, onOpenChange, onBookmark, onRSVP, isBookmarked = false }: Props = $props();

	let gradient = $derived(event ? getRandomGradient(event.id) : '');
	let descriptionExpanded = $state(false);
	const MAX_DESCRIPTION_DISPLAY = 200;

	let shouldTruncateDescription = $derived(
		event?.description && event.description.length > MAX_DESCRIPTION_DISPLAY
	);

	let displayedDescription = $derived(() => {
		if (!event?.description) return '';
		if (!shouldTruncateDescription || descriptionExpanded) return event.description;
		return event.description.slice(0, MAX_DESCRIPTION_DISPLAY) + '...';
	});

	let hostsDisplay = $derived(() => {
		if (!event) return '';
		return formatMultipleOrgs(event.organizations || [], 60);
	});

	function handleViewFullEvent() {
		if (event) {
			window.location.href = `/events/${event.id}`;
		}
	}

	function handleOrgClick() {
		if (event?.organizations && event.organizations.length > 0) {
			// TODO
			console.log('Navigate to org:', event.organizations[0].name);
		}
	}

	function handleLocationClick() {
		if (event?.location) {
			// Open map (future implementation)
			console.log('Open map for:', event.location);
		}
	}

	function handleTagClick(tagName: string) {
		// Navigate to filtered search
		console.log('Filter by tag:', tagName);
	}

	function handleBookmarkClick(e: MouseEvent) {
		onBookmark?.();
	}

	function handleRSVPClick() {
		onRSVP?.();
	}

	function toggleDescription() {
		descriptionExpanded = !descriptionExpanded;
	}
</script>

<Dialog.Root {open} {onOpenChange}>
	<Dialog.Content
		class="max-h-[85vh] w-[calc(100vw-2rem)] max-w-2xl gap-0 overflow-hidden overflow-y-auto p-0 sm:max-h-[90vh] sm:w-full"
	>
		{#if event}
			<!-- Event Image/Gradient-->
			<div class="relative h-48 shrink-0 overflow-hidden sm:h-56 md:h-64">
				{#if event.imageUrl}
					<img
						src={event.imageUrl}
						alt={event.title}
						class="h-full w-full object-cover object-center"
					/>
				{:else}
					<div class="size-full" style="background: {gradient};"></div>
				{/if}
				<div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
			</div>

			<!-- CTAs -->
			<div class="relative px-4 sm:px-5 md:px-8">
				<div
					class="absolute inset-x-4 -top-5 flex flex-wrap items-center justify-between gap-2 sm:inset-x-5 md:inset-x-8"
				>
					<div class="flex items-center gap-2 sm:gap-3">
						<!-- RSVP  -->
						<Button
							onclick={handleRSVPClick}
							class="h-9 cursor-pointer px-3 text-xs shadow-lg sm:h-10 sm:px-4 sm:text-sm"
						>
							RSVP
						</Button>

						<!-- Bookmark Button -->
						<BookmarkButton
							{isBookmarked}
							onclick={handleBookmarkClick}
							size="dialog"
							class="size-10 border bg-background shadow-lg sm:size-11"
						/>
					</div>

					<!-- Attendee Count -->
					{#if event.attendeeCount}
						<div
							class="flex h-9 items-center gap-1 rounded-lg border bg-black px-2 text-xs font-medium whitespace-nowrap shadow-lg sm:h-10 sm:gap-1.5 sm:px-2.5 sm:text-sm md:px-4"
						>
							<Users class="size-3 shrink-0 sm:size-3.5 md:size-4" />
							<span class="text-white">{event.attendeeCount}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Content -->
			<div class="px-4 pt-8 pb-4 sm:px-5 sm:pt-9 sm:pb-5 md:px-8 md:pt-10 md:pb-8">
				<!-- Heading -->
				<div class="mb-5 space-y-2 sm:mb-6">
					<!-- Title -->
					<h2 class="text-lg leading-tight font-bold sm:text-xl md:text-2xl">{event.title}</h2>
					{#if event.description}
						<p class="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
							{displayedDescription()}
							{#if shouldTruncateDescription}
								<button
									onclick={toggleDescription}
									class="mt-1 mb-4 block cursor-pointer text-xs font-semibold text-primary underline hover:underline sm:text-sm"
								>
									{descriptionExpanded ? 'Read Less' : 'Read More'}
								</button>
							{/if}
						</p>
					{/if}

					<!-- Tags -->
					{#if event.tags && event.tags.length > 0}
						<div class="flex flex-wrap gap-1.5 sm:gap-2">
							{#each event.tags as tag}
								<button
									onclick={() => handleTagClick(tag.name)}
									class="cursor-pointer transition-opacity hover:opacity-80"
								>
									<Badge
										variant="secondary"
										style="background-color: {tag.color}20; border: 1px solid {tag.color}; color: {tag.color};"
										class="text-[10px] sm:text-xs"
									>
										{tag.name}
									</Badge>
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Event Details Grid -->
				<div class="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 md:gap-6">
					<!-- Date -->
					<Detail
						icon={Calendar}
						label="Date"
						value={formatDateRange(event.startTime, event.endTime)}
					/>

					<!-- Time -->
					<Detail
						icon={Clock}
						label="Time"
						value={formatTimeRange(event.startTime, event.endTime)}
					/>

					<!-- Location (Clickable) -->
					<Detail
						icon={MapPin}
						label="Location"
						value={event.location}
						clickable={true}
						onclick={handleLocationClick}
					/>

					{#if event.organizations && event.organizations.length > 0}
						<Detail
							icon={Users}
							label="Organization"
							value={hostsDisplay()}
							clickable={true}
							onclick={handleOrgClick}
						/>
					{/if}
				</div>

				<!-- View Full Event Page -->
				<Button
					onclick={handleViewFullEvent}
					variant="outline"
					class="w-full cursor-pointer py-5 text-xs sm:py-6 sm:text-sm"
				>
					View Full Event Details
				</Button>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
