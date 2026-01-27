<script lang="ts">
	import { Bookmark } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';
	import Button from '../ui/button/button.svelte';

	interface Props {
		isBookmarked?: boolean;
		onclick?: (e: MouseEvent) => void;
		size?: 'sm' | 'default' | 'lg';
		variant?: 'default' | 'ghost' | 'outline' | 'secondary';
		class?: string;
	}

	let {
		isBookmarked = false,
		onclick,
		size = 'default',
		variant = 'default',
		class: className
	}: Props = $props();

	const iconSizes = {
		sm: 'size-4',
		default: 'size-5',
		lg: 'size-6'
	};
</script>

<Button
	type="button"
	{onclick}
	{size}
	{variant}
	class={cn('relative cursor-pointer border-0 shadow-lg backdrop-blur-sm', size === 'lg' ? 'py-7' : 'py-5', className)}
	aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
>
	<Bookmark
		class={cn(
			'fill-none transition-all duration-200',
			iconSizes[size],
			isBookmarked ? 'fill-accent' : 'hover:fill-black'
		)}
	/>
</Button>
