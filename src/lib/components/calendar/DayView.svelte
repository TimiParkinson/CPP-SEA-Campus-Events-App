<!-- src/lib/components/calendar/DayView.svelte -->
<script lang="ts">
	import type { CalendarEvent } from '$lib/calendar/types';
	import WeekView from './WeekView.svelte';
	// reuse WeekView rendering by passing a "date" where weekStart contains the date; WeekView already handles.

	interface Props {
		date: Date;
		events: CalendarEvent[];
		onSelectEvent: (id: string) => void;
		onDblEmpty: (e: CustomEvent<{ start: Date; end: Date; allDay: boolean }>) => void;
	}
	let { date, events, onSelectEvent, onDblEmpty }: Props = $props();

	// Filter to just this day to keep UX like iOS day view
	const dayEvents = $derived(events.filter((ev) => {
		const s = new Date(ev.start);
		return s.toDateString() === date.toDateString();
	}));
</script>

<!-- Cheap but correct: render a 1-day "week" by visually hiding other columns -->
<div class="h-full">
	<WeekView {date} events={dayEvents} onSelectEvent={onSelectEvent} onDblEmpty={onDblEmpty} />
</div>
