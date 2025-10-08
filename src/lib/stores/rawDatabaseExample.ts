// Example of auto-generated information Drizzle would get from our schema
export type User = {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'club_leader' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export type Organization = {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  contact_email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type OrganizationCategory = {
  id: string;
  name: 'academic' | 'cultural' | 'sports' | 'service' | 'special_interest';
  color: string; 
};

export type OrganizationCategoryAssignment = {
  organization_id: string;
  category_id: string;
};

export type Event = {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  location: string;
  start_time: Date;
  end_time: Date;
  is_private: boolean;
  max_capacity: number | null;
  registration_required: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export type EventTag = {
  id: string;
  name: string;
  color: string;
}

export type EventTagAssignment = {
  event_id: string;
  tag_id: string;
}

export type OrganizationMember = {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'member' | 'officer' | 'president' | 'advisor';
  joined_at: Date;
}

// Sample data that matches the raw types
export const users: User[] = [
  {
    id: 'user-1',
    email: 'sarah.chen@university.edu',
    full_name: 'Sarah Chen',
    role: 'student',
    created_at: new Date('2024-09-01T10:00:00Z'),
    updated_at: new Date('2024-09-01T10:00:00Z')
  },
  {
    id: 'user-2',
    email: 'mike.rodriguez@university.edu',
    full_name: 'Mike Rodriguez',
    role: 'club_leader',
    created_at: new Date('2024-08-15T10:00:00Z'),
    updated_at: new Date('2024-08-15T10:00:00Z')
  },
  {
    id: 'user-3',
    email: 'admin@university.edu',
    full_name: 'Campus Admin',
    role: 'admin',
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-01T10:00:00Z')
  }
];

export const organizationCategories: OrganizationCategory[] = [
  { id: 'cat-1', name: 'academic', color: '#3B82F6' },
  { id: 'cat-2', name: 'cultural', color: '#F97316' },
  { id: 'cat-3', name: 'sports', color: '#10B981' },
  { id: 'cat-4', name: 'service', color: '#6366F1' },
  { id: 'cat-5', name: 'special_interest', color: '#8B5CF6' },
];

export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Computer Science Club',
    description: 'A community for students interested in software development, algorithms, and tech careers',
    logo_url: null,
    contact_email: 'csclub@university.edu',
    is_active: true,
    created_at: new Date('2024-01-15T10:00:00Z'),
    updated_at: new Date('2024-01-15T10:00:00Z'),
  },
  {
    id: 'org-2',
    name: 'Latin Dance Society',
    description: 'Learn salsa, bachata, and other Latin dance styles',
    logo_url: null,
    contact_email: 'latindance@university.edu',
    is_active: true,
    created_at: new Date('2024-02-01T10:00:00Z'),
    updated_at: new Date('2024-02-01T10:00:00Z'),
  },
  {
    id: 'org-3',
    name: 'Environmental Action Coalition',
    description: 'Students working together for campus sustainability and environmental awareness',
    logo_url: null,
    contact_email: 'eac@university.edu',
    is_active: true,
    created_at: new Date('2024-01-20T10:00:00Z'),
    updated_at: new Date('2024-01-20T10:00:00Z'),
  },
  {
    id: 'org-4',
    name: 'Intramural Soccer League',
    description: 'Competitive and recreational soccer for all skill levels',
    logo_url: null,
    contact_email: 'soccer@university.edu',
    is_active: true,
    created_at: new Date('2024-03-01T10:00:00Z'),
    updated_at: new Date('2024-03-01T10:00:00Z'),
  },
  {
    id: 'org-5',
    name: 'Board Game Club',
    description: 'Weekly meetups to play strategy games, party games, and tabletop RPGs',
    logo_url: null,
    contact_email: 'boardgames@university.edu',
    is_active: true,
    created_at: new Date('2024-02-15T10:00:00Z'),
    updated_at: new Date('2024-02-15T10:00:00Z'),
  },
  {
    id: 'org-6',
    name: 'Career Development Center',
    description: 'Official university career services',
    logo_url: null,
    contact_email: 'careers@university.edu',
    is_active: true,
    created_at: new Date('2023-01-01T10:00:00Z'),
    updated_at: new Date('2023-01-01T10:00:00Z'),
  },
];

export const organizationCategoryAssignments: OrganizationCategoryAssignment[] = [
  { organization_id: 'org-1', category_id: 'cat-1' }, // CS Club → academic
  { organization_id: 'org-2', category_id: 'cat-2' }, // Latin Dance → cultural
  { organization_id: 'org-3', category_id: 'cat-4' }, // EAC → service
  { organization_id: 'org-3', category_id: 'cat-1' }, // EAC → academic too
  { organization_id: 'org-4', category_id: 'cat-3' }, // Soccer → sports
  { organization_id: 'org-5', category_id: 'cat-5' }, // Board Games → special interest
  { organization_id: 'org-6', category_id: 'cat-1' }, // Career Dev → academic
];


export const eventTags: EventTag[] = [
  { id: 'tag-1', name: 'networking', color: '#3B82F6' },
  { id: 'tag-2', name: 'workshop', color: '#8B5CF6' },
  { id: 'tag-3', name: 'social', color: '#EC4899' },
  { id: 'tag-4', name: 'fundraiser', color: '#10B981' },
  { id: 'tag-5', name: 'competition', color: '#F59E0B' },
  { id: 'tag-6', name: 'free-food', color: '#EF4444' },
  { id: 'tag-7', name: 'volunteer', color: '#14B8A6' },
  { id: 'tag-8', name: 'lecture', color: '#6366F1' }
];

export const events: Event[] = [
  {
    id: 'event-1',
    organization_id: 'org-1',
    title: 'Intro to Web Development Workshop',
    description: 'Learn the basics of HTML, CSS, and JavaScript. Perfect for beginners! We\'ll build a simple portfolio website together.',
    location: 'Engineering Building, Room 205',
    start_time: new Date('2025-10-05T14:00:00Z'),
    end_time: new Date('2025-10-05T16:00:00Z'),
    is_private: false,
    max_capacity: 30,
    registration_required: true,
    created_by: 'user-2',
    created_at: new Date('2025-09-20T10:00:00Z'),
    updated_at: new Date('2025-09-20T10:00:00Z')
  },
  {
    id: 'event-2',
    organization_id: 'org-2',
    title: 'Salsa Night Social',
    description: 'Join us for an evening of salsa dancing! Beginners welcome - we\'ll teach basic steps at the start.',
    location: 'Student Center Ballroom',
    start_time: new Date('2025-10-03T19:00:00Z'),
    end_time: new Date('2025-10-03T22:00:00Z'),
    is_private: false,
    max_capacity: null,
    registration_required: false,
    created_by: 'user-2',
    created_at: new Date('2025-09-25T10:00:00Z'),
    updated_at: new Date('2025-09-25T10:00:00Z')
  },
  {
    id: 'event-3',
    organization_id: 'org-3',
    title: 'Campus Cleanup Day',
    description: 'Help us make our campus beautiful! Volunteer for our monthly cleanup event. Supplies and refreshments provided.',
    location: 'Meet at Main Quad',
    start_time: new Date('2025-10-07T09:00:00Z'),
    end_time: new Date('2025-10-07T12:00:00Z'),
    is_private: false,
    max_capacity: null,
    registration_required: false,
    created_by: 'user-2',
    created_at: new Date('2025-09-22T10:00:00Z'),
    updated_at: new Date('2025-09-22T10:00:00Z')
  },
  {
    id: 'event-4',
    organization_id: 'org-1',
    title: 'Tech Career Fair Prep Session',
    description: 'Get ready for the upcoming career fair! Resume reviews, interview tips, and networking strategies.',
    location: 'Library, Study Room 3A',
    start_time: new Date('2025-10-01T17:00:00Z'),
    end_time: new Date('2025-10-01T18:30:00Z'),
    is_private: false,
    max_capacity: null,
    registration_required: true,
    created_by: 'user-2',
    created_at: new Date('2025-09-18T10:00:00Z'),
    updated_at: new Date('2025-09-18T10:00:00Z')
  },
  {
    id: 'event-5',
    organization_id: 'org-4',
    title: 'Soccer Tournament Finals',
    description: 'Championship game of the fall intramural season! Come support your favorite team.',
    location: 'West Field',
    start_time: new Date('2025-10-10T15:00:00Z'),
    end_time: new Date('2025-10-10T17:00:00Z'),
    is_private: false,
    max_capacity: null,
    registration_required: false,
    created_by: 'user-2',
    created_at: new Date('2025-09-15T10:00:00Z'),
    updated_at: new Date('2025-09-15T10:00:00Z')
  },
  {
    id: 'event-6',
    organization_id: 'org-5',
    title: 'Board Game Night',
    description: 'Weekly game night! This week featuring Catan, Ticket to Ride, and Codenames. All experience levels welcome.',
    location: 'Student Lounge, 2nd Floor',
    start_time: new Date('2025-10-04T18:00:00Z'),
    end_time: new Date('2025-10-04T21:00:00Z'),
    is_private: false,
    max_capacity: null,
    registration_required: false,
    created_by: 'user-2',
    created_at: new Date('2025-09-27T10:00:00Z'),
    updated_at: new Date('2025-09-27T10:00:00Z')
  },
  {
    id: 'event-7',
    organization_id: 'org-6',
    title: 'Resume Workshop',
    description: 'Learn how to craft a compelling resume that gets interviews. Bring your laptop for hands-on editing.',
    location: 'Career Center',
    start_time: new Date('2025-10-02T13:00:00Z'),
    end_time: new Date('2025-10-02T14:30:00Z'),
    is_private: false,
    max_capacity: 25,
    registration_required: true,
    created_by: 'user-3',
    created_at: new Date('2025-09-15T10:00:00Z'),
    updated_at: new Date('2025-09-15T10:00:00Z')
  },
  {
    id: 'event-8',
    organization_id: 'org-3',
    title: 'Climate Change Speaker Series',
    description: 'Dr. Maria Santos from the Environmental Science Department discusses local climate action. Q&A to follow.',
    location: 'Science Building Auditorium',
    start_time: new Date('2025-10-08T16:00:00Z'),
    end_time: new Date('2025-10-08T17:30:00Z'),
    is_private: false,
    max_capacity: null,
    registration_required: false,
    created_by: 'user-2',
    created_at: new Date('2025-09-20T10:00:00Z'),
    updated_at: new Date('2025-09-20T10:00:00Z')
  },
  {
    id: 'event-9',
    organization_id: 'org-1',
    title: 'Hackathon Kickoff',
    description: '24-hour coding marathon! Form teams, build projects, compete for prizes. Pizza and energy drinks provided.',
    location: 'Engineering Building',
    start_time: new Date('2025-10-12T18:00:00Z'),
    end_time: new Date('2025-10-13T18:00:00Z'),
    is_private: false,
    max_capacity: 100,
    registration_required: true,
    created_by: 'user-2',
    created_at: new Date('2025-09-10T10:00:00Z'),
    updated_at: new Date('2025-09-10T10:00:00Z')
  },
  {
    id: 'event-10',
    organization_id: 'org-2',
    title: 'Bachata Technique Workshop',
    description: 'Members-only advanced technique workshop focusing on turns and body movement.',
    location: 'Dance Studio B',
    start_time: new Date('2025-10-06T15:00:00Z'),
    end_time: new Date('2025-10-06T17:00:00Z'),
    is_private: true,
    max_capacity: 20,
    registration_required: true,
    created_by: 'user-2',
    created_at: new Date('2025-09-23T10:00:00Z'),
    updated_at: new Date('2025-09-23T10:00:00Z')
  },
  {
    id: 'event-11',
    organization_id: 'org-5',
    title: 'Dungeons & Dragons Campaign Start',
    description: 'Starting a new D&D 5e campaign! New players welcome, characters will be created together.',
    location: 'Student Lounge, 2nd Floor',
    start_time: new Date('2025-10-09T19:00:00Z'),
    end_time: new Date('2025-10-09T22:00:00Z'),
    is_private: false,
    max_capacity: 6,
    registration_required: true,
    created_by: 'user-2',
    created_at: new Date('2025-09-28T10:00:00Z'),
    updated_at: new Date('2025-09-28T10:00:00Z')
  },
  {
    id: 'event-12',
    organization_id: 'org-3',
    title: 'E-Waste Collection Drive',
    description: 'Bring your old electronics for responsible recycling. Accepting phones, laptops, cables, and more.',
    location: 'Parking Lot C',
    start_time: new Date('2025-10-11T10:00:00Z'),
    end_time: new Date('2025-10-11T14:00:00Z'),
    is_private: false,
    max_capacity: null,
    registration_required: false,
    created_by: 'user-2',
    created_at: new Date('2025-09-19T10:00:00Z'),
    updated_at: new Date('2025-09-19T10:00:00Z')
  }
];

export const eventTagAssignments: EventTagAssignment[] = [
  { event_id: 'event-1', tag_id: 'tag-2' },
  { event_id: 'event-1', tag_id: 'tag-6' },
  { event_id: 'event-2', tag_id: 'tag-3' },
  { event_id: 'event-3', tag_id: 'tag-7' },
  { event_id: 'event-4', tag_id: 'tag-1' },
  { event_id: 'event-4', tag_id: 'tag-2' },
  { event_id: 'event-5', tag_id: 'tag-5' },
  { event_id: 'event-6', tag_id: 'tag-3' },
  { event_id: 'event-6', tag_id: 'tag-6' },
  { event_id: 'event-7', tag_id: 'tag-2' },
  { event_id: 'event-7', tag_id: 'tag-1' },
  { event_id: 'event-8', tag_id: 'tag-8' },
  { event_id: 'event-9', tag_id: 'tag-5' },
  { event_id: 'event-9', tag_id: 'tag-6' },
  { event_id: 'event-10', tag_id: 'tag-2' },
  { event_id: 'event-11', tag_id: 'tag-3' },
  { event_id: 'event-12', tag_id: 'tag-7' },
  { event_id: 'event-12', tag_id: 'tag-4' }
];

export const organizationMembers: OrganizationMember[] = [
  {
    id: 'om-1',
    user_id: 'user-2',
    organization_id: 'org-1',
    role: 'president',
    joined_at: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 'om-2',
    user_id: 'user-1',
    organization_id: 'org-1',
    role: 'member',
    joined_at: new Date('2024-09-01T10:00:00Z')
  },
  {
    id: 'om-3',
    user_id: 'user-1',
    organization_id: 'org-2',
    role: 'member',
    joined_at: new Date('2024-09-10T10:00:00Z')
  }
];

