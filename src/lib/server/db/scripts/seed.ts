import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import {
  users, organizations, organizationCategories, organizationCategoryAssignments,
  events, eventTags, eventTagAssignments, organizationMembers
} from '../schema.js';

const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(sql);

const inUTC = (iso: string) => new Date(iso);

// RAW MOCK (matches schema)
const mock = {
  users: [
    { email: 'sarah.chen@university.edu', name: 'Sarah Chen', role: 'student' as const },
    { email: 'mike.rodriguez@university.edu', name: 'Mike Rodriguez', role: 'club_leader' as const },
    { email: 'admin@university.edu',         name: 'Campus Admin',  role: 'admin' as const },
  ],
  organizationCategories: [
    { name: 'academic',         color: '#3B82F6' },
    { name: 'cultural',         color: '#F97316' },
    { name: 'sports',           color: '#10B981' },
    { name: 'service',          color: '#6366F1' },
    { name: 'special_interest', color: '#8B5CF6' },
  ],
  organizations: [
    { name: 'Computer Science Club',        description: 'A community for students interested in software development, algorithms, and tech careers', contactEmail: 'csclub@university.edu',   isActive: true },
    { name: 'Latin Dance Society',          description: 'Learn salsa, bachata, and other Latin dance styles',                                       contactEmail: 'latindance@university.edu', isActive: true },
    { name: 'Environmental Action Coalition', description: 'Students working together for campus sustainability and environmental awareness',        contactEmail: 'eac@university.edu',        isActive: true },
    { name: 'Intramural Soccer League',     description: 'Competitive and recreational soccer for all skill levels',                                 contactEmail: 'soccer@university.edu',     isActive: true },
    { name: 'Board Game Club',              description: 'Weekly meetups to play strategy games, party games, and tabletop RPGs',                    contactEmail: 'boardgames@university.edu', isActive: true },
    { name: 'Career Development Center',    description: 'Official university career services',                                                      contactEmail: 'careers@university.edu',    isActive: true },
  ],
  organizationCategoryAssignments: [
    { org: 'Computer Science Club',        cat: 'academic' },
    { org: 'Latin Dance Society',          cat: 'cultural' },
    { org: 'Environmental Action Coalition', cat: 'service' },
    { org: 'Environmental Action Coalition', cat: 'academic' },
    { org: 'Intramural Soccer League',     cat: 'sports' },
    { org: 'Board Game Club',              cat: 'special_interest' },
    { org: 'Career Development Center',    cat: 'academic' },
  ],
  eventTags: [
    { name: 'networking',  color: '#3B82F6' },
    { name: 'workshop',    color: '#8B5CF6' },
    { name: 'social',      color: '#EC4899' },
    { name: 'fundraiser',  color: '#10B981' },
    { name: 'competition', color: '#F59E0B' },
    { name: 'free-food',   color: '#EF4444' },
    { name: 'volunteer',   color: '#14B8A6' },
    { name: 'lecture',     color: '#6366F1' },
  ],
  // Times kept from sample (already UTC ISO)
  events: [
    {
      org: 'Computer Science Club',
      title: 'Intro to Web Development Workshop',
      description: 'Learn the basics of HTML, CSS, and JavaScript. Perfect for beginners! We\'ll build a simple portfolio website together.',
      location: 'Engineering Building, Room 205',
      startTime: inUTC('2025-10-05T14:00:00Z'),
      endTime:   inUTC('2025-10-05T16:00:00Z'),
      registrationRequired: true,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Latin Dance Society',
      title: 'Salsa Night Social',
      description: 'Join us for an evening of salsa dancing! Beginners welcome - we\'ll teach basic steps at the start.',
      location: 'Student Center Ballroom',
      startTime: inUTC('2025-10-03T19:00:00Z'),
      endTime:   inUTC('2025-10-03T22:00:00Z'),
      registrationRequired: false,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Environmental Action Coalition',
      title: 'Campus Cleanup Day',
      description: 'Help us make our campus beautiful! Volunteer for our monthly cleanup event. Supplies and refreshments provided.',
      location: 'Meet at Main Quad',
      startTime: inUTC('2025-10-07T09:00:00Z'),
      endTime:   inUTC('2025-10-07T12:00:00Z'),
      registrationRequired: false,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Computer Science Club',
      title: 'Tech Career Fair Prep Session',
      description: 'Get ready for the upcoming career fair! Resume reviews, interview tips, and networking strategies.',
      location: 'Library, Study Room 3A',
      startTime: inUTC('2025-10-01T17:00:00Z'),
      endTime:   inUTC('2025-10-01T18:30:00Z'),
      registrationRequired: true,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Intramural Soccer League',
      title: 'Soccer Tournament Finals',
      description: 'Championship game of the fall intramural season! Come support your favorite team.',
      location: 'West Field',
      startTime: inUTC('2025-10-10T15:00:00Z'),
      endTime:   inUTC('2025-10-10T17:00:00Z'),
      registrationRequired: false,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Board Game Club',
      title: 'Board Game Night',
      description: 'Weekly game night! This week featuring Catan, Ticket to Ride, and Codenames. All experience levels welcome.',
      location: 'Student Lounge, 2nd Floor',
      startTime: inUTC('2025-10-04T18:00:00Z'),
      endTime:   inUTC('2025-10-04T21:00:00Z'),
      registrationRequired: false,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Career Development Center',
      title: 'Resume Workshop',
      description: 'Learn how to craft a compelling resume that gets interviews. Bring your laptop for hands-on editing.',
      location: 'Career Center',
      startTime: inUTC('2025-10-02T13:00:00Z'),
      endTime:   inUTC('2025-10-02T14:30:00Z'),
      registrationRequired: true,
      createdByEmail: 'admin@university.edu',
    },
    {
      org: 'Environmental Action Coalition',
      title: 'Climate Change Speaker Series',
      description: 'Dr. Maria Santos from the Environmental Science Department discusses local climate action. Q&A to follow.',
      location: 'Science Building Auditorium',
      startTime: inUTC('2025-10-08T16:00:00Z'),
      endTime:   inUTC('2025-10-08T17:30:00Z'),
      registrationRequired: false,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Computer Science Club',
      title: 'Hackathon Kickoff',
      description: '24-hour coding marathon! Form teams, build projects, compete for prizes. Pizza and energy drinks provided.',
      location: 'Engineering Building',
      startTime: inUTC('2025-10-12T18:00:00Z'),
      endTime:   inUTC('2025-10-13T18:00:00Z'),
      registrationRequired: true,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Latin Dance Society',
      title: 'Bachata Technique Workshop',
      description: 'Members-only advanced technique workshop focusing on turns and body movement.',
      location: 'Dance Studio B',
      startTime: inUTC('2025-10-06T15:00:00Z'),
      endTime:   inUTC('2025-10-06T17:00:00Z'),
      registrationRequired: true,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Board Game Club',
      title: 'Dungeons & Dragons Campaign Start',
      description: 'Starting a new D&D 5e campaign! New players welcome, characters will be created together.',
      location: 'Student Lounge, 2nd Floor',
      startTime: inUTC('2025-10-09T19:00:00Z'),
      endTime:   inUTC('2025-10-09T22:00:00Z'),
      registrationRequired: true,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
    {
      org: 'Environmental Action Coalition',
      title: 'E-Waste Collection Drive',
      description: 'Bring your old electronics for responsible recycling. Accepting phones, laptops, cables, and more.',
      location: 'Parking Lot C',
      startTime: inUTC('2025-10-11T10:00:00Z'),
      endTime:   inUTC('2025-10-11T14:00:00Z'),
      registrationRequired: false,
      createdByEmail: 'mike.rodriguez@university.edu',
    },
  ],
  eventTagAssignments: [
    { eventTitle: 'Intro to Web Development Workshop', tags: ['workshop','free-food'] },
    { eventTitle: 'Salsa Night Social',               tags: ['social'] },
    { eventTitle: 'Campus Cleanup Day',               tags: ['volunteer'] },
    { eventTitle: 'Tech Career Fair Prep Session',    tags: ['networking','workshop'] },
    { eventTitle: 'Soccer Tournament Finals',         tags: ['competition'] },
    { eventTitle: 'Board Game Night',                 tags: ['social','free-food'] },
    { eventTitle: 'Resume Workshop',                  tags: ['workshop','networking'] },
    { eventTitle: 'Climate Change Speaker Series',    tags: ['lecture'] },
    { eventTitle: 'Hackathon Kickoff',                tags: ['competition','free-food'] },
    { eventTitle: 'Bachata Technique Workshop',       tags: ['workshop'] },
    { eventTitle: 'Dungeons & Dragons Campaign Start',tags: ['social'] },
    { eventTitle: 'E-Waste Collection Drive',         tags: ['volunteer','fundraiser'] },
  ],
  organizationMembers: [
    { userEmail: 'mike.rodriguez@university.edu', org: 'Computer Science Club',        role: 'board_member' as const },
    { userEmail: 'sarah.chen@university.edu',     org: 'Computer Science Club',        role: 'member' as const },
    { userEmail: 'sarah.chen@university.edu',     org: 'Latin Dance Society',          role: 'member' as const },
  ]
};

// SEED
async function main() {
  // 0) Clean (FK-safe order) — dev only
  await db.delete(eventTagAssignments);
  await db.delete(eventTags);
  await db.delete(events);
  await db.delete(organizationCategoryAssignments);
  await db.delete(organizationCategories);
  await db.delete(organizationMembers);
  await db.delete(organizations);
  await db.delete(users);

  // 1) Users
  const usersInserted = await db.insert(users).values(mock.users).returning();
  const userByEmail = new Map(usersInserted.map(u => [u.email, u.id]));

  // 2) Orgs
  const orgsInserted = await db.insert(organizations).values(mock.organizations).returning();
  const orgByName = new Map(orgsInserted.map(o => [o.name, o.id]));

  // 3) Categories
  const catsInserted = await db.insert(organizationCategories).values(mock.organizationCategories).returning();
  const catByName = new Map(catsInserted.map(c => [c.name, c.id]));

  // 4) Org ↔ Category links
  await db.insert(organizationCategoryAssignments).values(
    mock.organizationCategoryAssignments.map(({ org, cat }) => ({
      organizationId: orgByName.get(org)!,
      categoryId: catByName.get(cat)!,
    }))
  );

  // 5) Tags
  const tagsInserted = await db.insert(eventTags).values(mock.eventTags).returning();
  const tagByName = new Map(tagsInserted.map(t => [t.name, t.id]));

  // 6) Events
  const eventsInserted = await db.insert(events).values(
    mock.events.map(e => ({
      organizationId: orgByName.get(e.org)!,
      title: e.title,
      description: e.description,
      location: e.location,
      startTime: e.startTime,
      endTime: e.endTime,
      registrationRequired: e.registrationRequired,
      createdBy: userByEmail.get(e.createdByEmail)!,
    }))
  ).returning();
  const eventByTitle = new Map(eventsInserted.map(ev => [ev.title, ev.id]));

  // 7) Event ↔ Tag links
  await db.insert(eventTagAssignments).values(
    mock.eventTagAssignments.flatMap(({ eventTitle, tags }) =>
      tags.map(name => ({
        eventId: eventByTitle.get(eventTitle)!,
        tagId: tagByName.get(name)!,
      }))
    )
  );

  // 8) Org members
  await db.insert(organizationMembers).values(
    mock.organizationMembers.map(m => ({
      userId: userByEmail.get(m.userEmail)!,
      organizationId: orgByName.get(m.org)!,
      role: m.role
    }))
  );

  console.log(' Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => sql.end());
