<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		itemCount: number;
		emptyMessage?: string;
		variant?: 'featured' | 'general';
		columns?: 3 | 4 | 5;
		cardType?: 'event' | 'org';
		children: Snippet;
	}

	let {
		itemCount,
		emptyMessage = 'No items found',
		variant = 'general',
		columns = 4,
		cardType = 'event',
		children
	}: Props = $props();

	const gridClasses = $derived(() => {
		if (variant === 'featured') {
			if (cardType === 'event') {
				return 'grid grid-cols-1 gap-6 md:grid-cols-2';
			}
			if (cardType === 'org') {
				const baseClasses =
					'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5';
				const centerLastClasses =
					'[&>*:nth-child(5):nth-last-child(1)]:col-span-2 [&>*:nth-child(5):nth-last-child(1)]:justify-self-center [&>*:nth-child(5):nth-last-child(1)]:w-1/2 sm:[&>*:nth-child(5):nth-last-child(1)]:col-span-1 sm:[&>*:nth-child(5):nth-last-child(1)]:w-full';
				return `${baseClasses} ${centerLastClasses}`;
			}
		}

		if (columns === 3) {
			return 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3';
		} else if (columns === 5) {
			return 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
		} else {
			return 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
		}
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
