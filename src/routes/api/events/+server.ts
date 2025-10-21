// src/routes/api/events/+server.ts
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const allEvents = await db.select().from(events);
    return json(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const newEvent = await db.insert(events).values(data).returning();
    return json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return json({ error: 'Failed to create event' }, { status: 500 });
  }
}