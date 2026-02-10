<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		itemCount: number;
		emptyMessage?: string;
		variant?: 'featured' | 'general';
		cardType?: 'event' | 'org';
		children: Snippet;
	}

	let {
		itemCount,
		emptyMessage = 'No items found',
		variant = 'general',
		cardType = 'event',
		children
	}: Props = $props();

	const gridClasses = $derived(() => {
		// Featured
		if (variant === 'featured') {
			if (cardType === 'event') {
				return 'grid grid-cols-1 gap-6 md:grid-cols-2';
			}

			if (cardType === 'org') {
				return 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5';
			}
		}

		// General
		return 'flex gap-4 overflow-x-auto pb-4 scrollbar-hide';
	});
</script>

{#if itemCount === 0}
	<div class="flex items-center justify-center py-12">
		<p class="text-lg text-muted-foreground">{emptyMessage}</p>
	</div>
{:else}
	<div class={gridClasses()}>
		{@render children()}
	</div>
{/if}

<style>
	/* Hide scrollbar */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
