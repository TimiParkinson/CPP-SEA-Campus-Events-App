// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/** User roles */
export type UserRole = 'student' | 'club_leader' | 'admin';

/** Organization member roles */
export type OrgMemberRole = 'member' | 'board_member' | 'president';

/** Filter types for search/discover */
export type FilterType = 'all' | 'events' | 'organizations';

/** Card display variants */
export type CardVariant = 'featured' | 'general';

/** Gradient fallback system for images */
export const GRADIENTS = [
	'bg-gradient-to-br from-blue-500 to-purple-600',
	'bg-gradient-to-br from-green-500 to-teal-600',
	'bg-gradient-to-br from-orange-500 to-pink-600',
	'bg-gradient-to-br from-indigo-500 to-purple-600',
	'bg-gradient-to-br from-cyan-500 to-blue-600',
	'bg-gradient-to-br from-pink-500 to-rose-600',
	'bg-gradient-to-br from-emerald-500 to-green-600',
	'bg-gradient-to-br from-violet-500 to-purple-600'
] as const;

/** Get deterministic gradient for an ID */
export function getGradientForId(id: string): string {
	const index = id.charCodeAt(0) % GRADIENTS.length;
	return GRADIENTS[index];
}

// ============================================================================
// MAIN ENTITIES
// ============================================================================

/**
 * Event
 * Represents event data with all joined/computed fields.
 * Used everywhere: cards, lists, detail pages, dialogs.
 *
 * BACKEND TODO:
 * - Add 'rsvp_url' column to events table
 * - Add 'feedback_url' column to events table
 * - Create 'event_organization_assignments' junction table for many-to-many relationship
 *   (supports co-hosted events with multiple organizations)
 * - Create 'event_tag_assignments' junction table for many-to-many relationship
 * - Ensure queries join organizations and tags for enriched data
 */
export interface Event {
	// Core fields
	id: string;
	title: string;
	description?: string | null;
	location: string;
	startTime: string; // ISO string
	endTime: string; // ISO string

	// Optional fields
	imageUrl?: string | null;
	attendeeCount?: number | null; // Computed from event_registrations table
	rsvpUrl?: string | null; // BACKEND TODO: Add this column
	feedbackUrl?: string | null; // BACKEND TODO: Add this column

	// Joined/related data (BACKEND TODO: Join these in queries)
	// NOTE: Arrays are optional to gracefully handle incomplete backend data
	organizations?: Array<{
		id: string;
		name: string;
		abbreviation?: string | null;
		logoUrl?: string | null;
	}>; // BACKEND TODO: Join via event_organization_assignments
	tags?: Array<{
		id: string;
		name: string;
		color: string; // BACKEND TODO: Add 'color' column to event_tags table
	}>; // BACKEND TODO: Join via event_tag_assignments
}

/**
 * Organization
 * Represents organization data with all joined/computed fields.
 * Used everywhere: cards, lists, detail pages, dialogs.
 *
 * BACKEND TODO:
 * - Add 'banner_image_url' column to organizations table
 * - Add 'established_date' column to organizations table
 * - Add 'feedback_url' column to organizations table
 * - Create 'organization_category_assignments' junction table for many-to-many relationship
 * - Ensure queries join categories and compute member count
 * - Board members should be derived from organization_members where role = 'board_member' or 'president'
 */
export interface Organization {
	// Core fields
	id: string;
	name: string;

	// Optional fields
	description?: string | null;
	logoUrl?: string | null;
	bannerImageUrl?: string | null; // BACKEND TODO: Add this column
	abbreviation?: string | null;
	memberCount?: number | null; // Computed from organization_members table
	establishedDate?: Date | null; // BACKEND TODO: Add this column
	websiteUrl?: string | null;
	contactEmail?: string | null;
	feedbackUrl?: string | null; // BACKEND TODO: Add this column

	// Joined/related data (BACKEND TODO: Join these in queries)
	// NOTE: Arrays are optional to gracefully handle incomplete backend data
	categories?: Array<{
		id: string;
		name: string;
		color: string; // BACKEND TODO: Add 'color' column to organization_categories table
	}>; // BACKEND TODO: Join via organization_category_assignments
	boardMembers?: Array<{
		name: string; // Denormalized from users table
		role: string; // e.g., "President", "Vice President"
	}>; // BACKEND TODO: Join organization_members where role IN ('board_member', 'president')
}

// ============================================================================
// TAGS & CATEGORIES
// ============================================================================

/**
 * Event Tag
 * Used to categorize events (e.g., "workshop", "social", "networking")
 *
 * BACKEND TODO:
 * - Add 'color' column to event_tags table (hex color string)
 */
export interface EventTag {
	id: string;
	name: string;
	color: string; // Hex color - BACKEND TODO: Add this column
}

/**
 * Organization Category
 * Used to categorize organizations (e.g., "Academic", "Cultural", "Sports")
 *
 * BACKEND TODO:
 * - Add 'color' column to organization_categories table (hex color string)
 */
export interface OrganizationCategory {
	id: string;
	name: string;
	color: string; // Hex color - BACKEND TODO: Add this column
}

// ============================================================================
// USERS & MEMBERS
// ============================================================================

/**
 * User
 * Represents a user in the system
 */
export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	age?: number | null;
	createdAt: Date;
	updatedAt: Date;
}

// ============================================================================
// SEARCH & FILTERS
// ============================================================================

/**
 * Search filter state
 * Used in search and discover pages
 */
export interface SearchFilters {
	type?: FilterType;
	category?: string;
	tags?: string[];
	organization?: string;
	query?: string;
	timeRange?: 'upcoming' | 'past' | 'all';
}
