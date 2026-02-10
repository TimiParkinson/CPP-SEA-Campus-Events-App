// src/lib/calendar/types.ts
export type CalendarSource = 'local' | 'ics' | 'google' | 'microsoft' | 'campus';

export type Calendar = {
	id: string;
	name: string;
	color: string; // hex
	enabled: boolean;
	source: CalendarSource;
};

export type CalendarEvent = {
	id: string;
	calendarId: string;

	title: string;
	description?: string;
	location?: string;

	start: string; // ISO
	end: string; // ISO
	allDay: boolean;

	uid?: string; // ICS UID
	recurrenceRule?: string; // RRULE
	lastModified?: string;

	source: CalendarSource;
	raw?: unknown;
};

export type ViewMode = 'day' | 'week' | 'month';

export type CreateDraft = {
	start: Date;
	end: Date;
	allDay: boolean;
};
