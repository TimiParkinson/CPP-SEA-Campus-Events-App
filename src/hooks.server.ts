// Server-only Supabase client via @supabase/ssr
import type { Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
  // Create a request-scoped client. It reads/writes sb-* cookies on the Response.
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' });
      }
    }
  });

  // Make the current session available on event.locals
  const {
    data: { session }
  } = await event.locals.supabase.auth.getSession();

  event.locals.session = session;

  // Optionally protect all routes under /_Your-Events or /_Your-Organizations
  if (event.url.pathname.startsWith('/_Your-') && !session) {
    return new Response(null, { status: 303, headers: { location: '/login' } });
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      // necessary to forward Set-Cookie headers set by supabase SSR
      return name === 'content-range';
    }
  });
};
