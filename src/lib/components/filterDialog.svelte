<script lang="ts">
	import { Building2, Calendar } from '@lucide/svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		open?: boolean;
		selectedView?: 'events' | 'organizations';
		selectedFilter?: 'all' | 'upcoming' | 'past' | 'thisMonth';
		allTags?: string[];
		selectedTags?: string[];
		filterMode?: 'inclusive' | 'exclusive';
	}

	let {
		open = $bindable(false),
		selectedView = $bindable('events'),
		selectedFilter = $bindable('all'),
		allTags = [],
		selectedTags = $bindable([]),
		filterMode = $bindable('inclusive')
	}: Props = $props();

	// Handle keyboard shortcut
	$effect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				open = !open;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});

	function handleViewChange(view: 'events' | 'organizations') {
		selectedView = view;
		open = false;
	}

	function handleFilterChange(filter: 'all' | 'upcoming' | 'past' | 'thisMonth') {
		selectedFilter = filter;
		open = false;
	}

	function handleTagToggle(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="p-0" style="max-width: 600px; max-height: 800px; width: 100%; height: 100%;">
		<Command.Root class="w-full rounded-lg border-0 shadow-none">
			<Command.Input placeholder="Type a command or searchl.." class="border-0 focus:ring-0" />
			<Command.List style="max-width: 600px; max-height: 800px; width: 100%; height: 100%;">
				<Command.Empty>No results found.</Command.Empty>

				<Command.Group heading="View">
					<Command.Item onSelect={() => handleViewChange('events')} class="cursor-pointer">
						<Calendar class="mr-2 h-4 w-4" />
						<span>Events</span>
						{#if selectedView === 'events'}
							<Command.Shortcut>✓</Command.Shortcut>
						{/if}
					</Command.Item>
					<Command.Item onSelect={() => handleViewChange('organizations')} class="cursor-pointer">
						<Building2 class="mr-2 h-4 w-4" />
						<span>Organizations</span>
						{#if selectedView === 'organizations'}
							<Command.Shortcut>✓</Command.Shortcut>
						{/if}
					</Command.Item>
				</Command.Group>

				<Command.Separator />

				<Command.Group heading="Quick Filters">
					<Command.Item onSelect={() => handleFilterChange('upcoming')} class="cursor-pointer">
						<span>Upcoming Only</span>
						{#if selectedFilter === 'upcoming'}
							<Command.Shortcut>✓</Command.Shortcut>
						{/if}
					</Command.Item>
					<Command.Item onSelect={() => handleFilterChange('past')} class="cursor-pointer">
						<span>Past Events</span>
						{#if selectedFilter === 'past'}
							<Command.Shortcut>✓</Command.Shortcut>
						{/if}
					</Command.Item>
					<Command.Item onSelect={() => handleFilterChange('thisMonth')} class="cursor-pointer">
						<span>This Month</span>
						{#if selectedFilter === 'thisMonth'}
							<Command.Shortcut>✓</Command.Shortcut>
						{/if}
					</Command.Item>
				</Command.Group>

				{#if allTags.length > 0}
					<Command.Separator />
					<Command.Group heading="Tags">
						<div class="px-2 py-2">
							<div class="mb-3 flex items-center justify-between">
								<span class="text-xs text-muted-foreground">Match:</span>
								<div class="flex gap-1">
									<Button
										variant={filterMode === 'inclusive' ? 'default' : 'outline'}
										size="sm"
										class="h-7 px-2 text-xs"
										onclick={() => (filterMode = 'inclusive')}
									>
										Any
									</Button>
									<Button
										variant={filterMode === 'exclusive' ? 'default' : 'outline'}
										size="sm"
										class="h-7 px-2 text-xs"
										onclick={() => (filterMode = 'exclusive')}
									>
										All
									</Button>
								</div>
							</div>
						</div>
						{#each allTags as tag}
							<Command.Item
								value={tag}
								class="cursor-pointer"
								onSelect={() => handleTagToggle(tag)}
							>
								<div class="flex w-full items-center space-x-2">
									<Switch id={`tag-${tag}`} checked={selectedTags.includes(tag)} />
									<Label for={`tag-${tag}`} class="flex-1 cursor-pointer">{tag}</Label>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Dialog.Content>
</Dialog.Root>
