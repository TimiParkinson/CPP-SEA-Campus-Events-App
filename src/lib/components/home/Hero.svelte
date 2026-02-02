<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Compass, Calendar, ChevronDown } from '@lucide/svelte';

	interface Props {
		imageUrl?: string;
		title?: string;
		subtitle?: string;
	}

	let {
		imageUrl = '/images/hero/hero-1.webp',
		title = 'Explore Cal Poly Pomona',
		subtitle = 'Stay connected with campus events, clubs, and opportunities.'
	}: Props = $props();

	let scrollY = $state(0);
	let imageLoaded = $state(false);

	const fallbackGradient = 'linear-gradient(135deg, #9ebd13 0%, #008552 100%)';
</script>

<svelte:window bind:scrollY />

<section
	class="w-screen overflow-hidden mb-12"
	style="margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%);"
>
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
			<div class="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
		</div>

		<!-- Gradient Fallback -->
		{#if !imageLoaded}
			<div
				class="absolute inset-0 transition-opacity duration-700"
				style="background: {fallbackGradient};"
			>
				<div class="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
			</div>
		{/if}

		<!-- Content Container -->
		<div class="relative z-10 flex h-full items-center">
			<div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="max-w-4xl">
					<h1
						class="mb-4 text-4xl leading-tight font-black text-white sm:text-5xl md:text-6xl lg:text-7xl"
					>
						{title}
					</h1>

					<p class="mb-8 text-base font-semibold text-white/90 sm:text-lg md:text-2xl lg:max-w-2xl">
						{subtitle}
					</p>

					<div class="flex flex-wrap gap-4">
						<Button href="/discover" size="lg" class="sm:h-14 sm:px-10 sm:text-lg">
							<Compass class="size-5 sm:size-6" />
							Discover
						</Button>
						<Button href="/search" size="lg" variant="secondary" class="sm:h-14 sm:px-10 sm:text-lg">
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
			aria-hidden="true"
		>
			<ChevronDown class="size-8 text-white drop-shadow-lg" strokeWidth={2.5} />
		</div>
	</div>
</section>
