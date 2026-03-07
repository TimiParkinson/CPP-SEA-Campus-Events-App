# Campus Events App
Campus Events App (CEA) is a web application designed to help users organize and discover campus activities. Developed by Cal Poly Pomona students for Cal Poly Pomona students, our app is designed to be intuitive and versatile. Student organizations create profiles, manage leadership roles, and publish events, while students can join organizations, browse events, and RSVP—all within a single platform! 

## ✨ Features
- 📅 Calendar view of upcoming events
- 🔎 Discover page for organizations and activities
- 🏫 Organization profiles with leadership roles
- ✏️ Event creation and management
- 🎟️ In-app RSVP system

## 🛠️ Tech Stack:
- Frontend: SvelteKit, TypeScript, Tailwind CSS, shadcn/ui
- Backend: SvelteKit API Routes, Drizzle ORM
- Database: PostgreSQL (Supabase)
- Deployment: Vercel
- Tools: Git/GitHub, Figma, Trello

## 👤 Contributers
* Christian Parkinson: Project Lead
  - [TimiParkinson](https://github.com/TimiParkinson)
* Clarence Ballensky: Project Coordinator, Frontend
  - [ClarenceBallensky](https://github.com/ClarenceBallensky)
* Liam Buckman: Frontend Lead
  - [lebuckman](https://github.com/lebuckman)
* Lily Konefat: Frontend
  - [LilyInTheWind](https://github.com/LilyInTheWind)
* Umar Azizadah: Backend Lead
  - [umarazizadah](https://github.com/umarazizadah)
* Spencer Tien: Backend
  - [dustsunrise](https://github.com/dustsunrise) 

## 🚀 How to Build

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

### Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

### Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

### Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```
