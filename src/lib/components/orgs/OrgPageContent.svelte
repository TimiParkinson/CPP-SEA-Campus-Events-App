<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<div
	class={cn('container mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8', className)}
	style="transform: translateY(-40px);"
>
	{@render children()}
</div>
