import type { Organization } from '$lib/types/index.js';

const SKIP_WORDS = new Set(['of', 'the', 'and', 'for', 'at', 'in', 'on', 'to', 'a', 'an']);

/**
 * Generate abbreviation from organization name
 */
export function generateAbbreviation(name: string): string {
	// Extract first letters of significant words
	const letters = name
		.split(/\s+/)
		.filter((word) => word.length > 0 && !SKIP_WORDS.has(word.toLowerCase()));

	// Join letters to form abbreviation
	return letters.map((letter) => letter[0].toUpperCase()).join('');
}

interface OrgDisplay {
	display: 'full' | 'abbreviation' | 'count';
	text: string;
	showMenu?: boolean;
	organizations?: Organization[];
}

/**
 * Format display for organization list (for event page)
 * @param maxLength Length constriction for org names
 */
export function formatOrgsForDisplay(orgs: Organization[], maxLength = 50): OrgDisplay {
	if (orgs.length === 0) {
		return { display: 'full', text: '' };
	}

	if (orgs.length === 1) {
		return { display: 'full', text: orgs[0].name };
	}

	// Display full names
	const fullNames = orgs.map((org) => org.name).join(', ');
	if (fullNames.length <= maxLength) {
		return { display: 'full', text: fullNames, organizations: orgs };
	}

	// Display abbreviations
	const abbrevNames = orgs
		.map((org) => org.abbreviation || generateAbbreviation(org.name))
		.join(', ');

	if (abbrevNames.length <= maxLength) {
		return { display: 'abbreviation', text: abbrevNames, organizations: orgs };
	}

	// Fallback to count display
	return {
		display: 'count',
		text: `Hosted by ${orgs.length} Organizations`,
		showMenu: true,
		organizations: orgs
	};
}

/**
 * Format display for organization list (for event dialog)
 * @param maxLines Lines constriction for org names
 */
export function formatOrgsForDialog(orgs: Organization[], maxLines: number = 3): OrgDisplay {
	if (orgs.length === 0) {
		return { display: 'full', text: '' };
	}

	if (orgs.length === 1) {
		return { display: 'full', text: orgs[0].name };
	}

	const charsPerLine = 35;
	const maxLength = maxLines * charsPerLine;

	// Display full names
	const fullNames = orgs.map((org) => org.name).join(', ');
	if (fullNames.length <= maxLength) {
		return { display: 'full', text: fullNames, organizations: orgs };
	}

	// Display abbreviations
	const abbreviatedNames = orgs
		.map((org) => org.abbreviation || generateAbbreviation(org.name))
		.join(', ');

	if (abbreviatedNames.length <= maxLength) {
		return { display: 'abbreviation', text: abbreviatedNames, organizations: orgs };
	}

	// Fallback to count
	return {
		display: 'count',
		text: `Hosted by ${orgs.length} Organizations`,
		organizations: orgs
	};
}
