<script lang="ts">
	import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "$lib/components/ui/command";
	import { Check } from "@lucide/svelte";
	import { writable, derived, type Writable } from "svelte/store";

	/**
	 * Reusable FilterDialog
	 * Props:
	 *  - filters: string[]           → List of items to search/select from
	 *  - selected: Writable<string[]>→ External store to manage selection
	 *  - title?: string              → Dialog title (default: "Filter")
	 */
	export let filters: string[] = [];
	export let selected: Writable<string[]> = writable([]);
	export let title: string = "Filter";

	function toggleItem(item: string) {
		selected.update(current =>
			current.includes(item)
				? current.filter(i => i !== item)
				: [...current, item]
		);
	}

	const selectedItems = derived(selected, $s => $s);
</script>

<Dialog>
	<DialogTrigger asChild>
		<Button variant="outline">{title}</Button>
	</DialogTrigger>

	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>{title}</DialogTitle>
		</DialogHeader>

		<Command>
			<CommandInput placeholder="Search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Available">
					{#each filters as item}
						<CommandItem onSelect={() => toggleItem(item)}>
							<div class="flex items-center justify-between w-full">
								<span>{item}</span>
								{#if $selectedItems.includes(item)}
									<Check class="w-4 h-4 text-primary" />
								{/if}
							</div>
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		</Command>

		{#if $selectedItems.length > 0}
			<div class="mt-4">
				<h3 class="text-sm font-medium mb-1">Selected:</h3>
				<div class="flex flex-wrap gap-2">
					{#each $selectedItems as item}
						<Button size="sm" variant="secondary" on:click={() => toggleItem(item)}>
							{item}
							<span class="ml-1 text-muted-foreground">×</span>
						</Button>
					{/each}
				</div>
			</div>
		{/if}
	</DialogContent>
</Dialog>
