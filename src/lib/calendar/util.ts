// src/lib/calendar/util.ts
export function nanoid(size = 10) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let out = '';
	for (let i = 0; i < size; i++) out += chars[Math.floor(Math.random() * chars.length)];
	return out;
}

export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

export function pad2(n: number) {
	return String(n).padStart(2, '0');
}

export function startOfDay(d: Date) {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}

export function endOfDay(d: Date) {
	const x = new Date(d);
	x.setHours(23, 59, 59, 999);
	return x;
}

export function addMinutes(d: Date, mins: number) {
	const x = new Date(d);
	x.setMinutes(x.getMinutes() + mins);
	return x;
}

export function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function toLocalTimeLabel(d: Date) {
	let h = d.getHours();
	const m = d.getMinutes();
	const ap = h >= 12 ? 'PM' : 'AM';
	h = h % 12;
	if (h === 0) h = 12;
	return `${h}:${pad2(m)} ${ap}`;
}

export function hexToRgba(hex: string, alpha: number) {
	const h = hex.replace('#', '');
	const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
	const r = parseInt(v.slice(0, 2), 16);
	const g = parseInt(v.slice(2, 4), 16);
	const b = parseInt(v.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
