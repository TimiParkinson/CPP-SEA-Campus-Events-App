import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    const newUser = await db.insert(users).values(data).returning();
    return json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return json({ error: 'Failed to create user' }, { status: 500 });
  }
}
