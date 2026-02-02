<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		icon: typeof IconType;
		label: string;
		value?: string;
		href?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	let { icon, label, value, href, onclick, children }: Props = $props();

	const isInteractive = $derived(!!href || !!onclick);
	const LinkComponent = $derived(href ? 'a' : onclick ? 'button' : 'span');
	const IconComponent = icon;
</script>

<div class="flex items-start gap-2.5 sm:gap-3">
	<IconComponent class="mt-0.5 size-4 shrink-0 text-muted-foreground sm:size-5" />
	<div class="min-w-0 flex-1">
		<h3 class="mb-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs md:text-sm">
			{label}
		</h3>
		{#if isInteractive}
			<svelte:element
				this={LinkComponent}
				role={onclick ? 'button' : null}
				{href}
				{onclick}
				class="block cursor-pointer text-left text-xs transition-opacity hover:underline hover:opacity-80 sm:text-sm"
			>
				{#if children}
					{@render children()}
				{:else if value}
					<span class="wrap-break-word">{value}</span>
				{/if}
			</svelte:element>
		{:else if children}
			<div class="text-left text-xs sm:text-sm">
				{@render children()}
			</div>
		{:else if value}
			<p class="text-left text-xs wrap-break-word sm:text-sm">{value}</p>
		{/if}
	</div>
</div>
