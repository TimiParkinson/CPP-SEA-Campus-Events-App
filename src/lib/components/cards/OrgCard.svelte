<script lang="ts">
	import { Users } from '@lucide/svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';
	import type { Organization } from '$lib/types/index.js';

	interface Props {
		organization: Organization;
		variant?: 'general' | 'featured';
		onclick?: () => void;
	}

	let { organization, variant = 'general', onclick }: Props = $props();

	const isFeatured = $derived(variant === 'featured');

	// Generate consistent gradient based on org ID
	let gradient = $derived(getRandomGradient(organization.id));

	// Get abbreviation or name for display when no logo
	let displayText = $derived(organization.abbreviation || generateAbbreviation(organization.name));

	// Abbreviation for title when card is narrow
	let displayAbbreviation = $derived(
		organization.abbreviation || generateAbbreviation(organization.name)
	);

	// Font size calculation
	let circleFontSize = $derived(() => {
		const length = displayText.length;
		if (isFeatured) {
			if (length <= 3) return 'text-6xl sm:text-7xl md:text-8xl tracking-tighter';
			if (length <= 5) return 'text-4xl sm:text-5xl md:text-6xl tracking-tight';
			if (length <= 8) return 'text-3xl sm:text-4xl md:text-5xl tracking-tight';
			if (length <= 12) return 'text-2xl sm:text-3xl md:text-4xl tracking-normal';
			return 'text-xl sm:text-2xl md:text-3xl tracking-normal';
		} else {
			if (length <= 3) return 'text-2xl @[180px]:text-3xl @[240px]:text-4xl tracking-tighter';
			if (length <= 5) return 'text-xl @[180px]:text-2xl @[240px]:text-3xl tracking-tight';
			if (length <= 8) return 'text-base @[180px]:text-lg @[240px]:text-xl tracking-tight';
			if (length <= 12) return 'text-sm @[180px]:text-base @[240px]:text-lg tracking-normal';
			return 'text-xs @[180px]:text-sm @[240px]:text-base tracking-normal';
		}
	});

	function handleCategoryClick(e: MouseEvent) {
		e.stopPropagation();
	}
</script>

<div class="@container">
	{#if isFeatured}
		<!-- Featured -->
		<button
			type="button"
			{onclick}
			title={organization.name}
			class="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-full transition-all hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
		>
			{#if organization.logoUrl}
				<!-- Image logo -->
				<img src={organization.logoUrl} alt={organization.name} class="size-full object-cover" />
			{:else}
				<!-- Gradient fallback -->
				<div class="flex size-full items-center justify-center" style="background: {gradient};">
					<span
						class="font-bold text-white {circleFontSize()} max-w-full text-center leading-none whitespace-nowrap select-none"
					>
						{displayText}
					</span>
				</div>
			{/if}
		</button>
	{:else}
		<!-- General -->
		<div
			role="button"
			tabindex="0"
			{onclick}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onclick?.();
				}
			}}
			class="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-neutral-900 transition-all hover:scale-[1.02] hover:shadow-xl focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
		>
			<!-- Inner container -->
			<div
				class="flex size-full flex-col items-center justify-center p-3 @[200px]:p-4 @[280px]:p-5"
			>
				<!-- Circular Logo -->
				<div class="mb-2.5 aspect-square w-[65%] shrink-0 @[200px]:mb-3 @[280px]:mb-3.5">
					<div
						class="size-full overflow-hidden rounded-full transition-transform group-hover:scale-105"
					>
						{#if organization.logoUrl}
							<!-- Image logo -->
							<img
								src={organization.logoUrl}
								alt={organization.name}
								class="size-full object-cover"
							/>
						{:else}
							<!-- Gradient fallback -->
							<div
								class="flex size-full items-center justify-center"
								style="background: {gradient};"
							>
								<span
									class="font-bold text-white {circleFontSize()} w-full text-center leading-none whitespace-nowrap select-none"
								>
									{displayText}
								</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Content -->
				<div class="pointer-events-none flex w-full flex-col items-center gap-1 @[200px]:gap-1.5">
					<!-- Title -->
					<h3
						class="w-full text-center text-[10px] leading-tight font-semibold text-white @[200px]:text-xs @[280px]:text-sm @[320px]:text-base"
					>
						<!-- Show abbreviation below @[200px] -->
						<span class="block @[200px]:hidden">{displayAbbreviation}</span>
						<span class="hidden truncate @[200px]:block">{organization.name}</span>
					</h3>

					<!-- Categories -->
					{#if organization.categories && organization.categories.length > 0}
						<div class="hidden flex-wrap justify-center gap-1 @[180px]:flex @[280px]:gap-1.5">
							{#each organization.categories.slice(0, 2) as category}
								<button
									type="button"
									onclick={handleCategoryClick}
									class="pointer-events-auto cursor-pointer rounded-full px-1.5 py-0.5 text-[8px] font-medium text-white transition-opacity hover:opacity-80 @[280px]:px-2 @[280px]:text-[9px]"
									style="background-color: {category.color}40; border: 1px solid {category.color}80;"
								>
									{category.name}
								</button>
							{/each}
							{#if organization.categories.length > 2}
								<span
									class="rounded-full bg-white/20 px-1.5 py-0.5 text-[8px] text-white @[280px]:px-2 @[280px]:text-[9px]"
								>
									+{organization.categories.length - 2}
								</span>
							{/if}
						</div>
					{/if}

					<!-- Member Count -->
					{#if organization.memberCount !== null && organization.memberCount !== undefined}
						<div
							class="hidden items-center gap-1 text-[9px] text-white/90 @[200px]:flex @[280px]:text-[10px]"
						>
							<Users class="size-2.5 @[280px]:size-3" />
							<span>{organization.memberCount} members</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
