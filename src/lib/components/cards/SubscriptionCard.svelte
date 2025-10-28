<script lang="ts">
	interface Props {
		title: string;
		date?: string;
		imageUrl?: string;
		onclick?: () => void;
	}

	let { title, date, imageUrl, onclick }: Props = $props();

	// If no image, use initials as fallback
	let initials = $derived(
		title
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);
</script>

<button
	class="flex cursor-pointer flex-col self-start text-center transition-opacity hover:opacity-80"
	{onclick}
>
	<div
		class="flex items-center aspect-square justify-center overflow-hidden rounded-full bg-muted"
		style={imageUrl ? `background-image: url(${imageUrl}); background-size: cover;` : ''}
	>
		{#if !imageUrl}
			<span class="text-4xl font-semibold text-muted-foreground">
				{initials}
			</span>
		{/if}
	</div>

	<h2 class="mt-1 line-clamp-1 font-semibold">{title}</h2>
	{#if date}
		<p class="text-sm font-light text-muted-foreground">{date}</p>
	{/if}
</button>
