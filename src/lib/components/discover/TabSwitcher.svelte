<script lang="ts">
	import { onMount } from 'svelte';

	interface Tab {
		value: string;
		label: string;
	}

	interface Props {
		tabs: Tab[];
		selected: string;
		onSelect: (value: string) => void;
	}

	let { tabs, selected, onSelect }: Props = $props();

	let tabRefs = $state<HTMLButtonElement[]>([]);
	let indicatorStyle = $state({ left: '0px', width: '0px' });

	// Calculate the position and width of the sliding indicator
	function updateIndicator() {
		const selectedIndex = tabs.findIndex((tab) => tab.value === selected);
		if (selectedIndex === -1 || !tabRefs[selectedIndex]) return;

		const selectedTab = tabRefs[selectedIndex];
		indicatorStyle = {
			left: `${selectedTab.offsetLeft}px`,
			width: `${selectedTab.offsetWidth}px`
		};
	}

	// Update indicator on mount and when selection changes
	onMount(() => {
		updateIndicator();
	});

	$effect(() => {
		// Trigger update when selected changes
		selected;
		setTimeout(updateIndicator, 0);
	});
</script>

<div class="relative inline-flex rounded-lg bg-card p-1 shadow-xl dark:bg-accent">
	<!-- Sliding background indicator -->
	<div
		class="absolute inset-y-1 rounded-md bg-muted-foreground/20 transition-all duration-300 ease-out dark:bg-muted"
		style="left: {indicatorStyle.left}; width: {indicatorStyle.width};"
	></div>

	<!-- Tab buttons -->
	{#each tabs as tab, i}
		<button
			bind:this={tabRefs[i]}
			type="button"
			onclick={() => onSelect(tab.value)}
			class="relative z-10 cursor-pointer rounded-md p-2 px-5 text-sm font-semibold transition-colors duration-200 sm:text-base
			{selected !== tab.value && 'text-muted-foreground hover:text-foreground'}"
		>
			{tab.label}
		</button>
	{/each}
</div>
