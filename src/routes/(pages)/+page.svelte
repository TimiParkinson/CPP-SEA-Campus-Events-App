<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import CTA from '$lib/components/home/CTA.svelte';
	import Featured from '$lib/components/cards/Featured.svelte';

	const mockOrgs = [
		{
			id: 'org-1',
			name: 'Computer Science Club',
			description:
				'A community for students interested in software development, algorithms, and tech careers. Join us for weekly coding sessions!',
			logoUrl: 'https://cppcss.club/images/logo_for_web_2_2025.png',
			abbreviation: 'CSS',
			categories: [
				{ name: 'academic', color: '#3B82F6' },
				{ name: 'technology', color: '#8B5CF6' }
			],
			memberCount: 156,
			establishedDate: new Date('2020-11-02'),
			websiteUrl: 'https://csclub.university.edu',
			contactEmail: 'csclub@university.edu'
		},
		{
			id: 'org-2',
			name: 'Software Engineering Association',
			description: 'Building the future of software, one line at a time.',
			logoUrl: 'https://logos-world.net/wp-content/uploads/2025/02/Cal-Poly-Pomona-Symbol.png',
			abbreviation: 'SEA',
			categories: [{ name: 'technology', color: '#8B5CF6' }],
			memberCount: 89,
			establishedDate: new Date('2019-08-15'),
			websiteUrl: 'https://sea.university.edu',
			contactEmail: 'sea@university.edu'
		},
		{
			id: 'org-3',
			name: 'SheCodes',
			description: 'Empowering women in technology.',
			logoUrl: null,
			categories: [
				{ name: 'diversity', color: '#EC4899' },
				{ name: 'technology', color: '#8B5CF6' }
			],
			memberCount: 67,
			establishedDate: new Date('2021-02-14'),
			contactEmail: 'shecodes@university.edu'
		},
		{
			id: 'org-4',
			name: 'Game Development Guild',
			description: 'Create, play, and learn game development together.',
			logoUrl: null,
			abbreviation: 'GDG',
			categories: [
				{ name: 'technology', color: '#8B5CF6' },
				{ name: 'creative', color: '#F59E0B' }
			],
			memberCount: 45,
			contactEmail: 'gdg@university.edu'
		},
		{
			id: 'org-5',
			name: 'Data Science Society',
			description: 'Exploring the world of data, AI, and machine learning.',
			logoUrl: null,
			abbreviation: 'DSS',
			categories: [
				{ name: 'academic', color: '#3B82F6' },
				{ name: 'technology', color: '#8B5CF6' }
			],
			memberCount: 92,
			contactEmail: 'dss@university.edu'
		}
	];

	const mockEvents = [
		{
			id: 'event-1',
			title: 'Intro to Web Development Workshop',
			description:
				"Learn the basics of HTML, CSS, and JavaScript. Perfect for beginners! We'll build a simple portfolio website together.",
			location: 'Engineering Building, Room 205',
			startTime: '2025-11-20T14:00:00Z',
			endTime: '2025-11-20T16:00:00Z',
			attendeeCount: 45,
			imageUrl: 'https://www.cpp.edu/news/img/news/2021/05/20CLASS-grad13-scaled.jpg',
			tags: [
				{ name: 'workshop', color: '#8B5CF6' },
				{ name: 'free-food', color: '#EF4444' }
			],
			organization: { name: 'Computer Science Club' }
		},
		{
			id: 'event-2',
			title: 'Salsa Night Social',
			description:
				"Join us for an evening of salsa dancing! Beginners welcome - we'll teach basic steps at the start.",
			location: 'Student Center Ballroom',
			startTime: '2025-11-22T19:00:00Z',
			endTime: '2025-11-22T22:00:00Z',
			attendeeCount: 127,
			imageUrl: null,
			tags: [{ name: 'social', color: '#EC4899' }],
			organization: { name: 'Latin Dance Society' }
		},
		{
			id: 'event-3',
			title: 'Salsa Night Social',
			description:
				"Join us for an evening of salsa dancing! Beginners welcome - we'll teach basic steps at the start.",
			location: 'Student Center Ballroom',
			startTime: '2025-11-22T19:00:00Z',
			endTime: '2025-11-22T22:00:00Z',
			attendeeCount: 127,
			imageUrl: null,
			tags: [{ name: 'social', color: '#EC4899' }],
			organization: { name: 'Latin Dance Society' }
		},
		{
			id: 'event-4',
			title: 'Salsa Night Social',
			description:
				"Join us for an evening of salsa dancing! Beginners welcome - we'll teach basic steps at the start.",
			location: 'Student Center Ballroom',
			startTime: '2025-11-22T19:00:00Z',
			endTime: '2025-11-22T22:00:00Z',
			attendeeCount: 127,
			imageUrl: null,
			tags: [{ name: 'social', color: '#EC4899' }],
			organization: { name: 'Latin Dance Society' }
		}
	];

	// Featured content (choose from mock data for now)
	const featuredOrgs = mockOrgs.slice(0, 5);
	const featuredEvents = mockEvents.slice(0, 4);
</script>

<svelte:head>
	<title>Campus Events</title>
	<meta
		name="description"
		content="Explore campus events, clubs, and opportunities at Cal Poly Pomona"
	/>
</svelte:head>

<div class="bg-black">
	<Hero />
	<Featured variant="orgs" organizations={featuredOrgs} />
	<Featured variant="events" events={featuredEvents} />
	<CTA />
</div>
