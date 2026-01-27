/**
 * Mock event data
 */

import type { Event } from '$lib/types/index.js';

/**
 * Mock events
 * Used in cards, lists, dialogs, and detail pages
 */
export const mockEvents: Event[] = [
	{
		id: 'test-1',
		title: 'Minimal Event',
		location: 'Test Location',
		startTime: '2025-12-01T10:00:00Z',
		endTime: '2025-12-01T11:00:00Z',
		organizations: [],
		tags: []
	},
	{
		id: 'event-1',
		title: 'Intro to Web Development Workshop',
		description:
			'Learn the fundamentals of modern web development! This hands-on workshop covers HTML5, CSS3, and JavaScript ES6+. Perfect for beginners with no prior coding experience. We will build a fully responsive personal portfolio website from scratch. Bring your laptop and get ready to code!',
		location: 'Engineering Building, Room 205',
		startTime: '2025-10-05T14:00:00Z',
		endTime: '2025-10-05T16:00:00Z',
		attendeeCount: 45,
		imageUrl: null,
		tags: [
			{ id: 'tag-workshop', name: 'workshop', color: '#8B5CF6' },
			{ id: 'tag-free-food', name: 'free-food', color: '#EF4444' }
		],
		organizations: [
			{ id: 'org-1', name: 'Computer Science Club', abbreviation: 'CS', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-2',
		title: 'Salsa Night Social Dance Experience',
		description:
			'Join us for an evening of salsa dancing! No partner or experience needed. Our instructors will teach basic steps and turns at the beginning of the night, then we will have open dancing with a live DJ. Come meet new friends, get some exercise, and have fun!',
		location: 'Student Center Ballroom',
		startTime: '2025-10-03T19:00:00Z',
		endTime: '2025-10-03T22:00:00Z',
		attendeeCount: 92,
		imageUrl:
			'https://www.laconservancy.org/wp-content/uploads/2022/10/Cal-Poly-Pomona_ARG-scaled.jpg',
		tags: [{ id: 'tag-social', name: 'social', color: '#EC4899' }],
		organizations: [
			{ id: 'org-2', name: 'Latin Dance Society', abbreviation: 'LDS', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-3',
		title: 'Campus Cleanup Day',
		description: 'Help us make our campus beautiful',
		location: 'Meet at Main Quad',
		startTime: '2025-10-07T09:00:00Z',
		endTime: '2025-10-07T12:00:00Z',
		attendeeCount: 78,
		imageUrl: null,
		tags: [{ id: 'tag-volunteer', name: 'volunteer', color: '#14B8A6' }],
		organizations: [
			{ id: 'org-17', name: 'Environmental Action Coalition', abbreviation: 'EAC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-4',
		title:
			'Tech Career Fair Preparation Workshop: Resume Reviews, Mock Interviews, and Networking Strategies',
		description:
			'Get ready for the upcoming career fair with this comprehensive prep session. We will cover resume optimization, behavioral interview techniques, technical interview preparation, and effective networking strategies. Industry professionals will be available for one-on-one resume reviews. This is a co-hosted event with multiple student organizations!',
		location: 'Library, Study Room 3A',
		startTime: '2025-10-01T17:00:00Z',
		endTime: '2025-10-01T18:30:00Z',
		attendeeCount: 67,
		imageUrl: null,
		tags: [
			{ id: 'tag-networking', name: 'networking', color: '#3B82F6' },
			{ id: 'tag-workshop', name: 'workshop', color: '#8B5CF6' }
		],
		organizations: [
			{
				id: 'org-1',
				name: 'Computer Science Club',
				abbreviation: 'CS',
				logoUrl: null
			},
			{
				id: 'org-8',
				name: 'Computer Science Society',
				abbreviation: 'CSS',
				logoUrl: 'https://cppcss.club/images/logo_for_web_2_2025.png'
			},
			{
				id: 'org-6',
				name: 'Career Development Center',
				abbreviation: 'CDC',
				logoUrl: null
			}
		]
	},
	{
		id: 'event-5',
		title: 'Intramural Soccer Championship Finals',
		description:
			'Championship game of the fall intramural season! Watch as the top two teams battle it out for the trophy. Free admission for all students. Concessions will be available. Come support your fellow Broncos and enjoy an exciting afternoon of competitive soccer!',
		location: 'West Field',
		startTime: '2025-10-10T15:00:00Z',
		endTime: '2025-10-10T17:00:00Z',
		attendeeCount: 234,
		imageUrl:
			'https://www.laconservancy.org/wp-content/uploads/2022/10/Cal-Poly-Pomona_ARG-scaled.jpg',
		tags: [{ id: 'tag-competition', name: 'competition', color: '#F59E0B' }],
		organizations: [
			{ id: 'org-soccer', name: 'Intramural Soccer League', abbreviation: 'ISL', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-6',
		title: 'Board Game Night',
		description:
			'Weekly game night featuring classics like Catan, Ticket to Ride, Codenames, and Pandemic. All skill levels welcome! This week we are also introducing some new games from our recent collection. Snacks and drinks provided. Great opportunity to meet new people and have fun!',
		location: 'Student Lounge, 2nd Floor',
		startTime: '2025-10-04T18:00:00Z',
		endTime: '2025-10-04T21:00:00Z',
		attendeeCount: 54,
		imageUrl: null,
		tags: [
			{ id: 'tag-social', name: 'social', color: '#EC4899' },
			{ id: 'tag-free-food', name: 'free-food', color: '#EF4444' }
		],
		organizations: [
			{ id: 'org-boardgame', name: 'Board Game Club', abbreviation: 'BGC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-7',
		title: 'Resume Workshop',
		description:
			'Learn how to craft a compelling resume that gets you interviews! Our career counselors will cover resume formatting, action verbs, quantifying achievements, and tailoring your resume for specific positions. Bring your laptop for hands-on editing and personalized feedback. Limited spots available!',
		location: 'Career Center',
		startTime: '2025-10-02T13:00:00Z',
		endTime: '2025-10-02T14:30:00Z',
		attendeeCount: 89,
		imageUrl: null,
		tags: [
			{ id: 'tag-workshop', name: 'workshop', color: '#8B5CF6' },
			{ id: 'tag-networking', name: 'networking', color: '#3B82F6' }
		],
		organizations: [
			{ id: 'org-cdc', name: 'Career Development Center', abbreviation: 'CDC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-8',
		title: 'Climate Change and Local Environmental Action: A Speaker Series',
		description:
			'Dr. Maria Santos from the Environmental Science Department presents the latest research on climate change impacts in Southern California and what we can do locally to make a difference. The talk will cover sustainable practices, campus initiatives, and opportunities for student involvement in environmental advocacy. Q&A session to follow.',
		location: 'Science Building Auditorium',
		startTime: '2025-10-08T16:00:00Z',
		endTime: '2025-10-08T17:30:00Z',
		attendeeCount: 156,
		imageUrl: null,
		tags: [{ id: 'tag-lecture', name: 'lecture', color: '#6366F1' }],
		organizations: [
			{ id: 'org-17', name: 'Environmental Action Coalition', abbreviation: 'EAC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-9',
		title: 'BroncoHacks 2025: 24-Hour Hackathon Challenge',
		description:
			'Join us for our biggest hackathon of the year! 24 hours of non-stop coding, collaboration, and creativity. Form teams of up to 4, build innovative projects, and compete for amazing prizes including $5000 in total cash prizes, tech gear, and company swag. Free meals, snacks, and energy drinks provided throughout the event. Workshops on AI/ML, web development, and mobile apps. Beginners welcome!',
		location: 'Engineering Building - Multiple Rooms',
		startTime: '2025-10-12T18:00:00Z',
		endTime: '2025-10-13T18:00:00Z',
		attendeeCount: 287,
		imageUrl:
			'https://www.laconservancy.org/wp-content/uploads/2022/10/Cal-Poly-Pomona_ARG-scaled.jpg',
		tags: [
			{ id: 'tag-competition', name: 'competition', color: '#F59E0B' },
			{ id: 'tag-free-food', name: 'free-food', color: '#EF4444' }
		],
		organizations: [
			{
				id: 'org-1',
				name: 'Computer Science Club',
				abbreviation: 'CS',
				logoUrl: null
			},
			{
				id: 'org-7',
				name: 'Software Engineering Association',
				abbreviation: 'SEA',
				logoUrl: null
			}
		]
	},
	{
		id: 'event-10',
		title: 'Advanced Bachata Technique Workshop',
		description:
			'Members-only advanced technique workshop focusing on intricate footwork patterns, body movement, and partnering techniques. This workshop is designed for dancers with at least 6 months of experience. We will work on improving musicality and connection with your partner.',
		location: 'Dance Studio B',
		startTime: '2025-10-06T15:00:00Z',
		endTime: '2025-10-06T17:00:00Z',
		attendeeCount: 43,
		imageUrl: null,
		tags: [{ id: 'tag-workshop', name: 'workshop', color: '#8B5CF6' }],
		organizations: [
			{ id: 'org-2', name: 'Latin Dance Society', abbreviation: 'LDS', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-11',
		title: 'D&D',
		description: 'Starting a new D&D 5e campaign',
		location: 'Student Lounge, 2nd Floor',
		startTime: '2025-10-09T19:00:00Z',
		endTime: '2025-10-09T22:00:00Z',
		attendeeCount: 32,
		imageUrl: null,
		tags: [{ id: 'tag-social', name: 'social', color: '#EC4899' }],
		organizations: [
			{ id: 'org-boardgame', name: 'Board Game Club', abbreviation: 'BGC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-12',
		title: 'E-Waste Collection Drive',
		description:
			'Bring your old electronics for responsible recycling! We are accepting old phones, laptops, tablets, cables, chargers, and other electronic devices. All items will be properly recycled to prevent harmful materials from entering landfills. Help keep our campus and community green!',
		location: 'Parking Lot C',
		startTime: '2025-10-11T10:00:00Z',
		endTime: '2025-10-11T14:00:00Z',
		attendeeCount: 91,
		imageUrl: null,
		tags: [
			{ id: 'tag-volunteer', name: 'volunteer', color: '#14B8A6' },
			{ id: 'tag-fundraiser', name: 'fundraiser', color: '#10B981' }
		],
		organizations: [
			{ id: 'org-17', name: 'Environmental Action Coalition', abbreviation: 'EAC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-13',
		title: 'Industry Networking Mixer',
		description:
			'Connect with professionals from leading tech companies. This networking event features recruiters and engineers from Google, Microsoft, Amazon, and other major employers.',
		location: 'Business Building Courtyard',
		startTime: '2025-10-15T17:00:00Z',
		endTime: '2025-10-15T20:00:00Z',
		attendeeCount: 78,
		imageUrl: null,
		tags: [
			{ id: 'tag-networking', name: 'networking', color: '#3B82F6' },
			{ id: 'tag-free-food', name: 'free-food', color: '#EF4444' }
		],
		organizations: [
			{ id: 'org-18', name: 'Entrepreneurship Club', abbreviation: 'EC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-14',
		title: 'Basketball Tournament',
		description:
			'Annual 3v3 basketball tournament! Form your team and compete for prizes. All skill levels welcome.',
		location: 'Recreation Center Courts',
		startTime: '2025-10-16T09:00:00Z',
		endTime: '2025-10-16T17:00:00Z',
		attendeeCount: 64,
		imageUrl: null,
		tags: [{ id: 'tag-competition', name: 'competition', color: '#F59E0B' }],
		organizations: [{ id: 'org-12', name: 'Basketball Club', abbreviation: 'BBC', logoUrl: null }],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-15',
		title: 'Anime Convention Trip',
		description:
			'Group trip to Anime Expo in Los Angeles! Transportation and convention badges included. Limited spots available.',
		location: 'Meet at Parking Structure 2',
		startTime: '2025-10-18T08:00:00Z',
		endTime: '2025-10-18T22:00:00Z',
		attendeeCount: 28,
		imageUrl: null,
		tags: [{ id: 'tag-social', name: 'social', color: '#EC4899' }],
		organizations: [
			{ id: 'org-16', name: 'Anime and Manga Club', abbreviation: 'AMC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-16',
		title: 'Python Crash Course',
		description:
			'Intensive one-day Python workshop covering basics to intermediate concepts. Perfect for beginners looking to learn programming!',
		location: 'Computer Lab, Building 9',
		startTime: '2025-10-20T10:00:00Z',
		endTime: '2025-10-20T15:00:00Z',
		attendeeCount: 52,
		imageUrl: null,
		tags: [
			{ id: 'tag-workshop', name: 'workshop', color: '#8B5CF6' },
			{ id: 'tag-free-food', name: 'free-food', color: '#EF4444' }
		],
		organizations: [
			{
				id: 'org-8',
				name: 'Computer Science Society',
				abbreviation: 'CSS',
				logoUrl: 'https://cppcss.club/images/logo_for_web_2_2025.png'
			}
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-17',
		title: 'Guest Lecture: Machine Learning in Industry',
		description:
			'Hear from a Google ML engineer about real-world applications of machine learning and AI. Q&A session included.',
		location: 'Engineering Building Auditorium',
		startTime: '2025-10-22T14:00:00Z',
		endTime: '2025-10-22T16:00:00Z',
		attendeeCount: 142,
		imageUrl: null,
		tags: [{ id: 'tag-lecture', name: 'lecture', color: '#6366F1' }],
		organizations: [
			{ id: 'org-1', name: 'Computer Science Club', abbreviation: 'CS', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-18',
		title: 'Community Beach Cleanup',
		description:
			'Help clean up our local beaches! All supplies provided. Earn community service hours.',
		location: 'Huntington Beach - Meet at Pier',
		startTime: '2025-10-23T08:00:00Z',
		endTime: '2025-10-23T12:00:00Z',
		attendeeCount: 45,
		imageUrl: null,
		tags: [{ id: 'tag-volunteer', name: 'volunteer', color: '#14B8A6' }],
		organizations: [
			{ id: 'org-17', name: 'Environmental Action Coalition', abbreviation: 'EAC', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-19',
		title: 'Filipino Cultural Night',
		description:
			'Experience Filipino culture through traditional dances, music, and authentic cuisine. A showcase of Filipino heritage and artistry.',
		location: 'Bronco Student Center Theatre',
		startTime: '2025-10-25T18:00:00Z',
		endTime: '2025-10-25T21:00:00Z',
		attendeeCount: 234,
		imageUrl: null,
		tags: [
			{ id: 'tag-social', name: 'social', color: '#EC4899' },
			{ id: 'tag-free-food', name: 'free-food', color: '#EF4444' }
		],
		organizations: [
			{
				id: 'org-15',
				name: 'Filipino Cultural Night Committee',
				abbreviation: 'FCN',
				logoUrl: null
			}
		],
		rsvpUrl: null,
		feedbackUrl: null
	},
	{
		id: 'event-20',
		title: 'Coding Challenge Competition',
		description:
			'Test your programming skills in this timed coding competition. Solve algorithmic problems and win prizes!',
		location: 'Online via Zoom',
		startTime: '2025-10-27T13:00:00Z',
		endTime: '2025-10-27T17:00:00Z',
		attendeeCount: 87,
		imageUrl: null,
		tags: [{ id: 'tag-competition', name: 'competition', color: '#F59E0B' }],
		organizations: [
			{ id: 'org-7', name: 'Software Engineering Association', abbreviation: 'SEA', logoUrl: null }
		],
		rsvpUrl: null,
		feedbackUrl: null
	}
];

/**
 * Example co-hosted event for testing multi-organization events
 */
export const exampleCoHostedEvent: Event = {
	id: 'event-example-cohost',
	title: 'This is an example event',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	location: 'Insert a longer than usual location name',
	startTime: '2025-11-03T12:00:00Z',
	endTime: '2025-11-07T16:00:00Z',
	attendeeCount: 127,
	imageUrl:
		'https://educationsnapshots.com/wp-content/uploads/sites/4/2020/07/cal-poly-pomona-student-housing-phase-i-dining-commons-1-700x467.jpg',
	tags: [
		{ id: 'tag-upcoming', name: 'Upcoming', color: '#8B5CF6' },
		{ id: 'tag-featured', name: 'Featured', color: '#3B82F6' },
		{ id: 'tag-special', name: 'Special', color: '#10B981' }
	],
	organizations: [
		{
			id: 'org-7',
			name: 'Software Engineering Association',
			abbreviation: 'SEA',
			logoUrl: null
		},
		{
			id: 'org-8',
			name: 'Computer Science Society',
			abbreviation: 'CSS',
			logoUrl: 'https://cppcss.club/images/logo_for_web_2_2025.png'
		},
		{
			id: 'org-cpp',
			name: 'Cal Poly Pomona',
			abbreviation: 'CPP',
			logoUrl: 'https://logos-world.net/wp-content/uploads/2025/02/Cal-Poly-Pomona-Symbol.png'
		}
	],
	rsvpUrl: null,
	feedbackUrl: null
};

/**
 * Get event by ID
 * Returns the event or throws if not found
 */
export function getEvent(id: string): Event {
	const event = mockEvents.find((e) => e.id === id);
	if (event) return event;

	// Check for special example event
	if (id === 'event-example-cohost') return exampleCoHostedEvent;

	// Fallback if event not found
	throw new Error(`Event with id ${id} not found`);
}
