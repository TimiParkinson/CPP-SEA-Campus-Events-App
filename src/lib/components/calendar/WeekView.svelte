<!-- src/lib/components/calendar/WeekView.svelte -->
<script lang="ts">
	import type { CalendarEvent } from '$lib/calendar/types';
	import EventPill from './EventPill.svelte';
	import { clamp, startOfDay, addMinutes, toLocalTimeLabel } from '$lib/calendar/util';

	interface Props {
		date: Date;
		events: CalendarEvent[];
		onSelectEvent: (id: string) => void;
		onDblEmpty: (e: CustomEvent<{ start: Date; end: Date; allDay: boolean }>) => void;
	}
	let { date, events, onSelectEvent, onDblEmpty }: Props = $props();

	const pxPerMinute = 1.2; // adjust density
	const hourStart = 3;
	const hourEnd = 24;
	const snap = 15;

	function weekStart(d: Date) {
		const x = startOfDay(d);
		const dow = x.getDay(); // Sunday=0
		x.setDate(x.getDate() - dow);
		return x;
	}

	const start = $derived(weekStart(date));
	const days = $derived(Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)));

	function withinWeek(ev: CalendarEvent) {
		const s = new Date(ev.start).getTime();
		const e = new Date(ev.end).getTime();
		const ws = start.getTime();
		const we = ws + 7 * 24 * 60 * 60 * 1000;
		return !(e <= ws || s >= we);
	}

	const weekEvents = $derived(events.filter(withinWeek).sort((a, b) => +new Date(a.start) - +new Date(b.start)));

	function topPx(dt: Date) {
		const mins = dt.getHours() * 60 + dt.getMinutes();
		const minsFromStart = mins - hourStart * 60;
		return minsFromStart * pxPerMinute;
	}

	function heightPx(s: Date, e: Date) {
		const mins = (e.getTime() - s.getTime()) / 60000;
		return Math.max(18, mins * pxPerMinute);
	}

	let gridEl: HTMLDivElement | null = $state(null);

	function dbl(e: MouseEvent, dayIndex: number) {
		if (!gridEl) return;
		const rect = gridEl.getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const colW = rect.width / 7;
		const col = clamp(Math.floor(x / colW), 0, 6);
		const d = days[col];

		const minsFromTop = y / pxPerMinute + hourStart * 60;
		const snapped = Math.round(minsFromTop / snap) * snap;

		const s = new Date(d);
		s.setHours(0, 0, 0, 0);
		const startDt = addMinutes(s, snapped);
		const endDt = addMinutes(startDt, 60);

		onDblEmpty(new CustomEvent('dbl', { detail: { start: startDt, end: endDt, allDay: false } }));
	}
</script>

<div class="h-full overflow-hidden">
	<div class="grid grid-cols-[64px_repeat(7,1fr)] border-b border-white/10 text-xs text-white/40">
		<div class="px-2 py-2" />
		{#each days as d (d.toDateString())}
			<div class="px-3 py-2">
				<div class="text-white/55">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
				<div class="text-white/80">{d.getDate()}</div>
			</div>
		{/each}
	</div>

	<div class="relative flex h-[calc(100%-42px)] min-h-0">
		<!-- time labels -->
		<div class="w-[64px] shrink-0 border-r border-white/10">
			{#each Array.from({ length: hourEnd - hourStart + 1 }, (_, i) => hourStart + i) as h}
				<div class="relative border-b border-white/10" style={`height:${60 * pxPerMinute}px`}>
					<div class="absolute -top-2 right-2 text-[10px] text-white/35">
						{toLocalTimeLabel(new Date(2000, 0, 1, h, 0))}
					</div>
				</div>
			{/each}
		</div>

		<!-- grid -->
		<div class="relative min-w-0 flex-1">
			<div
				class="absolute inset-0 grid grid-cols-7"
				bind:this={gridEl}
				ondblclick={(e) => dbl(e, 0)}
			>
				{#each days as _ ( _.toDateString() )}
					<div class="border-r border-white/10" />
				{/each}
			</div>

			<!-- horizontal lines -->
			<div class="pointer-events-none absolute inset-0">
				{#each Array.from({ length: (hourEnd - hourStart) }, (_, i) => i) as i}
					<div
						class="border-b border-white/10"
						style={`position:absolute;left:0;right:0;top:${i * 60 * pxPerMinute}px;height:0`}
					/>
				{/each}
			</div>

			<!-- events -->
			<div class="absolute inset-0">
				{#each weekEvents as ev (ev.id)}
					{@const s = new Date(ev.start)}
					{@const e = new Date(ev.end)}
					{@const dayIndex = clamp(Math.floor((startOfDay(s).getTime() - start.getTime()) / (24 * 60 * 60 * 1000)), 0, 6)}
					{@const colLeft = (100 / 7) * dayIndex}
					{@const colW = 100 / 7}

					{#if !ev.allDay}
						<div
							class="absolute px-1"
							style={`left:${colLeft}%;width:${colW}%;top:${topPx(s)}px;height:${heightPx(s, e)}px`}
						>
							<div
								class="h-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
								onclick={() => onSelectEvent(ev.id)}
							>
								<EventPill ev={ev} />
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
