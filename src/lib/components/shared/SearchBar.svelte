<script lang="ts">
	import { Search, X, SlidersHorizontal } from '@lucide/svelte';

	interface Props {
		value?: string;
		placeholder?: string;
		onInput?: (value: string) => void;
		onClear?: () => void;
		onFilterClick?: () => void;
		showFilters?: boolean;
		autofocus?: boolean;
		activeFiltersCount?: number;
		size?: 'default' | 'compact';
	}

	let {
		value = $bindable(''),
		placeholder = 'Search events and organizations...',
		onInput,
		onClear,
		onFilterClick,
		showFilters = true,
		autofocus = false,
		activeFiltersCount = 0,
		size = 'default'
	}: Props = $props();

	const isCompact = $derived(size === 'compact');

	let inputElement = $state<HTMLInputElement | null>(null);

	$effect(() => {
		if (autofocus && inputElement) {
			inputElement.focus();
		}
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		onInput?.(value);
	}

	function handleClear() {
		value = '';
		onClear?.();
		inputElement?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClear();
		}
	}
</script>

<div class="relative w-full">
	<div class="relative flex items-center">
		<!-- Search Icon -->
		<Search
			class="pointer-events-none absolute size-5 text-gray-400 left-4 z-1"
		/>

		<!-- Input -->
		<input
			bind:this={inputElement}
			type="text"
			{value}
			oninput={handleInput}
			onkeydown={handleKeydown}
			{placeholder}
			class="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 backdrop-blur-xl transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none {isCompact
				? 'h-10 py-2 pr-10 pl-12 text-sm'
				: 'h-12 py-3 pr-20 pl-12 text-base sm:pr-28 sm:pl-12 sm:text-sm'}"
		/>

		<!-- Right Side Actions -->
		<div class="absolute flex items-center gap-1 {isCompact ? 'right-2' : 'right-2'}">
			<!-- Clear Button -->
			{#if value}
				<button
					type="button"
					onclick={handleClear}
					class="flex cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-white {isCompact
						? 'size-6'
						: 'size-8'}"
					aria-label="Clear search"
				>
					<X class="size-4" />
				</button>
			{/if}

			<!-- Filter Button -->
			{#if showFilters}
				<button
					type="button"
					onclick={onFilterClick}
					class="relative flex cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-white {isCompact
						? 'size-6'
						: 'size-8'}"
					aria-label="Open filters"
				>
					<SlidersHorizontal class="size-4" />
					{#if activeFiltersCount > 0}
						<span
							class="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white"
						>
							{activeFiltersCount}
						</span>
					{/if}
				</button>
			{/if}
		</div>
	</div>
</div>
