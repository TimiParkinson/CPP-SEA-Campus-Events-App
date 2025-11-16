<script lang="ts">
	import { MapPin, Clock, Users } from '@lucide/svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { formatTime, getDayOfMonth, getMonthAbbr } from '$lib/utils/dateFormatters.js';
	import BookmarkButton from '$lib/components/BookmarkBtn.svelte';

	interface Event {
		id: string;
		title: string;
		description?: string | null;
		location: string;
		startTime: string;
		endTime: string;
		imageUrl?: string | null;
		attendeeCount?: number | null;
		tags?: Array<{ name: string; color: string }>;
		organization?: { name: string };
	}

	interface Props {
		event: Event;
		variant?: 'general' | 'featured';
		onclick?: () => void;
		onBookmark?: () => void;
		isBookmarked?: boolean;
	}

	let { event, variant = 'general', onclick, onBookmark, isBookmarked = false }: Props = $props();

	const isFeatured = $derived(variant === 'featured');
	let gradient = $derived(getRandomGradient(event.id));

	function handleTitleClick(e: MouseEvent) {
		e.stopPropagation();
		window.location.href = `/events/${event.id}`;
	}

	function handleBookmarkClick(e: MouseEvent) {
		e.stopPropagation();
		onBookmark?.();
	}

	function handleTagClick(e: MouseEvent) {
		e.stopPropagation();
	}
</script>

<div class="@container">
	<div
		role="button"
		tabindex="0"
		{onclick}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onclick?.();
			}
		}}
		class="group relative w-full overflow-hidden rounded-xl transition-all hover:scale-[1.01] hover:shadow-xl focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
		       {isFeatured ? 'h-80' : 'aspect-16/10'}"
	>
		<!-- Event Image/Gradient -->
		<div class="absolute inset-0">
			{#if event.imageUrl}
				<img
					src={event.imageUrl}
					alt=""
					class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
			{:else}
				<div class="size-full" style="background: {gradient};"></div>
			{/if}
			<div class="absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/10"></div>
		</div>

		<!-- Date Badge -->
		<div
			class="pointer-events-none absolute rounded-lg bg-black/80 text-center backdrop-blur-sm
			       {isFeatured
				? 'top-4 left-4 min-w-14 px-2.5 py-2'
				: 'top-2 left-2 min-w-9 px-1.5 py-1 @[200px]:top-3 @[200px]:left-3 @[200px]:min-w-11 @[200px]:px-2 @[200px]:py-1.5 @[280px]:min-w-[50px] @[280px]:px-2.5 @[280px]:py-2'}"
		>
			<p
				class="leading-none font-bold text-white
			          {isFeatured ? 'text-xl' : 'text-[11px] @[200px]:text-xs @[280px]:text-sm'}"
			>
				{getDayOfMonth(event.startTime)}
			</p>
			<p
				class="mt-0.5 font-medium text-white/80 uppercase
			          {isFeatured ? 'mt-1 text-[10px]' : 'text-[8px] @[200px]:text-[9px] @[280px]:text-[10px]'}"
			>
				{getMonthAbbr(event.startTime)}
			</p>
		</div>

		<!-- Bookmark Button -->
		<div
			class="absolute {isFeatured
				? 'top-4 right-4'
				: 'top-2 right-2 @[200px]:top-3 @[200px]:right-3'}"
		>
			<BookmarkButton
				{isBookmarked}
				onclick={handleBookmarkClick}
				size={isFeatured ? 'featured' : 'general'}
			/>
		</div>

		<!-- Content Overlay -->
		<div
			class="absolute inset-x-0 bottom-0 {isFeatured ? 'p-5' : 'p-2.5 @[200px]:p-3 @[280px]:p-4'}"
		>
			{#if isFeatured}
				<!-- Featured Layout: Two column on md+, single column on mobile -->
				<div class="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
					<div class="min-w-0 flex-1">
						<h3 class="mb-1.5 text-xl leading-tight font-bold text-white">
							{event.title}
						</h3>
						{#if event.description}
							<p class="line-clamp-2 text-sm text-white/80 md:max-w-md">
								{event.description}
							</p>
						{/if}
					</div>
					<button
						type="button"
						{onclick}
						class="w-full shrink-0 cursor-pointer rounded-lg bg-white/90 px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-white md:w-auto"
					>
						View More Info
					</button>
				</div>
			{:else}
				<!-- General Layout: Tags → Title → Quick Details -->
				<!-- Tags -->
				{#if event.tags && event.tags.length > 0}
					<div class="mb-1 hidden flex-wrap gap-1 @[240px]:flex">
						{#each event.tags.slice(0, 2) as tag}
							<button
								type="button"
								onclick={handleTagClick}
								class="cursor-pointer rounded-full px-1.5 py-0.5 text-[9px] font-medium text-white transition-opacity hover:opacity-80 @[280px]:px-2 @[280px]:text-[10px]"
								style="background-color: {tag.color}40; border: 1px solid {tag.color}80;"
							>
								{tag.name}
							</button>
						{/each}
						{#if event.tags.length > 2}
							<span
								class="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] text-white @[280px]:px-2 @[280px]:text-[10px]"
							>
								+{event.tags.length - 2}
							</span>
						{/if}
					</div>
				{/if}

				<!-- Title -->
				<button
					type="button"
					onclick={handleTitleClick}
					class="mb-1 w-full cursor-pointer rounded text-left hover:underline focus:ring-2 focus:ring-white/50 focus:outline-none @[200px]:mb-1.5"
				>
					<h3
						class="truncate text-[11px] font-semibold text-white @[200px]:text-xs @[280px]:text-sm @[320px]:text-base"
					>
						{event.title}
					</h3>
				</button>

				<!-- Quick Details -->
				<div
					class="pointer-events-none hidden items-start gap-1.5 text-[8px] text-white/90 @[180px]:flex @[200px]:gap-2 @[200px]:text-[9px] @[280px]:gap-3 @[280px]:text-[10px] @[320px]:text-xs"
				>
					<span
						class="flex min-w-0 flex-1 items-start gap-0.5 @[200px]:gap-1"
						title={event.location}
					>
						<MapPin class="mt-0.5 size-2 shrink-0 @[200px]:size-2.5 @[280px]:size-3" />
						<span class="truncate">{event.location}</span>
					</span>
					<span class="flex shrink-0 items-center gap-0.5 @[200px]:gap-1">
						<Clock class="size-2 shrink-0 @[200px]:size-2.5 @[280px]:size-3" />
						<span class="whitespace-nowrap">{formatTime(event.startTime)}</span>
					</span>
					{#if event.attendeeCount}
						<span class="flex shrink-0 items-center gap-0.5 @[200px]:gap-1">
							<Users class="size-2 shrink-0 @[200px]:size-2.5 @[280px]:size-3" />
							<span>{event.attendeeCount}</span>
						</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
