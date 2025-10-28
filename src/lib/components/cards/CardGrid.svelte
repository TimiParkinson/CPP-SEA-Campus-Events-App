<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		minCardWidth?: number;
		gap?: number;
		emptyMessage?: string;
		itemCount: number;
		children: Snippet;
	}

	let {
		minCardWidth = 160,
		gap = 4,
		emptyMessage = 'No items found',
		itemCount,
		children
	}: Props = $props();
</script>

{#if itemCount === 0}
	<div class="py-16 text-center">
		<p class="text-lg text-muted-foreground">{emptyMessage}</p>
	</div>
{:else}
	<div class="grid gap-{gap} grid-cols-[repeat(auto-fill,minmax({minCardWidth}px,1fr))]">
		{@render children()}
	</div>
{/if}
