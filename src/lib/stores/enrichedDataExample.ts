import * as raw from '../stores/rawDatabaseExample.js'

export type Event = {
    id: string;
    title: string;
    organizer: string;
    location: string;
    start_time: Date;
    end_time: Date;
    description: string;
    tags: string[];  
}

export type Organization = {
    id: string;
    name: string;
    description: string;
    tags: string[];
    events: string[];
}

export const events: Event[] = raw.events.map(event => {
    const org: raw.Organization | undefined = raw.organizations.find(org => org.id === event.organization_id);
    const tags: raw.EventTag[] = raw.eventTagAssignments.filter(eta => eta.event_id === event.id).map(eta => { return raw.eventTags.find(t => t.id === eta.tag_id) as raw.EventTag });
    return {
        id: event.id,
        title: event.title,
        organizer: org ? org.name : "Error: Organizer Not Found",
        location: event.location,
        start_time: event.start_time,
        end_time: event.end_time,
        description: event.description,
        tags: tags.map(t => t.name)
    } as Event;
});


export const organizations: Organization[] = raw.organizations.map(org => {
    const orgEvents: raw.Event[] = raw.events.filter(e => e.organization_id === org.id);
    const cat: raw.OrganizationCategory[] = raw.organizationCategoryAssignments.filter(oca => oca.organization_id === org.id).map(oca => { return raw.organizationCategories.find(c => c.id === oca.category_id) as raw.OrganizationCategory });

    return {
        id: org.id,
        name: org.name,
        description: org.description,
        tags: cat.map(c => c.name),
        events: orgEvents.map(event => event.id)
    } as Organization;
});
