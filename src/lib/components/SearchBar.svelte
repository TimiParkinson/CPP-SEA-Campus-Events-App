<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Search, X } from '@lucide/svelte';

	interface Props {
		value: string;
		onInput: (value: string) => void;
		placeholder?: string;
	}

	let { value, onInput, placeholder = 'Search here...' }: Props = $props();
</script>

<InputGroup.Root>
	<InputGroup.Input {placeholder} {value} oninput={(e) => onInput(e.currentTarget.value)} />
	<InputGroup.Addon>
		<Search />
	</InputGroup.Addon>
	{#if value}
		<InputGroup.Addon align="inline-end">
			<button
				onclick={() => onInput('')}
				class="cursor-pointer rounded p-0.5 transition-colors hover:bg-accent"
				aria-label="Clear search"><X size={20} /></button
			>
		</InputGroup.Addon>
	{/if}
</InputGroup.Root>
