import { db } from '$lib/server/db/index.js';
import { organizations } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';

export async function GET() {
  const orgs = await db.select().from(organizations);
  return json(orgs);
}
