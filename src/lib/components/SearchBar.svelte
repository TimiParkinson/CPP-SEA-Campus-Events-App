<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Search } from '@lucide/svelte';

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
</InputGroup.Root>
