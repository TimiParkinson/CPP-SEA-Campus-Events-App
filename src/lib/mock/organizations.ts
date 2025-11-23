/**
 * Mock organization data
 */

import type { Organization } from '$lib/types/index.js';

/**
 * Mock organizations with complete data
 */
export const mockOrganizations: Organization[] = [
	{
		id: 'org-1',
		name: 'Computer Science Club',
		description:
			'A community for students interested in software development, algorithms, and tech careers. We host weekly coding sessions, tech talks, hackathons, and networking events with industry professionals.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'CS',
		categories: [{ id: 'cat-academic', name: 'Academic', color: '#3B82F6' }],
		memberCount: 156,
		establishedDate: new Date('2018-09-15'),
		websiteUrl: null,
		contactEmail: 'csclub@cpp.edu',
		boardMembers: [
			{ name: 'Alex Johnson', role: 'President' },
			{ name: 'Sam Chen', role: 'Vice President' },
			{ name: 'Jordan Lee', role: 'Treasurer' }
		],
		feedbackUrl: null
	},
	{
		id: 'org-2',
		name: 'Latin Dance Society',
		description:
			'Learn salsa, bachata, merengue, and other Latin dance styles in a welcoming, energetic environment. No experience required - we welcome dancers of all levels!',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'LDS',
		categories: [{ id: 'cat-cultural', name: 'Cultural', color: '#F97316' }],
		memberCount: 127,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-3',
		name: 'Environmental Action Coalition',
		description:
			'Students working together for campus sustainability and environmental awareness. We organize cleanups, educational workshops, and advocacy campaigns to make Cal Poly Pomona greener.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'EAC',
		categories: [
			{ id: 'cat-service', name: 'Service', color: '#6366F1' },
			{ id: 'cat-academic', name: 'Academic', color: '#3B82F6' }
		],
		memberCount: 89,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-4',
		name: 'Intramural Soccer League',
		description: 'Competitive and recreational soccer for all skill levels',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'ISL',
		categories: [{ id: 'cat-sports', name: 'Sports', color: '#10B981' }],
		memberCount: 234,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-5',
		name: 'Board Game Club',
		description: 'Weekly meetups to play strategy games, party games, and tabletop RPGs',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'BGC',
		categories: [{ id: 'cat-special-interest', name: 'Special Interest', color: '#8B5CF6' }],
		memberCount: 78,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-6',
		name: 'Career Development Center',
		description: 'Official university career services',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'CDC',
		categories: [{ id: 'cat-academic', name: 'Academic', color: '#3B82F6' }],
		memberCount: 45,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-7',
		name: 'Software Engineering Association',
		description:
			'The Software Engineering Association focuses on practical software engineering skills and industry best practices. We organize workshops on Git, CI/CD, system design, and agile development methodologies.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'SEA',
		categories: [
			{ id: 'cat-academic', name: 'Academic', color: '#3B82F6' },
			{ id: 'cat-technology', name: 'Technology', color: '#8B5CF6' }
		],
		memberCount: 203,
		establishedDate: new Date('2019-03-15'),
		websiteUrl: null,
		contactEmail: 'sea@cpp.edu',
		boardMembers: [
			{ name: 'David Park', role: 'President' },
			{ name: 'Lisa Wang', role: 'Vice President' },
			{ name: 'Marcus Brown', role: 'Technical Lead' }
		],
		feedbackUrl: null
	},
	{
		id: 'org-8',
		name: 'Computer Science Society',
		description:
			'The Computer Science Society is dedicated to fostering a vibrant community of students passionate about computer science, software engineering, and technology innovation. We provide a supportive environment for learning, collaboration, and professional growth. Our organization hosts weekly coding sessions where members work on personal projects, prepare for technical interviews, and learn new technologies together. We organize tech talks featuring industry professionals from leading companies like Google, Amazon, and Microsoft who share insights about their career journeys and the latest trends in technology. Our annual hackathons bring together hundreds of students to build innovative projects and compete for prizes. We also offer mentorship programs pairing experienced members with newcomers, networking events connecting students with potential employers, and study groups for challenging CS courses. Whether you are a beginner just starting to code or an experienced developer, CSS welcomes all students who share our passion for technology. Join us to enhance your technical skills, build your professional network, and have fun while learning!',
		logoUrl: 'https://cppcss.club/images/logo_for_web_2_2025.png',
		bannerImageUrl: 'https://www.laconservancy.org/wp-content/uploads/2022/10/Cal-Poly-Pomona_ARG-scaled.jpg',
		abbreviation: 'CSS',
		categories: [
			{ id: 'cat-academic', name: 'Academic', color: '#3B82F6' },
			{ id: 'cat-technology', name: 'Technology', color: '#8B5CF6' }
		],
		memberCount: 189,
		establishedDate: new Date('2020-11-02'),
		websiteUrl: 'https://cppcss.club',
		contactEmail: 'contact@cppcss.club',
		boardMembers: [
			{ name: 'John Doe', role: 'President' },
			{ name: 'Jane Smith', role: 'Vice President' },
			{ name: 'Mike Johnson', role: 'Treasurer' },
			{ name: 'Sarah Williams', role: 'Secretary' },
			{ name: 'Alex Chen', role: 'Project Manager' },
			{ name: 'Emily Davis', role: 'Marketing Lead' },
			{ name: 'Chris Brown', role: 'Outreach Coordinator' },
			{ name: 'Taylor Garcia', role: 'Faculty Advisor' },
			{ name: 'Morgan Lee', role: 'Events Coordinator' },
			{ name: 'Jordan Martinez', role: 'Workshop Lead' },
			{ name: 'Casey Thompson', role: 'Community Manager' }
		],
		feedbackUrl: null
	},
	{
		id: 'org-9',
		name: 'Extremely Long Organization Name That Should Test UI Wrapping and Truncation Behavior',
		description: 'Short description',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'ELONTSTUWATB',
		categories: [{ id: 'cat-special-interest', name: 'Special Interest', color: '#8B5CF6' }],
		memberCount: 12,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-10',
		name: 'Habitat for Humanity',
		description:
			'Build homes, communities, and hope. Join us in making a difference through volunteer construction projects and community outreach programs.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'HFH',
		categories: [{ id: 'cat-service', name: 'Service', color: '#6366F1' }],
		memberCount: 85,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-11',
		name: 'Community Service Coalition',
		description:
			'Dedicated to making a positive impact through volunteer work, community partnerships, and service projects that benefit local neighborhoods.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'CSC',
		categories: [{ id: 'cat-service', name: 'Service', color: '#6366F1' }],
		memberCount: 112,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-12',
		name: 'Basketball Club',
		description:
			'Competitive and recreational basketball for all skill levels. Join us for weekly pickup games, tournaments, and skill development sessions.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'BBC',
		categories: [{ id: 'cat-sports', name: 'Sports', color: '#10B981' }],
		memberCount: 94,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-13',
		name: 'Ultimate Frisbee Team',
		description:
			'High-energy ultimate frisbee games and tournaments. No experience necessary - come learn and have fun!',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'UFT',
		categories: [{ id: 'cat-sports', name: 'Sports', color: '#10B981' }],
		memberCount: 67,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-14',
		name: 'Chinese Student Association',
		description:
			'Celebrating Chinese culture through events, language practice, cultural performances, and community building.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'CSA',
		categories: [{ id: 'cat-cultural', name: 'Cultural', color: '#F97316' }],
		memberCount: 143,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-15',
		name: 'Filipino Cultural Night Committee',
		description:
			'Showcasing Filipino heritage through our annual cultural night featuring traditional dances, music, and cuisine.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'FCN',
		categories: [{ id: 'cat-cultural', name: 'Cultural', color: '#F97316' }],
		memberCount: 98,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-16',
		name: 'Anime and Manga Club',
		description:
			'For fans of anime, manga, and Japanese pop culture. Weekly screenings, discussions, and cosplay events!',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'AMC',
		categories: [{ id: 'cat-special-interest', name: 'Special Interest', color: '#8B5CF6' }],
		memberCount: 156,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-17',
		name: 'Environmental Action Coalition',
		description:
			'Promoting sustainability and environmental awareness on campus through advocacy, education, and hands-on projects.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'EAC',
		categories: [{ id: 'cat-service', name: 'Service', color: '#6366F1' }],
		memberCount: 78,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	},
	{
		id: 'org-18',
		name: 'Entrepreneurship Club',
		description:
			'Fostering innovation and business skills. Connect with mentors, develop startup ideas, and learn from successful entrepreneurs.',
		logoUrl: null,
		bannerImageUrl: null,
		abbreviation: 'EC',
		categories: [{ id: 'cat-academic', name: 'Academic', color: '#3B82F6' }],
		memberCount: 134,
		establishedDate: null,
		websiteUrl: null,
		contactEmail: null,
		boardMembers: [],
		feedbackUrl: null
	}
];

/**
 * Get organization by ID
 */
export function getOrganization(id: string): Organization {
	const org = mockOrganizations.find((o) => o.id === id);
	if (org) return org;
	throw new Error(`Organization with id ${id} not found`);
}
