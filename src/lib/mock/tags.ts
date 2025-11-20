/**
 * Mock event tags and organization categories
 */

import type { EventTag, OrganizationCategory } from '$lib/types/index.js';

export const mockEventTags: EventTag[] = [
	{ id: 'tag-1', name: 'networking', color: '#3B82F6' },
	{ id: 'tag-2', name: 'workshop', color: '#8B5CF6' },
	{ id: 'tag-3', name: 'social', color: '#EC4899' },
	{ id: 'tag-4', name: 'fundraiser', color: '#10B981' },
	{ id: 'tag-5', name: 'competition', color: '#F59E0B' },
	{ id: 'tag-6', name: 'free-food', color: '#EF4444' },
	{ id: 'tag-7', name: 'volunteer', color: '#14B8A6' },
	{ id: 'tag-8', name: 'lecture', color: '#6366F1' }
];

export const mockOrganizationCategories: OrganizationCategory[] = [
	{ id: 'cat-1', name: 'Academic', color: '#3B82F6' },
	{ id: 'cat-2', name: 'Cultural', color: '#F97316' },
	{ id: 'cat-3', name: 'Sports', color: '#10B981' },
	{ id: 'cat-4', name: 'Service', color: '#6366F1' },
	{ id: 'cat-5', name: 'Special Interest', color: '#8B5CF6' },
	{ id: 'cat-6', name: 'Technology', color: '#8B5CF6' }
];
