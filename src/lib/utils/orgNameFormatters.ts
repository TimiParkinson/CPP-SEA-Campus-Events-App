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
	display: 'full' | 'abbreviated' | 'count';
	text: string;
	showMenu?: boolean;
	organizations?: Organization[];
}

/**
 * Format display for organization list (for event page)
 * @param maxLength Length constraint for org names
 */
export function formatOrgsForDisplay(orgs: Organization[], maxLength: number = 50): OrgDisplay {
	if (orgs.length === 0) {
		return { display: 'full', text: '' };
	}

	if (orgs.length === 1) {
		return { display: 'full', text: orgs[0].name };
	}

	// 2-3 orgs
	if (orgs.length <= 3) {
		// Display full names
		const fullNames = orgs.map((org) => org.name).join(', ');
		if (fullNames.length <= maxLength) {
			return { display: 'full', text: fullNames, organizations: orgs };
		}

		// Display names with abbreviations where needed
		const shortNames = orgs
			.map((org) => {
				// Abbreviate if name is longer than 20 chars
				return org.name.length > 20 ? org.abbreviation || generateAbbreviation(org.name) : org.name;
			})
			.join(', ');
		if (shortNames.length <= maxLength) {
			return { display: 'abbreviated', text: shortNames, organizations: orgs };
		}

		// Display all as abbreviations
		const abbreviatedNames = orgs
			.map((org) => org.abbreviation || generateAbbreviation(org.name))
			.join(', ');

		return { display: 'abbreviated', text: abbreviatedNames, organizations: orgs };
	}

	// 4+ orgs
	return {
		display: 'count',
		text: `Hosted by ${orgs.length} Organizations`,
		showMenu: true,
		organizations: orgs
	};
}

/**
 * Format display for organization list (for event dialog)
 */
export function formatOrgsForDialog(orgs: Organization[]): {
	display: 'full';
	displayNames: string[];
} {
	if (orgs.length === 0) {
		return { display: 'full', displayNames: [] };
	}

	if (orgs.length === 1) {
		return { display: 'full', displayNames: [orgs[0].name] };
	}

	// Display up to 3 org names (abbreviated if too long)
	const displayOrgs = orgs.slice(0, 3);
	const displayNames = displayOrgs.map((org) => {
		if (org.name.length > 28) {
			return org.abbreviation || generateAbbreviation(org.name);
		}
		return org.name;
	});

	return {
		display: 'full',
		displayNames
	};
}
