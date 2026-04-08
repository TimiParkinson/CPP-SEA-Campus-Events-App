<!-- src/lib/components/calendar/CalendarShell.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { calendars, selectedDate, visibleEvents, selectedEventId, selectedEvent } from '$lib/calendar/store';
	import type { ViewMode, CreateDraft } from '$lib/calendar/types';
	import Sidebar from './Sidebar.svelte';
	import Inspector from './Inspector.svelte';
	import MonthView from './MonthView.svelte';
	import WeekView from './WeekView.svelte';
	import DayView from './DayView.svelte';
	import EventModal from './EventModal.svelte';
	import { addMinutes, startOfDay } from '$lib/calendar/util';

	interface Props {
		view: ViewMode;
	}
	let { view }: Props = $props();

	let showModal = $state(false);
	let draft = $state<CreateDraft | null>(null);

	function openCreate(start: Date, end: Date, allDay = false) {
		draft = { start, end, allDay };
		showModal = true;
		selectedEventId.set(null);
	}

	function onDoubleClickSlot(e: CustomEvent<{ start: Date; end: Date; allDay: boolean }>) {
		openCreate(e.detail.start, e.detail.end, e.detail.allDay);
	}

	function goToday() {
		selectedDate.set(new Date());
	}

	function step(dir: -1 | 1) {
		const d = $selectedDate;
		const next = new Date(d);
		if (view === 'month') next.setMonth(d.getMonth() + dir);
		else if (view === 'week') next.setDate(d.getDate() + dir * 7);
		else next.setDate(d.getDate() + dir);
		selectedDate.set(next);
	}

	// small keyboard niceness
	onMount(() => {
		const onKey = (ev: KeyboardEvent) => {
			if (ev.key === 't') goToday();
			if (ev.key === 'ArrowLeft') step(-1);
			if (ev.key === 'ArrowRight') step(1);
			if (ev.key === 'Escape') showModal = false;
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<div class="rounded-2xl border border-white/10 bg-zinc-950/30 backdrop-blur">
	<div class="flex h-[72vh] min-h-[560px] overflow-hidden rounded-2xl">
		<Sidebar />

		<div class="flex min-w-0 flex-1 flex-col">
			<div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
				<div class="flex items-center gap-2">
					<button
						class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10"
						onclick={() => step(-1)}
						aria-label="Previous"
					>
						‹
					</button>
					<button
						class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10"
						onclick={() => step(1)}
						aria-label="Next"
					>
						›
					</button>
					<button
						class="ml-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm hover:bg-white/10"
						onclick={goToday}
					>
						Today
					</button>
				</div>

				<div class="text-sm text-white/70">
					{$selectedDate.toLocaleString(undefined, {
						month: 'long',
						year: 'numeric'
					})}
				</div>

				<div class="w-[100px]" />
			</div>

			<div class="min-h-0 flex-1">
				{#if view === 'month'}
					<MonthView
						date={$selectedDate}
						events={$visibleEvents}
						onSelectDate={(d) => selectedDate.set(d)}
						onSelectEvent={(id) => selectedEventId.set(id)}
						onDblEmpty={onDoubleClickSlot}
					/>
				{:else if view === 'week'}
					<WeekView
						date={$selectedDate}
						events={$visibleEvents}
						onSelectEvent={(id) => selectedEventId.set(id)}
						onDblEmpty={onDoubleClickSlot}
					/>
				{:else}
					<DayView
						date={$selectedDate}
						events={$visibleEvents}
						onSelectEvent={(id) => selectedEventId.set(id)}
						onDblEmpty={onDoubleClickSlot}
					/>
				{/if}
			</div>
		</div>

		<Inspector
			events={$visibleEvents}
			selected={$selectedEvent}
			onCreate={() => openCreate(startOfDay($selectedDate), addMinutes(startOfDay($selectedDate), 60), false)}
			onEdit={() => {
				if (!$selectedEvent) return;
				draft = { start: new Date($selectedEvent.start), end: new Date($selectedEvent.end), allDay: $selectedEvent.allDay };
				showModal = true;
			}}
		/>
	</div>

	{#if showModal && draft}
		<EventModal
			draft={draft}
			selected={$selectedEvent}
			events={$visibleEvents}
			onClose={() => (showModal = false)}
		/>
	{/if}
</div>
