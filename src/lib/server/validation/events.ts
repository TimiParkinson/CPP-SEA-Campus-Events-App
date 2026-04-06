type ValidationErrors = Record<string, string>;

type ValidationOk<T> = { ok: true; value: T };
type ValidationFail = { ok: false; errors: ValidationErrors };

type EventCreatePayload = {
	organizationId: string;
	title: string;
	description?: string | null;
	location: string;
	startTime: Date;
	endTime: Date;
	maxCapacity?: number | null;
	registrationRequired?: boolean;
};

type EventUpdatePayload = {
	title?: string;
	description?: string | null;
	location?: string;
	startTime?: Date;
	endTime?: Date;
	maxCapacity?: number | null;
	registrationRequired?: boolean;
};

type EventUpdateContext = {
	existingStartTime?: Date;
	existingEndTime?: Date;
};

const createAllowedFields = new Set([
	'organizationId',
	'title',
	'description',
	'location',
	'startTime',
	'endTime',
	'maxCapacity',
	'registrationRequired'
]);

const updateAllowedFields = new Set([
	'title',
	'description',
	'location',
	'startTime',
	'endTime',
	'maxCapacity',
	'registrationRequired'
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function addError(errors: ValidationErrors, field: string, message: string) {
	if (!errors[field]) errors[field] = message;
}

function parseDateValue(value: unknown): Date | null {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	if (typeof value === 'string') {
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}
	return null;
}

function parseRequiredString(
	value: unknown,
	field: string,
	errors: ValidationErrors
): string | undefined {
	if (typeof value !== 'string' || value.trim().length === 0) {
		addError(errors, field, `${field} is required`);
		return undefined;
	}
	return value.trim();
}

function parseOptionalNonEmptyString(
	value: unknown,
	field: string,
	errors: ValidationErrors
): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== 'string' || value.trim().length === 0) {
		addError(errors, field, `${field} must be a non-empty string`);
		return undefined;
	}
	return value.trim();
}

function parseOptionalNullableString(
	value: unknown,
	field: string,
	errors: ValidationErrors
): string | null | undefined {
	if (value === undefined) return undefined;
	if (value === null) return null;
	if (typeof value !== 'string' || value.trim().length === 0) {
		addError(errors, field, `${field} must be a non-empty string or null`);
		return undefined;
	}
	return value.trim();
}

function parseRequiredDate(
	value: unknown,
	field: string,
	errors: ValidationErrors
): Date | undefined {
	const parsed = parseDateValue(value);
	if (!parsed) {
		addError(errors, field, `${field} must be a valid ISO date string`);
		return undefined;
	}
	return parsed;
}

function parseOptionalDate(
	value: unknown,
	field: string,
	errors: ValidationErrors
): Date | undefined {
	if (value === undefined) return undefined;
	const parsed = parseDateValue(value);
	if (!parsed) {
		addError(errors, field, `${field} must be a valid ISO date string`);
		return undefined;
	}
	return parsed;
}

function parseOptionalInteger(
	value: unknown,
	field: string,
	errors: ValidationErrors
): number | null | undefined {
	if (value === undefined) return undefined;
	if (value === null) return null;
	if (typeof value !== 'number' || !Number.isInteger(value)) {
		addError(errors, field, `${field} must be an integer`);
		return undefined;
	}
	if (value < 1) {
		addError(errors, field, `${field} must be at least 1`);
		return undefined;
	}
	return value;
}

function parseOptionalBoolean(
	value: unknown,
	field: string,
	errors: ValidationErrors
): boolean | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== 'boolean') {
		addError(errors, field, `${field} must be a boolean`);
		return undefined;
	}
	return value;
}

function compactUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
	const result: Record<string, unknown> = {};
	for (const [key, val] of Object.entries(value)) {
		if (val !== undefined) result[key] = val;
	}
	return result as Partial<T>;
}

export function validateEventCreate(data: unknown): ValidationOk<EventCreatePayload> | ValidationFail {
	if (!isPlainObject(data)) {
		return { ok: false, errors: { _error: 'Expected a JSON object body' } };
	}

	const errors: ValidationErrors = {};
	const unknownKeys = Object.keys(data).filter((key) => !createAllowedFields.has(key));
	if (unknownKeys.length > 0) {
		addError(errors, 'unknownFields', `Unexpected fields: ${unknownKeys.join(', ')}`);
	}

	const organizationId = parseRequiredString(data.organizationId, 'organizationId', errors);
	const title = parseRequiredString(data.title, 'title', errors);
	const location = parseRequiredString(data.location, 'location', errors);
	const description = parseOptionalNullableString(data.description, 'description', errors);
	const startTime = parseRequiredDate(data.startTime, 'startTime', errors);
	const endTime = parseRequiredDate(data.endTime, 'endTime', errors);
	const maxCapacity = parseOptionalInteger(data.maxCapacity, 'maxCapacity', errors);
	const registrationRequired = parseOptionalBoolean(
		data.registrationRequired,
		'registrationRequired',
		errors
	);

	if (startTime && endTime && startTime >= endTime) {
		addError(errors, 'timeRange', 'startTime must be before endTime');
	}

	if (Object.keys(errors).length > 0) {
		return { ok: false, errors };
	}

	const payload: EventCreatePayload = {
		organizationId: organizationId as string,
		title: title as string,
		location: location as string,
		startTime: startTime as Date,
		endTime: endTime as Date,
		description,
		maxCapacity,
		registrationRequired
	};

	return { ok: true, value: compactUndefined(payload) as EventCreatePayload };
}

export function validateEventUpdate(
	data: unknown,
	context: EventUpdateContext = {}
): ValidationOk<EventUpdatePayload> | ValidationFail {
	if (!isPlainObject(data)) {
		return { ok: false, errors: { _error: 'Expected a JSON object body' } };
	}

	const errors: ValidationErrors = {};
	const unknownKeys = Object.keys(data).filter((key) => !updateAllowedFields.has(key));
	if (unknownKeys.length > 0) {
		addError(errors, 'unknownFields', `Unexpected fields: ${unknownKeys.join(', ')}`);
	}

	const title = parseOptionalNonEmptyString(data.title, 'title', errors);
	const location = parseOptionalNonEmptyString(data.location, 'location', errors);
	const description = parseOptionalNullableString(data.description, 'description', errors);
	const startTime = parseOptionalDate(data.startTime, 'startTime', errors);
	const endTime = parseOptionalDate(data.endTime, 'endTime', errors);
	const maxCapacity = parseOptionalInteger(data.maxCapacity, 'maxCapacity', errors);
	const registrationRequired = parseOptionalBoolean(
		data.registrationRequired,
		'registrationRequired',
		errors
	);

	const payload = compactUndefined({
		title,
		description,
		location,
		startTime,
		endTime,
		maxCapacity,
		registrationRequired
	});

	if (Object.keys(payload).length === 0) {
		addError(errors, 'emptyPayload', 'At least one field must be provided');
	}

	const effectiveStart = (payload.startTime as Date | undefined) ?? context.existingStartTime;
	const effectiveEnd = (payload.endTime as Date | undefined) ?? context.existingEndTime;
	if (effectiveStart && effectiveEnd && effectiveStart >= effectiveEnd) {
		addError(errors, 'timeRange', 'startTime must be before endTime');
	}

	if (Object.keys(errors).length > 0) {
		return { ok: false, errors };
	}

	return { ok: true, value: payload as EventUpdatePayload };
}
