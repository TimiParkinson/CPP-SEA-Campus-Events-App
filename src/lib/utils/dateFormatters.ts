/**
 * Date and time formatting utilities
 * Centralized formatting functions for consistent display
 */

/**
 * Format a date to show month and day (e.g., "Nov 10")
 */
export function formatDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric'
	}).format(d);
}

/**
 * Format a date to show full date (e.g., "Monday, Nov 10, 2025")
 */
export function formatFullDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(d);
}

/**
 * Format time to show hours and minutes (e.g., "2:00 PM")
 */
export function formatTime(dateTime: string | Date): string {
	const d = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	}).format(d);
}

/**
 * Format time range (e.g., "2:00 PM - 4:00 PM")
 */
export function formatTimeRange(startTime: string | Date, endTime: string | Date): string {
	return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Get day of month as number (e.g., 10)
 */
export function getDayOfMonth(date: string | Date): number {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.getDate();
}

/**
 * Get month abbreviation (e.g., "NOV")
 */
export function getMonthAbbr(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d).toUpperCase();
}

/**
 * Format date range (e.g., "Monday, Nov 3, 2025 - Friday, Nov 7, 2025")
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
	const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
	const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

	// Check if same day
	if (
		start.getDate() === end.getDate() &&
		start.getMonth() === end.getMonth() &&
		start.getFullYear() === end.getFullYear()
	) {
		return formatFullDate(start);
	}

	return `${formatFullDate(start)} - ${formatFullDate(end)}`;
}

/**
 * Check if event spans multiple days
 */
export function isMultiDayEvent(startDate: string | Date, endDate: string | Date): boolean {
	const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
	const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

	return !(
		start.getDate() === end.getDate() &&
		start.getMonth() === end.getMonth() &&
		start.getFullYear() === end.getFullYear()
	);
}
