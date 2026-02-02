<script lang="ts">
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';
	import type { Organization } from '$lib/types/index.js';
	import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar/index.js';

	interface Props {
		organizations: Organization[];
		max?: number;
		size?: 'sm' | 'md';
	}

	let { organizations, max = 3, size = 'sm' }: Props = $props();

	const displayOrgs = $derived(organizations.slice(0, max));
	const remaining = $derived(Math.max(0, organizations.length - max));

	const sizeClasses = {
		sm: 'size-7',
		md: 'size-9'
	};

	const fontSizeClasses = {
		sm: 'text-[10px]',
		md: 'text-xs'
	};
</script>

<div class="flex -space-x-2">
	{#each displayOrgs as org, i}
		<Avatar class={sizeClasses[size]} style="z-index: {max - i}">
			<AvatarImage src={org.logoUrl} alt={org.name} class="object-cover" />
			<AvatarFallback style="background: {getRandomGradient(org.id)};">
				<span class="{fontSizeClasses[size]} leading-none font-bold text-white">
					{org.abbreviation || generateAbbreviation(org.name)}
				</span>
			</AvatarFallback>
		</Avatar>
	{/each}

	{#if remaining > 0}
		<div
			class="{sizeClasses[size]} flex items-center justify-center rounded-full bg-muted"
			style="z-index: 0"
		>
			<span class="{fontSizeClasses[size]} leading-none font-semibold text-muted-foreground">
				+{remaining}
			</span>
		</div>
	{/if}
</div>
