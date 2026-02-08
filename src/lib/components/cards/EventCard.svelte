<script lang="ts">
	import { MapPin, Clock, Users } from '@lucide/svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { formatTime, getDayOfMonth, getMonthAbbr } from '$lib/utils/dateFormatters.js';
	import BookmarkButton from '$lib/components/shared/BookmarkBtn.svelte';
	import type { Event } from '$lib/types/index.js';
	import Button from '../ui/button/button.svelte';

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

	function handleBookmarkClick(e: MouseEvent) {
		e.stopPropagation();
		onBookmark?.();
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
		class="group relative w-full overflow-hidden rounded-xl shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
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
			<div class="absolute inset-0 bg-linear-to-t from-card via-card/55 to-card/10"></div>
		</div>

		<!-- Date Badge -->
		<div
			class="pointer-events-none absolute flex flex-col items-center justify-center rounded-lg bg-background text-center backdrop-blur-sm
	       {isFeatured
				? 'top-4 left-4 size-14'
				: 'top-2 left-2 size-8 @[200px]:top-2.5 @[200px]:left-2.5 @[200px]:size-9'}"
		>
			<p
				class="leading-none font-bold
	          {isFeatured ? 'text-xl' : 'text-[10px] @[200px]:text-xs'}"
			>
				{getDayOfMonth(event.startTime)}
			</p>
			<p
				class="leading-none font-medium uppercase
	          {isFeatured ? 'mt-1 text-[10px]' : 'mt-0.5 text-[7px] @[200px]:text-[8px]'}"
			>
				{getMonthAbbr(event.startTime)}
			</p>
		</div>

		<!-- Bookmark Button -->
		<div
			class="absolute {isFeatured
				? 'top-4 right-4'
				: 'top-2 right-2 @[200px]:top-2.5 @[200px]:right-2.5'}"
		>
			<BookmarkButton
				{isBookmarked}
				onclick={handleBookmarkClick}
				variant="outline"
				size={isFeatured ? 'lg' : 'sm'}
				class={isFeatured ? '' : 'size-8 @[200px]:size-9'}
			/>
		</div>

		<!-- Content Overlay -->
		<div
			class="absolute inset-x-0 bottom-0 {isFeatured ? 'p-5' : 'p-2.5 @[200px]:p-3 @[280px]:p-4'}"
		>
			{#if isFeatured}
				<!-- Featured -->
				<div class="flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
					<div class="min-w-0 flex-1">
						<p class="mb-1.5 text-xl leading-tight font-bold">
							{event.title}
						</p>
						{#if event.description}
							<p class="line-clamp-2 text-sm md:max-w-md">
								{event.description}
							</p>
						{/if}
					</div>
					<Button
						{onclick}
						variant="outline"
						class="w-full shrink-0 cursor-pointer rounded-lg px-5 py-2 text-sm font-medium transition-colors md:w-auto"
					>
						View More Info
					</Button>
				</div>
			{:else}
				<!-- General -->
				<p
					class="mb-1 w-full truncate text-[11px] font-semibold @[200px]:mb-1.5 @[200px]:text-xs @[280px]:text-sm @[320px]:text-base"
				>
					{event.title}
				</p>

				<div
					class="pointer-events-none hidden items-start gap-1.5 text-[8px] @[180px]:flex @[200px]:gap-2 @[200px]:text-[9px] @[280px]:gap-3 @[280px]:text-[10px] @[320px]:text-xs"
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
