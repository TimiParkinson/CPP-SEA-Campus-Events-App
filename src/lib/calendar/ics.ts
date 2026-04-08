// src/lib/calendar/ics.ts  (basic ICS import/export that works for common files)
import type { CalendarEvent } from './types';
import { nanoid } from './util';

function unfoldLines(text: string) {
	// RFC line folding: lines that start with space/tab continue previous line
	const raw = text.replace(/\r\n/g, '\n').split('\n');
	const out: string[] = [];
	for (const line of raw) {
		if (/^[ \t]/.test(line) && out.length) out[out.length - 1] += line.slice(1);
		else out.push(line);
	}
	return out;
}

function parseICalDate(value: string) {
	// Handles: YYYYMMDD (all-day), YYYYMMDDTHHMMSSZ, YYYYMMDDTHHMMSS
	if (/^\d{8}$/.test(value)) {
		const y = +value.slice(0, 4);
		const m = +value.slice(4, 6) - 1;
		const d = +value.slice(6, 8);
		return { date: new Date(y, m, d, 0, 0, 0, 0), allDay: true };
	}
	const z = value.endsWith('Z');
	const core = z ? value.slice(0, -1) : value;
	const y = +core.slice(0, 4);
	const m = +core.slice(4, 6) - 1;
	const d = +core.slice(6, 8);
	const hh = +core.slice(9, 11);
	const mm = +core.slice(11, 13);
	const ss = +core.slice(13, 15);
	const dt = z ? new Date(Date.UTC(y, m, d, hh, mm, ss)) : new Date(y, m, d, hh, mm, ss);
	return { date: dt, allDay: false };
}

export function importICS(icsText: string, calendarId: string): CalendarEvent[] {
	const lines = unfoldLines(icsText);
	const events: CalendarEvent[] = [];
	let inEvent = false;
	let cur: Record<string, string> = {};

	for (const line of lines) {
		if (line === 'BEGIN:VEVENT') {
			inEvent = true;
			cur = {};
			continue;
		}
		if (line === 'END:VEVENT') {
			inEvent = false;

			const dtStart = cur['DTSTART'];
			const dtEnd = cur['DTEND'];
			if (!dtStart || !dtEnd) continue;

			const s = parseICalDate(dtStart);
			const e = parseICalDate(dtEnd);

			events.push({
				id: nanoid(),
				calendarId,
				title: cur['SUMMARY'] ?? '(No title)',
				description: cur['DESCRIPTION'],
				location: cur['LOCATION'],
				start: s.date.toISOString(),
				end: e.date.toISOString(),
				allDay: s.allDay || e.allDay,
				uid: cur['UID'],
				recurrenceRule: cur['RRULE'],
				lastModified: cur['LAST-MODIFIED'] ? parseICalDate(cur['LAST-MODIFIED']).date.toISOString() : undefined,
				source: 'ics',
				raw: cur
			});
			continue;
		}

		if (!inEvent) continue;
		const idx = line.indexOf(':');
		if (idx === -1) continue;

		const left = line.slice(0, idx);
		const value = line.slice(idx + 1);

		// Strip params: DTSTART;TZID=... -> DTSTART
		const key = left.split(';')[0].toUpperCase();
		cur[key] = value;
	}

	return events;
}

function icsEscape(s: string) {
	return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function formatICSDate(date: Date, allDay: boolean) {
	if (allDay) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}${m}${d}`;
	}
	// Use UTC Z
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, '0');
	const d = String(date.getUTCDate()).padStart(2, '0');
	const hh = String(date.getUTCHours()).padStart(2, '0');
	const mm = String(date.getUTCMinutes()).padStart(2, '0');
	const ss = String(date.getUTCSeconds()).padStart(2, '0');
	return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}

export function exportICS(calendarName: string, evs: CalendarEvent[]) {
	const now = new Date();
	const dtstamp = formatICSDate(now, false);

	const body: string[] = [];
	body.push('BEGIN:VCALENDAR');
	body.push('VERSION:2.0');
	body.push('PRODID:-//CPP SEA//Campus Events//EN');
	body.push('CALSCALE:GREGORIAN');
	body.push(`X-WR-CALNAME:${icsEscape(calendarName)}`);

	for (const e of evs) {
		const uid = e.uid ?? `${e.id}@cppsea.local`;
		const start = new Date(e.start);
		const end = new Date(e.end);

		body.push('BEGIN:VEVENT');
		body.push(`UID:${icsEscape(uid)}`);
		body.push(`DTSTAMP:${dtstamp}`);

		if (e.allDay) {
			body.push(`DTSTART;VALUE=DATE:${formatICSDate(start, true)}`);
			body.push(`DTEND;VALUE=DATE:${formatICSDate(end, true)}`);
		} else {
			body.push(`DTSTART:${formatICSDate(start, false)}`);
			body.push(`DTEND:${formatICSDate(end, false)}`);
		}

		body.push(`SUMMARY:${icsEscape(e.title)}`);
		if (e.description) body.push(`DESCRIPTION:${icsEscape(e.description)}`);
		if (e.location) body.push(`LOCATION:${icsEscape(e.location)}`);
		if (e.recurrenceRule) body.push(`RRULE:${e.recurrenceRule}`);

		body.push('END:VEVENT');
	}

	body.push('END:VCALENDAR');
	return body.join('\r\n');
}
