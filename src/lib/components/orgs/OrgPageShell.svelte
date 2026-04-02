<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowLeft, Users } from '@lucide/svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';
	import type { Organization } from '$lib/types/index.js';

	interface Props {
		org: Organization;
		topRight?: Snippet;
		actions?: Snippet;
		children: Snippet;
	}

	let { org, topRight, actions, children }: Props = $props();

	let gradient = $derived(getRandomGradient(org.id));

	function handleBack() {
		window.history.back();
	}
</script>

<div class="min-h-screen">
	<!-- Banner -->
	<div class="relative h-64 overflow-hidden sm:h-80 md:h-96">
		<!-- Background Image/Gradient -->
		{#if org.bannerImageUrl}
			<img src={org.bannerImageUrl} alt={org.name} class="size-full object-cover object-center" />
		{:else}
			<div class="size-full" style="background: {gradient};"></div>
		{/if}

		<!-- Dark overlay -->
		<div class="absolute inset-0 bg-linear-to-t from-black/30 to-black/10"></div>

		<!-- Back Button -->
		<div class="absolute top-4 left-4 sm:top-6 sm:left-6">
			<button
				type="button"
				onclick={handleBack}
				class="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-white/90 hover:text-black sm:size-12"
				aria-label="Go back"
			>
				<ArrowLeft class="size-5 sm:size-6" />
			</button>
		</div>

		<!-- Top right slot (e.g. member count badge) -->
		{#if topRight}
			<div class="absolute top-4 right-4 sm:top-6 sm:right-6">
				{@render topRight()}
			</div>
		{/if}
	</div>

	<!-- Logo & CTAs -->
	<div class="relative px-4 sm:px-6 lg:px-8">
		<div class="container mx-auto max-w-4xl">
			<div class="shift-content-up | flex items-center justify-between gap-3 sm:gap-4">
				<!-- Logo -->
				<div class="relative">
					{#if org.logoUrl}
						<img
							src={org.logoUrl}
							alt={org.name}
							class="rounded-full object-cover shadow-lg"
							style="width: 120px; height: 120px;"
						/>
					{:else}
						<div
							class="overflow-hidden rounded-full shadow-lg"
							style="width: 96px; height: 96px; background: {gradient};"
						>
							<div class="flex size-full items-center justify-center">
								<span
									class="text-center text-2xl leading-none font-bold tracking-tight whitespace-nowrap text-white select-none"
								>
									{org.abbreviation || generateAbbreviation(org.name)}
								</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- Actions slot (e.g. bookmark + join, or edit controls) -->
				{#if actions}
					<div class="flex shrink-0 items-center gap-2 sm:gap-3">
						{@render actions()}
					</div>
				{/if}
			</div>
		</div>
	</div>

	{@render children()}
</div>

<style>
	.shift-content-up {
		transform: translateY(-50px);
	}
</style>
