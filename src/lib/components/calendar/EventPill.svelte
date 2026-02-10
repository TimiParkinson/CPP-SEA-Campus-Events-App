<!-- src/lib/components/calendar/EventPill.svelte -->
<script lang="ts">
	import type { CalendarEvent } from '$lib/calendar/types';
	import { calendars } from '$lib/calendar/store';
	import { toLocalTimeLabel } from '$lib/calendar/util';

	interface Props {
		ev: CalendarEvent;
		compact?: boolean;
	}
	let { ev, compact = false }: Props = $props();

	const cal = $derived($calendars.find((c) => c.id === ev.calendarId));
	const c = $derived(cal?.color ?? '#3b82f6');
	const s = $derived(new Date(ev.start));
</script>

<div
	class={`select-none rounded-md px-2 py-1 text-xs text-white/90 ${compact ? 'truncate' : ''}`}
	style={`background:${c};`}
>
	{#if ev.allDay}
		<span class="truncate">{ev.title}</span>
	{:else}
		<span class="opacity-90">{toLocalTimeLabel(s)}</span>
		<span class="ml-1 truncate">{ev.title}</span>
	{/if}
</div>
