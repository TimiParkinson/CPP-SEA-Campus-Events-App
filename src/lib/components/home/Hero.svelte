<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Sparkles, Calendar, ChevronDown } from '@lucide/svelte';

	interface Props {
		imageUrl?: string;
		title?: string;
		subtitle?: string;
	}

	let {
		imageUrl = '/images/hero/hero-2.jpg',
		title = 'Explore Cal Poly Pomona',
		subtitle = 'Stay connected with campus events, clubs, and opportunities.'
	}: Props = $props();

	let scrollY = $state(0);
	let imageLoaded = $state(false);

	const fallbackGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
</script>

<svelte:window bind:scrollY />

<section class="relative w-full overflow-hidden">
	<!-- Hero wrapper -->
	<div class="relative h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] xl:h-[800px]">
		<!-- Background Image -->
		<div
			class="absolute inset-0 transition-opacity duration-700"
			style="transform: translateY({scrollY * 0.4}px); opacity: {imageLoaded ? 1 : 0};"
		>
			<img
				src={imageUrl}
				alt="Campus Hero"
				class="size-full object-cover"
				onload={() => (imageLoaded = true)}
				onerror={() => (imageLoaded = false)}
			/>
			<div class="absolute inset-0 bg-black/40"></div>
		</div>

		<!-- Gradient Fallback -->
		{#if !imageLoaded}
			<div
				class="absolute inset-0 transition-opacity duration-700"
				style="background: {fallbackGradient};"
			>
				<div class="absolute inset-0 bg-black/20"></div>
			</div>
		{/if}

		<!-- Content Container -->
		<div class="relative z-10 flex h-full items-center">
			<div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="max-w-4xl">
					<h1
						class="mb-4 text-4xl leading-tight font-black text-white sm:text-5xl md:text-6xl lg:text-7xl lg:whitespace-nowrap"
					>
						{title}
					</h1>

					<p class="mb-8 text-base text-white/90 sm:text-lg md:text-xl lg:max-w-2xl">
						{subtitle}
					</p>

					<div class="flex flex-wrap gap-4">
						<Button
							href="/discover"
							size="lg"
							class="h-12 cursor-pointer gap-2 px-8 text-base sm:h-14 sm:px-10 sm:text-lg"
						>
							<Sparkles class="size-5 sm:size-6" />
							Discover
						</Button>
						<Button
							href="/search"
							size="lg"
							variant="secondary"
							class="h-12 cursor-pointer gap-2 px-8 text-base sm:h-14 sm:px-10 sm:text-lg"
						>
							<Calendar class="size-5 sm:size-6" />
							Browse
						</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Scroll Indicator -->
		<div
			class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-500"
			style="opacity: {scrollY > 100 ? 0 : 1};"
		>
			<ChevronDown class="size-8 text-white/80" />
		</div>
	</div>
</section>
