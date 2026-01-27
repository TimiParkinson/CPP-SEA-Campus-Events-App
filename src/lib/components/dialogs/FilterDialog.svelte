<script lang="ts">
	import { Calendar, Tag, Layers } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	interface Props {
		open?: boolean;
		selectedView?: 'all' | 'events' | 'organizations';
		selectedTimeFilter?: 'all' | 'upcoming' | 'past' | 'thisMonth';
		allTags?: Array<{ name: string; color: string }>;
		allCategories?: Array<{ name: string; color: string }>;
		selectedTags?: string[];
		selectedCategories?: string[];
		tagFilterMode?: 'any' | 'all';
		onViewChange?: (view: 'all' | 'events' | 'organizations') => void;
		onTimeFilterChange?: (filter: 'all' | 'upcoming' | 'past' | 'thisMonth') => void;
		onTagToggle?: (tag: string) => void;
		onCategoryToggle?: (category: string) => void;
		onTagModeChange?: (mode: 'any' | 'all') => void;
		onReset?: () => void;
	}

	let {
		open = $bindable(false),
		selectedView = $bindable('all'),
		selectedTimeFilter = $bindable('all'),
		allTags = [],
		allCategories = [],
		selectedTags = $bindable([]),
		selectedCategories = $bindable([]),
		tagFilterMode = $bindable('any'),
		onViewChange,
		onTimeFilterChange,
		onTagToggle,
		onCategoryToggle,
		onTagModeChange,
		onReset
	}: Props = $props();

	const viewOptions = [
		{ value: 'all', label: 'All', icon: Layers },
		{ value: 'events', label: 'Events', icon: Calendar },
		{ value: 'organizations', label: 'Organizations', icon: Tag }
	] as const;

	const timeFilters = [
		{ value: 'all', label: 'All Time' },
		{ value: 'upcoming', label: 'Upcoming' },
		{ value: 'thisMonth', label: 'This Month' },
		{ value: 'past', label: 'Past' }
	] as const;

	function handleReset() {
		onReset?.();
		open = false;
	}

	function handleApply() {
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="max-h-[90vh] w-[calc(100vw-4rem)] max-w-md gap-0 overflow-hidden p-0 sm:w-full"
	>
		<!-- Header -->
		<div class="px-6 py-4">
			<Dialog.Title class="text-xl font-bold">Filters</Dialog.Title>
			<Dialog.Description class="mt-1 text-sm">Refine your search results</Dialog.Description>
		</div>

		<!-- Content -->
		<div class="max-h-[60vh] overflow-y-auto px-6 py-4">
			<!-- View Type -->
			<div class="mb-6">
				<h3 class="mb-3 text-sm font-semibold">View</h3>
				<div class="grid grid-cols-3 gap-2">
					{#each viewOptions as option}
						{@const Icon = option.icon}
						<button
							type="button"
							onclick={() => onViewChange?.(option.value)}
							class="flex cursor-pointer flex-col items-center gap-2 rounded-lg border px-3 py-3 text-center transition-all
							{selectedView === option.value
								? 'bg-secondary font-semibold text-accent'
								: 'bg-card text-secondary/50 hover:bg-secondary/50'}"
						>
							<Icon class="size-5" />
							<span class="text-xs font-medium">{option.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Time Filter (Only for Events) -->
			{#if selectedView === 'events' || selectedView === 'all'}
				<div class="mb-6">
					<h3 class="mb-3 text-sm font-semibold">Time</h3>
					<div class="grid grid-cols-2 gap-2">
						{#each timeFilters as filter}
							<button
								type="button"
								onclick={() => onTimeFilterChange?.(filter.value)}
								class="cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition-all
								{selectedTimeFilter === filter.value
									? 'bg-secondary font-semibold text-accent'
									: 'bg-card text-secondary/50 hover:bg-secondary/50'}"
							>
								{filter.label}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Tags (Only for Events) -->
			{#if (selectedView === 'events' || selectedView === 'all') && allTags.length > 0}
				<div class="mb-6">
					<div class="mb-3 flex items-center justify-between">
						<h3 class="text-sm font-semibold">Tags</h3>
						<div class="flex gap-1 rounded-lg border bg-card p-1">
							<button
								type="button"
								onclick={() => onTagModeChange?.('any')}
								class="cursor-pointer rounded px-2 py-1 text-xs transition-all
								{tagFilterMode === 'any'
									? 'bg-secondary font-semibold text-accent'
									: 'bg-card text-secondary/50 hover:bg-secondary/50'}"
							>
								Any
							</button>
							<button
								type="button"
								onclick={() => onTagModeChange?.('all')}
								class="cursor-pointer rounded px-2 py-1 text-xs transition-all
								{tagFilterMode === 'all'
									? 'bg-secondary font-semibold text-card-foreground'
									: 'bg-card text-card-foreground/50 hover:bg-secondary/50'}"
							>
								All
							</button>
						</div>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each allTags as tag}
							<button
								type="button"
								onclick={() => onTagToggle?.(tag.name)}
								class="cursor-pointer transition-all"
							>
								<Badge
									variant="secondary"
									class="transition-all {selectedTags.includes(tag.name)
										? 'ring-2'
										: 'opacity-60 hover:opacity-100'}"
									style="background-color: {tag.color}20; border: 1px solid {tag.color}; color: {tag.color};"
								>
									{tag.name}
								</Badge>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Categories (Only for Organizations) -->
			{#if (selectedView === 'organizations' || selectedView === 'all') && allCategories.length > 0}
				<div class="mb-6">
					<h3 class="mb-3 text-sm font-semibold">Categories</h3>
					<div class="flex flex-wrap gap-2">
						{#each allCategories as category}
							<button
								type="button"
								onclick={() => onCategoryToggle?.(category.name)}
								class="cursor-pointer transition-all"
							>
								<Badge
									variant="secondary"
									class="transition-all {selectedCategories.includes(category.name)
										? 'ring-2'
										: 'opacity-60 hover:opacity-100'}"
									style="background-color: {category.color}20; border: 1px solid {category.color}; color: {category.color};"
								>
									{category.name}
								</Badge>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="flex items-center justify-center gap-3 border-t px-6 py-4">
			<Button onclick={handleApply} class="flex-1 font-semibold text-card-foreground"
				>Apply Filters</Button
			>
			<Button
				variant="outline"
				onclick={handleReset}
				class="flex-1 text-current hover:text-secondary-foreground"
			>
				Reset All
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
