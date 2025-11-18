<script lang="ts">
	import { Bookmark } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';

	interface Props {
		isBookmarked?: boolean;
		onclick?: (e: MouseEvent) => void;
		size?: 'general' | 'featured' | 'dialog';
		class?: string;
	}

	let { isBookmarked = false, onclick, size = 'general', class: className }: Props = $props();

	const sizes = {
		featured: {
			button: 'p-3',
			icon: 'size-7'
		},
		general: {
			button: 'p-2 @[280px]:p-2.5',
			icon: 'size-4 @[200px]:size-5 @[280px]:size-7'
		},
		dialog: {
			button: 'p-2.5',
			icon: 'size-5'
		}
	};

	const config = $derived(sizes[size]);
</script>

<button
	type="button"
	{onclick}
	class={cn(
		'flex cursor-pointer items-center justify-center rounded-lg backdrop-blur-sm transition-all',
		isBookmarked
			? 'bg-white/90 text-yellow-500 hover:bg-white'
			: 'bg-black/80 text-white hover:bg-white/90 hover:text-black',
		config.button,
		className
	)}
	aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
>
	<Bookmark class={cn('transition-all', config.icon)} />
</button>
