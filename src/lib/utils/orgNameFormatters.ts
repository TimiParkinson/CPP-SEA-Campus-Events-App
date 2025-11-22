/**
 * Organization name and abbreviation utilities
 */

interface OrgLike {
	id: string;
	name: string;
	abbreviation?: string | null;
}

/**
 * Generate abbreviation from organization name.
 */
export function generateAbbreviation(name: string): string {
	// If name is already short (≤ 10 chars), return as-is
	if (name.length <= 10) {
		return name;
	}

	// Split into words, filtering out common small words
	const skipWords = ['of', 'the', 'and', 'for', 'at', 'in', 'on'];
	const words = name
		.split(/\s+/)
		.filter((word) => word.length > 0 && !skipWords.includes(word.toLowerCase()));

	// Take first letter of each significant word
	const abbrev = words.map((word) => word[0].toUpperCase()).join('');

	return abbrev;
}

/**
 * Get display name for organization (full name or abbreviation).
 */
export function getOrgDisplayName(org: OrgLike, preferAbbreviation = false): string {
	if (preferAbbreviation && org.abbreviation) {
		return org.abbreviation;
	}
	if (preferAbbreviation && org.name.length > 10) {
		return generateAbbreviation(org.name);
	}
	return org.name;
}

/**
 * Format multiple organization names intelligently.
 *
 * @param orgs - Array of organizations
 * @param maxLength - Maximum total character length
 * @returns Formatted string (e.g., "SEA, SheCodes" or "Hosted by 3 Organizations")
 */
export function formatMultipleOrgs(orgs: OrgLike[], maxLength = 50): string {
	if (orgs.length === 0) return '';
	if (orgs.length === 1) return orgs[0].name;

	// Try full names display
	const fullNames = orgs.map((org) => org.name).join(', ');
	if (fullNames.length <= maxLength) {
		return fullNames;
	}

	// Try abbreviated display for long names, keep short names as-is
	const mixedNames = orgs
		.map((org) => {
			// Use abbreviation if name is long (> 20 chars)
			if (org.name.length > 20) {
				return org.abbreviation || generateAbbreviation(org.name);
			}
			return org.name;
		})
		.join(', ');

	if (mixedNames.length <= maxLength) {
		return mixedNames;
	}

	// Try all abbreviations
	const allAbbrevs = orgs
		.map((org) => org.abbreviation || generateAbbreviation(org.name))
		.join(', ');

	if (allAbbrevs.length <= maxLength) {
		return allAbbrevs;
	}

	return `Hosted by ${orgs.length} Organizations`;
}

/**
 * Format organization display with icon for UI
 * Returns object with display text and whether to show icon
 */
export function formatOrgDisplay(
	orgs: OrgLike[],
	maxLength = 50
): {
	text: string;
	showIcon: boolean;
	fullList?: string[];
} {
	const formatted = formatMultipleOrgs(orgs, maxLength);
	const isGeneric = formatted.startsWith('Hosted by');

	return {
		text: formatted,
		showIcon: orgs.length > 1,
		fullList: isGeneric ? orgs.map((o) => o.name) : undefined
	};
}
