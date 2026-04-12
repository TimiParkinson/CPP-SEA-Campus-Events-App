// src/routes/api/events/+server.ts
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import {
	getEventsForDiscovery,
	type EventDiscoveryFilters,
	type EventDiscoveryPagination
} from '$lib/server/db/dataHelpers.js';
import { error as kitError, isHttpError, isRedirect, json } from '@sveltejs/kit';
import { requireAuth, requireCanManageOrg } from '$lib/server/authz.js';
import { validateEventCreate } from '$lib/server/validation/events.js';

type QueryValidation =
	| { ok: true; value: { filters: EventDiscoveryFilters; pagination: EventDiscoveryPagination } }
	| { ok: false; errors: Record<string, string> };

const allowedQueryParams = new Set([
	'organizationId',
	'orgCategory',
	'category',
	'tag',
	'date',
	'startDate',
	'endDate',
	'q',
	'page',
	'pageSize'
]);

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PAGE_SIZE = 50;

function addQueryError(errors: Record<string, string>, field: string, message: string) {
	if (!errors[field]) errors[field] = message;
}

function parseOptionalUuid(
	value: string | null,
	field: string,
	errors: Record<string, string>
): string | undefined {
	if (!value) return undefined;
	const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	if (!uuidPattern.test(value.trim())) {
		addQueryError(errors, field, `${field} must be a valid UUID`);
		return undefined;
	}
	return value.trim();
}

function parseOptionalPositiveInt(
	value: string | null,
	field: string,
	errors: Record<string, string>,
	options: { min: number; max?: number }
): number | undefined {
	if (value == null) return undefined;
	if (!/^\d+$/.test(value)) {
		addQueryError(errors, field, `${field} must be a positive integer`);
		return undefined;
	}
	const parsed = Number.parseInt(value, 10);
	if (parsed < options.min) {
		addQueryError(errors, field, `${field} must be at least ${options.min}`);
		return undefined;
	}
	if (options.max && parsed > options.max) {
		addQueryError(errors, field, `${field} must be at most ${options.max}`);
		return undefined;
	}
	return parsed;
}

function splitListParam(values: string[]): string[] {
	return values
		.flatMap((value) => value.split(','))
		.map((value) => value.trim())
		.filter((value) => value.length > 0);
}

function parseDateParam(
	value: string | null,
	field: string,
	errors: Record<string, string>,
	mode: 'start' | 'end'
): Date | undefined {
	if (!value) return undefined;
	const trimmed = value.trim();
	if (dateOnlyPattern.test(trimmed)) {
		const suffix = mode === 'start' ? 'T00:00:00.000Z' : 'T23:59:59.999Z';
		return new Date(`${trimmed}${suffix}`);
	}
	const parsed = new Date(trimmed);
	if (Number.isNaN(parsed.getTime())) {
		addQueryError(errors, field, `${field} must be a valid ISO date or date-time`);
		return undefined;
	}
	return parsed;
}

