# Campus Events App
Campus Events App (CEA) is a web application designed to help users organize and discover campus activities. Developed by Cal Poly Pomona students for Cal Poly Pomona students, our app is designed to be intuitive and versatile. Student organizations create profiles, manage leadership roles, and publish events, while students can join organizations, browse events, and RSVP—all within a single platform! 

#### 🌐 Live Demo: [Campus Events App](https://cpp-sea-campus-events-app.vercel.app/)

## ✨ Features
- 📅 Calendar view of upcoming events
- 🔎 Discover page for organizations and activities
- 🏫 Organization profiles for creating and managing events
- ✏️ Event creation and management
- 🔑 Single Sign-On (SSO) with your CPP account 
- 🎟️ In-app RSVP system

## 🛠️ Tech Stack
- Frontend: SvelteKit, TypeScript, Tailwind CSS, shadcn/ui
- Backend: SvelteKit API Routes, Drizzle ORM
- Database: PostgreSQL (Supabase)
- Deployment: Vercel
- Tools: Git/GitHub, Figma, Trello


## 🚀 How to Build
### Download Dependencies
  
#### 1) Node.js and npm
Node.js runs the JavaScript code, and npm manages the packages.

**Installation:**
1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Run the installer with default settings
4. Verify installation in terminal/command prompt:
   `node --versionnpm --version`
#### 2) Git
For version control and collaboration.

**Installation:**
1. Windows: Download from [Git SCM](git-scm.com)
   
   Mac: Install via Homebrew (`brew install git`) or download from [Git SCM](git-scm.com)
   
   Linux: Use package manager (`sudo apt install git` for Ubuntu)
2. Verify installation:
   `git --version`
---
### Initial Project Setup 
#### 1) Clone this GitHub repository
  ```bash
  git clone https://github.com/TimiParkinson/Cal-Poly-Pomona-SEA-Campus-Events-App.git
  ```

   Navigate to the repository on your machine using the `cd` command
#### 2) Initialize the SvelteKit Project:
  ```
npm create svelte@latest
npm install
  ```
#### 3) Add Tech Stack Dependencies
```
# Tailwind CSS and plugins
npm install -D tailwindcss @tailwindcss/typography @tailwindcss/forms

# Database & authentication
npm install drizzle-orm lucia

# TypeScript types
npm install @types/node typescript

# Animation library
npm install gsap
```

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
