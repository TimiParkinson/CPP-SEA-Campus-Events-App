import { writable, derived, type Writable } from 'svelte/store';

// Define types
export type EventType = "Event" | "Organization"
export type FilterType = "All" | EventType

export type EventItem = {
  title: string;
  type: EventType;
  organization: string;
  date?: string;
  location?: string;
  tags: string[];
}

// Example dataset (events + organizations)
export const items: EventItem[] = [
  { title: "Fall Welcome Fair", type: "Event", organization: "Student Life", date: "2025-10-05", location: "Main Quad", tags: ["Festival","Outdoor"] },
  { title: "Tech Talk: AI in 2025", type: "Event", organization: "Engineering Club", date: "2025-10-10", location: "Engineering Hall", tags: ["Lecture","Technology"] },
  { title: "Student Art Exhibit", type: "Event", organization: "Art Club", date: "2025-10-15", location: "Art Center", tags: ["Exhibit","Art"] },
  { title: "Campus Run Club Meetup", type: "Event", organization: "Run Club", date: "2025-10-18", location: "Track Field", tags: ["Activity","Outdoor"] },
  { title: "Jazz Night", type: "Event", organization: "Music Department", date: "2025-10-20", location: "Student Union", tags: ["Concert","Music"] },
  { title: "Career Fair", type: "Event", organization: "Career Services", date: "2025-10-25", location: "Gymnasium", tags: ["Fair","Networking"] },
  { title: "Engineering Club", type: "Organization", organization: "Engineering Club", tags: ["STEM","Networking"] },
  { title: "Art Club", type: "Organization", organization: "Art Club", tags: ["Creative","Community"] }
];

// Writable filters
export const typeFilter: Writable<FilterType> = writable("All");       // All | Event | Organization
export const orgFilter: Writable<string> = writable("All");        // Organization name | All
export const tagFilter: Writable<string[]> = writable([]);           // array of selected tags
export const searchQuery: Writable<string> = writable("");         // keyword search

// Unique orgs & tags
export const organizations: string[] = Array.from(new Set(items.map(i => i.organization)));
export const allTags: string[] = Array.from(new Set(items.flatMap(i => i.tags)));

// Derived filtered items
export const filteredItems = derived(
  [typeFilter, orgFilter, tagFilter, searchQuery],
  ([$typeFilter, $orgFilter, $tagFilter, $searchQuery]) => {
    return items.filter(i => {
      const matchType = $typeFilter === "All" || i.type === $typeFilter;
      const matchOrg = $orgFilter === "All" || i.organization === $orgFilter;
      const matchTags = $tagFilter.length === 0 || $tagFilter.every(tag => i.tags.includes(tag));
      const matchSearch = !$searchQuery || i.title.toLowerCase().includes($searchQuery.toLowerCase());
      return matchType && matchOrg && matchTags && matchSearch;
    });
  }
);
