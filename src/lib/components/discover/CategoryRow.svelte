<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		cardType: 'event' | 'org';
		onTitleClick: () => void;
		children: Snippet;
	}

	let { title, cardType, onTitleClick, children }: Props = $props();

	let scrollContainer: HTMLDivElement;
	let canScrollLeft = $state(false);
	let canScrollRight = $state(false);

	// Check scroll position to show/hide arrows
	function updateScrollButtons() {
		if (!scrollContainer) return;
		canScrollLeft = scrollContainer.scrollLeft > 5; // 5px threshold
		canScrollRight =
			scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 5;
	}

	// Initialize scroll buttons on mount
	onMount(() => {
		if (scrollContainer) {
			updateScrollButtons();
		}
	});

	// Scroll by one viewport width
	function scrollByPage(direction: 'left' | 'right') {
		if (!scrollContainer) return;

		const containerWidth = scrollContainer.clientWidth;
		const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;

		scrollContainer.scrollBy({
			left: scrollAmount,
			behavior: 'smooth'
		});

		// Update buttons after scroll animation completes
		setTimeout(updateScrollButtons, 350);
	}

	function handleTitleClick(e: MouseEvent) {
		e.preventDefault();
		onTitleClick();
	}

	// Grid classes for HORIZONTAL scrolling (no wrapping!)
	const gridClasses = $derived(() => {
		if (cardType === 'event') {
			// Events: Fixed width cards in horizontal row
			return 'grid auto-cols-[180px] grid-flow-col gap-3 sm:auto-cols-[200px] sm:gap-4 md:auto-cols-[220px] lg:auto-cols-[240px] lg:gap-6';
		} else {
			// Orgs: Fixed width cards in horizontal row
			return 'grid auto-cols-[120px] grid-flow-col gap-3 sm:auto-cols-[140px] sm:gap-4 md:auto-cols-[160px] lg:auto-cols-[180px] lg:gap-6';
		}
	});
</script>

<section class="relative">
	<!-- Section Header -->
	<div class="mb-4 flex items-center justify-between sm:mb-6">
		<button
			type="button"
			onclick={handleTitleClick}
			class="group cursor-pointer text-left transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
		>
			<h2
				class="text-xl font-bold text-white transition-colors group-hover:text-gray-300 sm:text-2xl"
			>
				{title}
				<span
					class="ml-2 inline-block transition-transform group-hover:translate-x-1"
					aria-hidden="true"
				>
					→
				</span>
			</h2>
		</button>

		<!-- Arrow Navigation (ALL screens now!) -->
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => scrollByPage('left')}
				disabled={!canScrollLeft}
				class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-white/90 hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/60 disabled:hover:text-white sm:size-10"
				aria-label="Scroll left"
			>
				<ChevronLeft class="size-4 sm:size-5" />
			</button>
			<button
				type="button"
				onclick={() => scrollByPage('right')}
				disabled={!canScrollRight}
				class="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-white/90 hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/60 disabled:hover:text-white sm:size-10"
				aria-label="Scroll right"
			>
				<ChevronRight class="size-4 sm:size-5" />
			</button>
		</div>
	</div>

	<!-- Scrollable Container (horizontal scroll, NO WRAPPING) -->
	<div
		bind:this={scrollContainer}
		onscroll={updateScrollButtons}
		class="scrollbar-hide overflow-x-auto"
	>
		<div class={gridClasses()}>
			{@render children()}
		</div>
	</div>
</section>

<style>
	/* Hide scrollbar but keep functionality */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
