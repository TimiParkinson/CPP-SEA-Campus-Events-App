<script lang="ts">
	import { Icon, type Icon as IconType } from '@lucide/svelte';

	interface Props {
		icon: typeof IconType;
		label: string;
		value: string;
		clickable?: boolean;
		onclick?: () => void;
	}

	let { icon, label, value, clickable = false, onclick }: Props = $props();
</script>

{#if clickable}
	{@const Icon = icon}
	<button
		{onclick}
		class="-m-1 flex cursor-pointer items-center gap-2.5 rounded p-1 text-left transition-opacity hover:opacity-80 focus:ring-2 focus:ring-ring focus:outline-none sm:gap-3"
	>
		<Icon class="size-4 shrink-0 text-muted-foreground sm:size-5" />
		<div class="min-w-0">
			<h3 class="mb-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs md:text-sm">
				{label}
			</h3>
			<p class="text-xs wrap-break-word hover:underline sm:text-sm">{value}</p>
		</div>
	</button>
{:else}
	{@const Icon = icon}
	<div class="flex items-center gap-2.5 sm:gap-3">
		<Icon class="size-4 shrink-0 text-muted-foreground sm:size-5" />
		<div class="min-w-0">
			<h3 class="mb-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs md:text-sm">
				{label}
			</h3>
			<p class="text-xs sm:text-sm">{value}</p>
		</div>
	</div>
{/if}
