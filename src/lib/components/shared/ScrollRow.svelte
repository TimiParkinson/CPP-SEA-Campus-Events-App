<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		showArrows?: boolean;
		onTitleClick?: () => void;
		children: Snippet;
	}

	let { title, showArrows = true, onTitleClick, children }: Props = $props();

	let scrollContainer: HTMLDivElement;

	function scrollLeft() {
		scrollContainer?.scrollBy({ left: -400, behavior: 'smooth' });
	}

	function scrollRight() {
		scrollContainer?.scrollBy({ left: 400, behavior: 'smooth' });
	}
</script>

<section class="relative">
	<!-- Header -->
	{#if title}
		<div class="flex items-center justify-between">
			<button
				onclick={onTitleClick}
				class="group flex items-center gap-2 text-xl font-bold transition-colors hover:text-primary sm:text-2xl"
			>
				<span>{title}</span>
				<span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
			</button>

			<!-- Scroll Controls -->
			{#if showArrows}
				<div class="flex gap-2">
					<button
						onclick={scrollLeft}
						class="flex size-9 items-center justify-center rounded-md border bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
						aria-label="Scroll left"
					>
						<ChevronLeft class="size-4" />
					</button>
					<button
						onclick={scrollRight}
						class="flex size-9 items-center justify-center rounded-md border bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
						aria-label="Scroll right"
					>
						<ChevronRight class="size-4" />
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Scrollable Container -->
	<div class="-mx-4 sm:-mx-6 lg:-mx-8">
		<div
			bind:this={scrollContainer}
			class="scrollbar-hide flex gap-4 overflow-x-auto py-4 sm:px-6 lg:px-8"
		>
			{@render children()}
		</div>
	</div>
</section>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
