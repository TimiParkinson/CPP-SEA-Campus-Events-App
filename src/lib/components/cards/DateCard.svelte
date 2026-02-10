<script lang="ts">   
	interface Props {
		date: Date;
		variant?: 'week' | 'month' | 'day';
		onclick?: () => void;
	}

	let { date, variant = 'week', onclick }: Props = $props();

    const day = $derived(variant === 'day');
    const week = $derived(variant === 'week');
    const month = $derived(variant === 'month');

	// Font size calculation
	const circleFontSize = $derived(() => {
		const length = date.toDateString().length;
		if (week || month) {
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
</script>

<div class="@container">
	{#if month}
		<!-- Featured -->
		<button
			type="button"
			{onclick}
			title={date.toDateString()}
			class="group relative aspect-square w-full cursor-pointer shadow-2xl overflow-hidden rounded-full transition-all hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
		>
		</button>
	{:else if week}
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
			class="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-card shadow-2xl transition-all hover:scale-[1.02] hover:shadow-xl focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
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
					</div>
				</div>
			</div>
		</div>
    {:else if day}
        <div> </div>
    {/if}
</div>