function parseEventsQuery(url: URL): QueryValidation {
	const errors: Record<string, string> = {};
	const params = url.searchParams;
	const unknownParams = Array.from(params.keys()).filter((key) => !allowedQueryParams.has(key));
	if (unknownParams.length > 0) {
		addQueryError(errors, 'unknownParams', `Unexpected query params: ${unknownParams.join(', ')}`);
	}

	const organizationId = parseOptionalUuid(params.get('organizationId'), 'organizationId', errors);

	const tagValues = splitListParam(params.getAll('tag')).map((value) => value.toLowerCase());
	if (params.has('tag') && tagValues.length === 0) {
		addQueryError(errors, 'tag', 'tag must be a non-empty string or comma-separated list');
	}
	const tagNames = tagValues.length > 0 ? Array.from(new Set(tagValues)) : undefined;

	const categoryValues = splitListParam([
		...params.getAll('orgCategory'),
		...params.getAll('category')
	]).map((value) => value.toLowerCase().replace(/\s+/g, '_'));
	if ((params.has('orgCategory') || params.has('category')) && categoryValues.length === 0) {
		addQueryError(
			errors,
			'orgCategory',
			'orgCategory must be a non-empty string or comma-separated list'
		);
	}
	const orgCategoryNames =
		categoryValues.length > 0 ? Array.from(new Set(categoryValues)) : undefined;

	const searchRaw = params.get('q');
	const search = searchRaw ? searchRaw.trim() : undefined;
	if (search && search.length > 200) {
		addQueryError(errors, 'q', 'q must be 200 characters or fewer');
	}

	const date = params.get('date');
	const startDateRaw = params.get('startDate');
	const endDateRaw = params.get('endDate');
	if (date && (startDateRaw || endDateRaw)) {
		addQueryError(errors, 'date', 'Use either date or startDate/endDate, not both');
	}

	let startDate: Date | undefined;
	let endDate: Date | undefined;
	if (date) {
		if (!dateOnlyPattern.test(date.trim())) {
			addQueryError(errors, 'date', 'date must be in YYYY-MM-DD format');
		} else {
			startDate = parseDateParam(date, 'date', errors, 'start');
			endDate = parseDateParam(date, 'date', errors, 'end');
		}
	} else {
		startDate = parseDateParam(startDateRaw, 'startDate', errors, 'start');
		endDate = parseDateParam(endDateRaw, 'endDate', errors, 'end');
	}

	if (startDate && endDate && startDate > endDate) {
		addQueryError(errors, 'dateRange', 'startDate must be on or before endDate');
	}

	const page = parseOptionalPositiveInt(params.get('page'), 'page', errors, { min: 1 }) ?? 1;
	const pageSize =
		parseOptionalPositiveInt(params.get('pageSize'), 'pageSize', errors, {
			min: 1,
			max: MAX_PAGE_SIZE
		}) ?? 20;

	if (Object.keys(errors).length > 0) {
		return { ok: false, errors };
	}

	return {
		ok: true,
		value: {
			filters: {
				organizationId,
				tagNames,
				orgCategoryNames,
				startDate,
				endDate,
				search
			},
			pagination: { page, pageSize }
		}
	};
}

export async function GET({ url }) {
	// Public list for now, if we want private drafts later, we can add authz here
	const parsed = parseEventsQuery(url);
	if (!parsed.ok) {
		return json({ error: 'Invalid query params', details: parsed.errors }, { status: 400 });
	}

	try {
		const { filters, pagination } = parsed.value;
		const { events, total } = await getEventsForDiscovery(filters, pagination);
		const totalPages = total === 0 ? 0 : Math.ceil(total / pagination.pageSize);
		return json({
			data: events,
			pagination: {
				page: pagination.page,
				pageSize: pagination.pageSize,
				total,
				totalPages,
				hasNext: pagination.page < totalPages,
				hasPrev: pagination.page > 1
			}
		});
	} catch (error) {
		console.error('Error fetching events:', error);
		return json({ error: 'Failed to fetch events' }, { status: 500 });
	}
}

export async function POST(event) {
	// Server enforcement, students should not be able to POST /api/events unless they manage that org
	const userId = requireAuth(event); // Blocks anonymous users

	let data: unknown;
	try {
		data = await event.request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const validation = validateEventCreate(data);
	if (!validation.ok) {
		return json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
	}

	try {
		// Blocks: non-admin users who are not board_member/president for this org
		await requireCanManageOrg(userId, validation.value.organizationId);

		// Security: never trust client-provided createdBy
		const insertData = {
			...validation.value,
			createdBy: userId
		};

		const created = await db.insert(events).values(insertData).returning();
		return json(created[0], { status: 201 });
	} catch (err) {
		// Keep intentional redirects / HTTP errors (e.g., 303 to /signin, 403 Forbidden)
		if (isRedirect(err) || isHttpError(err)) throw err;

		console.error('Error creating event:', err);
		throw kitError(500, 'Failed to create event');
	}
}
