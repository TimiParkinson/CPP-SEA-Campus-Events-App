import { sql } from 'drizzle-orm'; // Brings in Drizzles raw SQL
import {
	pgTable,
	uuid,
	varchar,
	text,
	boolean,
	integer,
	timestamp,
	pgEnum,
	primaryKey,
	uniqueIndex,
	index
} from 'drizzle-orm/pg-core'; // Exports column builders and helpers specifically for Postgres
// uuid(): UUID coolumn, varchar(): fixes-length string column, text(): unlitmited text column, boolean(): true/false column, timestamp(): timestamp column
// uniqueIndex()/index(): define unique or normal indexes in the table’s extras block, , primaryKey(): explicit primary key builder used for join tables

// Schema helpers: postgres enum type named user_role with fixed allowed values
export const userRole = pgEnum('user_role', ['student', 'club_leader', 'admin']);
// Postgres enum type named org_member_role for org membership roles
export const orgMemberRole = pgEnum('org_member_role', ['member', 'board_member', 'president']);

// Reusable timestamp columns: (timestamptz), every table can share the same defintion
const createdAt = timestamp('created_at', { withTimezone: true })
	.notNull()
	.default(sql`now()`);
const updatedAt = timestamp('updated_at', { withTimezone: true })
	.notNull()
	.default(sql`now()`);

/// <summary>
/// Users table: people who interact with the system.
/// UUID PK with server-side default (gen_random_uuid())
/// Unique email; role constrained by enum; optional age
/// Timestamps capture creation/update moments
/// </summary>
export const users = pgTable(
	'users',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		email: varchar('email', { length: 320 }).notNull(), // User’s email address. Unique across all users
		name: varchar('name', { length: 160 }).notNull(), // Display name for the user
		role: userRole('role').notNull().default('student'), // Application role
		age: integer('age'), // Optional age
		createdAt, // Row creation timestamp
		updatedAt // Row update timestamp
	},
	(t) => ({
		emailUnique: uniqueIndex('users_email_unique').on(t.email) // Uniqueness constraint on email to prevent duplicates
	})
);

// <summary>
/// Organizations table: clubs/departments that host events
/// Basic profile fields + soft active flag.
/// Indexed by name and contact email for quick lookup.
/// </summary>
export const organizations = pgTable(
	'organizations',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		name: varchar('name', { length: 320 }).notNull(), // Organization display name
		description: text('description'), // Description
		contactEmail: varchar('contact_email', { length: 320 }).notNull(), // Primary contact email for the organization
		isActive: boolean('is_active').notNull().default(true), // Soft-active flag. Inactive orgs can be hidden without deleting data
		createdAt,
		updatedAt
	},
	(t) => ({
		orgNameIdx: index('organizations_name_idx').on(t.name), // Index to speed up name searches/sorts
		orgEmailIdx: index('organizations_contact_email_idx').on(t.contactEmail) // Index for quick lookup by contact email
	})
);

/// <summary>
/// Organization categories: controlled vocabulary (e.g., academic, cultural).
/// </summary>
export const organizationCategories = pgTable(
	'organization_categories',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		name: varchar('name', { length: 64 }).notNull(), // Short, unique category name
		color: varchar('color', { length: 16 }).notNull() // Hex or short color code for UI theming
	},
	(t) => ({
		// Ensures category names are unique
		nameUnique: uniqueIndex('organization_categories_name_unique').on(t.name)
	})
);

export const organizationCategoryAssignments = pgTable(
	'organization_category_assignments',
	{
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		categoryId: uuid('category_id')
			.notNull()
			.references(() => organizationCategories.id, { onDelete: 'cascade' })
	},
	(t) => ({
		pk: primaryKey({
			columns: [t.organizationId, t.categoryId],
			name: 'organization_category_assignments_pk'
		})
	})
);

export const events = pgTable(
	'events',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		title: varchar('title', { length: 320 }).notNull(),
		description: text('description'),
		location: varchar('location', { length: 320 }).notNull(),
		startTime: timestamp('start_time', { withTimezone: true }).notNull(),
		endTime: timestamp('end_time', { withTimezone: true }).notNull(),
		maxCapacity: integer('max_capacity'),
		registrationRequired: boolean('registration_required').notNull().default(false),
		createdBy: uuid('created_by')
			.notNull()
			.references(() => users.id, { onDelete: 'restrict' }),
		createdAt,
		updatedAt
	},
	(t) => ({
		orgIdx: index('events_organization_id_idx').on(t.organizationId),
		timeIdx: index('events_start_time_idx').on(t.startTime)
	})
);

export const eventTags = pgTable(
	'event_tags',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		name: varchar('name', { length: 100 }).notNull(),
		color: varchar('color', { length: 16 }).notNull()
	},
	(t) => ({
		tagNameUnique: uniqueIndex('event_tags_name_unique').on(t.name)
	})
);

export const eventTagAssignments = pgTable(
	'event_tag_assignments',
	{
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		tagId: uuid('tag_id')
			.notNull()
			.references(() => eventTags.id, { onDelete: 'cascade' })
	},
	(t) => ({
		pk: primaryKey({ columns: [t.eventId, t.tagId], name: 'event_tag_assignments_pk' })
	})
);

export const organizationMembers = pgTable(
	'organization_members',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		role: orgMemberRole('role').notNull().default('member')
	},
	(t) => ({
		uniqMemberPerOrg: uniqueIndex('organization_members_user_org_unique').on(
			t.userId,
			t.organizationId
		)
	})
);
