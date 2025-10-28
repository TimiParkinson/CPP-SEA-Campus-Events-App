<script lang="ts">
	interface Props {
		title: string;
		date?: string;
		imageUrl?: string;
		onclick?: () => void;
	}

	let { title, date, imageUrl, onclick }: Props = $props();
</script>

<button
	class="flex flex-col self-start text-left cursor-pointer hover:opacity-80 transition-opacity"
	{onclick}
>
	<div
		class="aspect-square w-full rounded-lg bg-muted"
		style={imageUrl ? `background-image: url(${imageUrl}); background-size: cover;` : ''}
	></div>
	<h2 class="mt-2 line-clamp-1 font-semibold">{title}</h2>
	{#if date}
		<p class="text-sm font-light text-muted-foreground">
			{new Date(date).toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit',
				year: '2-digit'
			})}
		</p>
	{/if}
</button>
