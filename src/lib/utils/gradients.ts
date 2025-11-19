/**
 * Gradient utilities for fallback backgrounds.
 * Provides consistent, deterministic gradients based on an ID,
 * meaning the same ID should get the same gradient across
 * page refreshes, different devices, etc.
 */

export const GRADIENTS = [
	'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
	'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
	'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
	'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
	'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
	'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
	'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
	'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
	'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
	'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
	'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
	'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
	'linear-gradient(135deg, #e45a84 0%, #ffb199 100%)',
	'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
	'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'
];

export function getRandomGradient(id: string): string {
	// Simple hash function to convert string to number
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		const char = id.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}

	const index = Math.abs(hash) % GRADIENTS.length;
	return GRADIENTS[index];
}
