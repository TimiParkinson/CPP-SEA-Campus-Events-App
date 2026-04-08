<!-- src/lib/components/calendar/MonthView.svelte -->
<script lang="ts">
	import type { CalendarEvent } from '$lib/calendar/types';
	import EventPill from './EventPill.svelte';
	import { startOfDay, isSameDay } from '$lib/calendar/util';

	interface Props {
		date: Date;
		events: CalendarEvent[];
		onSelectDate: (d: Date) => void;
		onSelectEvent: (id: string) => void;
		onDblEmpty: (e: CustomEvent<{ start: Date; end: Date; allDay: boolean }>) => void;
	}
	let { date, events, onSelectDate, onSelectEvent, onDblEmpty }: Props = $props();

	const weekStartsOn = 0; // Sunday

	function monthGrid(anchor: Date) {
		const y = anchor.getFullYear();
		const m = anchor.getMonth();
		const first = new Date(y, m, 1);
		const firstDow = (first.getDay() - weekStartsOn + 7) % 7;
		const start = new Date(y, m, 1 - firstDow);
		const cells: Date[] = [];
		for (let i = 0; i < 42; i++) cells.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
		return cells;
	}

	const cells = $derived(monthGrid(date));

	function eventsForDay(d: Date) {
		const sd = startOfDay(d).getTime();
		const ed = sd + 24 * 60 * 60 * 1000;
		return events
			.filter((e) => {
				const s = new Date(e.start).getTime();
				const en = new Date(e.end).getTime();
				return !(en <= sd || s >= ed);
			})
			.sort((a, b) => +new Date(a.start) - +new Date(b.start));
	}

	function dblCreate(d: Date) {
		const start = new Date(d);
		start.setHours(9, 0, 0, 0);
		const end = new Date(d);
		end.setHours(10, 0, 0, 0);
		onDblEmpty(new CustomEvent('dbl', { detail: { start, end, allDay: false } }));
	}
</script>

<div class="h-full">
	<div class="grid grid-cols-7 border-b border-white/10 text-xs text-white/40">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as d}
			<div class="px-3 py-2">{d}</div>
		{/each}
	</div>

	<div class="grid h-[calc(100%-34px)] grid-cols-7 grid-rows-6">
		{#each cells as d (d.toISOString())}
			{@const inMonth = d.getMonth() === date.getMonth()}
			{@const extra = Math.max(0, eventsForDay(d).length - 3)}
			<div
				class={`min-h-0 border-r border-b border-white/10 p-2 ${inMonth ? '' : 'bg-white/[0.02]'}`}
				onclick={() => onSelectDate(d)}
				ondblclick={() => dblCreate(d)}
			>
				<div class="mb-1 flex items-center justify-between">
					<div class={`text-xs ${inMonth ? 'text-white/75' : 'text-white/25'}`}>
						{d.getDate()}
					</div>
					{#if isSameDay(d, new Date())}
						<div class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">Today</div>
					{/if}
				</div>

				<div class="space-y-1">
					{#each eventsForDay(d).slice(0, 3) as ev (ev.id)}
						<div onclick={(e) => (e.stopPropagation(), onSelectEvent(ev.id))}>
							<EventPill ev={ev} compact />
						</div>
					{/each}

					{#if extra > 0}
						<div class="text-[10px] text-white/35">+{extra} more</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
