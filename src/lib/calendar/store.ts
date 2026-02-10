// src/lib/calendar/store.ts
import { writable, derived, get } from 'svelte/store';
import type { Calendar, CalendarEvent } from './types';
import { nanoid } from './util';

const seedCalendars: Calendar[] = [
	{ id: 'campus', name: 'CPP SEA Campus Events', color: '#3b82f6', enabled: true, source: 'campus' },
	{ id: 'local', name: 'Personal', color: '#22c55e', enabled: true, source: 'local' }
];

const now = new Date();
const iso = (d: Date) => d.toISOString();

const seedEvents: CalendarEvent[] = [
	{
		id: nanoid(),
		calendarId: 'campus',
		title: 'CPP SEA Campus Events (demo)',
		start: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0)),
		end: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0)),
		allDay: false,
		source: 'campus'
	},
	{
		id: nanoid(),
		calendarId: 'local',
		title: 'Dental Appointment',
		start: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 45)),
		end: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 12, 15)),
		allDay: false,
		source: 'local'
	}
];

export const calendars = writable<Calendar[]>(seedCalendars);
export const events = writable<CalendarEvent[]>(seedEvents);

export const selectedDate = writable<Date>(new Date());
export const selectedEventId = writable<string | null>(null);

export const enabledCalendarIds = derived(calendars, ($cals) =>
	new Set($cals.filter((c) => c.enabled).map((c) => c.id))
);

export const visibleEvents = derived([events, enabledCalendarIds], ([$events, $enabled]) =>
	$events.filter((e) => $enabled.has(e.calendarId))
);

export const selectedEvent = derived([events, selectedEventId], ([$events, $id]) =>
	$id ? $events.find((e) => e.id === $id) ?? null : null
);

export function toggleCalendar(id: string) {
	calendars.update((cs) => cs.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
}

export function upsertEvent(partial: Omit<CalendarEvent, 'id'> & { id?: string }) {
	const id = partial.id ?? nanoid();
	events.update((es) => {
		const idx = es.findIndex((e) => e.id === id);
		const next = { ...partial, id } as CalendarEvent;
		if (idx === -1) return [next, ...es];
		const copy = es.slice();
		copy[idx] = next;
		return copy;
	});
	return id;
}

export function deleteEvent(id: string) {
	events.update((es) => es.filter((e) => e.id !== id));
	if (get(selectedEventId) === id) selectedEventId.set(null);
}
