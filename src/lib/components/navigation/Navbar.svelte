<script lang="ts">
	import { Menu, Search, User } from '@lucide/svelte';
	import { supabaseBrowser } from '$lib/supabaseClient.js';
	import * as DropdownMenu from '../ui/dropdown-menu/index.js';
	import * as Sheet from '../ui/sheet/index.js';
	import AccountMenu from './AccountMenu.svelte';
	import MobileSidebar from './MobileSidebar.svelte';
	import type { Session } from '@supabase/supabase-js';

	interface Route {
		name: string;
		path: string;
		icon?: any;
	}

	interface Props {
		routes?: Route[];
		currentPath?: string;
		session: Session | null;
	}

	let { routes = [], currentPath = '/', session }: Props = $props();

	let mobileMenuOpen = $state(false);

	// Derive auth state from Supabase session
	const isLoggedIn = $derived(!!session?.user);
	const userAvatar = $derived(session?.user?.user_metadata?.avatar_url || null);

	async function handleLogout() {
		await supabaseBrowser.auth.signOut();
		window.location.href = '/';
	}
</script>

<!-- Navbar -->
<nav class="fixed top-0 right-0 left-0 z-50 backdrop-blur-xs">
	<!-- Dark background behind nav -->
	<div class="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-transparent"></div>

	<div class="relative mx-auto max-w-[1920px] px-6 lg:px-8">
		<div class="flex h-20 items-center justify-between gap-4">
			<!-- Logo + Links + Hamburger -->
			<div class="flex min-w-0 flex-1 items-center gap-3">
				<!-- Hamburger -->
				<button
					type="button"
					onclick={() => (mobileMenuOpen = true)}
					class="cursor-pointer text-white transition-colors hover:text-gray-300 sm:hidden"
					aria-label="Menu"
				>
					<Menu class="size-6" />
				</button>

				<!-- Logo -->
				<a
					href="/"
					class="hidden shrink-0 items-center gap-3 transition-opacity hover:opacity-80 sm:flex"
				>
					<div
						class="flex size-10 items-center justify-center rounded-lg bg-linear-to-br from-slate-700 to-slate-800 shadow-lg"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="size-6 text-white"
						>
							<path
								d="M12 2L2 7L12 12L22 7L12 2Z"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M2 17L12 22L22 17"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M2 12L12 17L22 12"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<span class="text-lg font-bold text-white">Campus Events</span>
				</a>

				<!-- Divider -->
				<div class="ml-3 hidden h-9 w-px bg-white/20 sm:block"></div>

				<!-- Nav Links -->
				<div class="hidden min-w-0 sm:flex">
					{#each routes as route}
						<a
							href={route.path}
							class="rounded-lg px-3 py-2 text-base transition-all duration-200 {currentPath ===
							route.path
								? 'font-bold text-white'
								: 'font-normal text-gray-300 hover:font-semibold hover:text-white'}"
						>
							{route.name}
						</a>
					{/each}
				</div>
			</div>

			<!-- Search + Account -->
			<div class="flex items-center gap-1">
				<!-- Search -->
				<a
					href="/search"
					class="flex size-10 cursor-pointer items-center justify-center rounded-lg text-gray-300 transition-colors duration-200 hover:text-white"
					aria-label="Search"
				>
					<Search class="size-5" />
				</a>

				<!-- Account Dropdown -->
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="flex size-10 cursor-pointer items-center justify-center rounded-lg text-gray-300 transition-colors duration-200 hover:text-white focus:outline-none"
					>
						{#if isLoggedIn && userAvatar}
							<!-- User has profile picture from OAuth -->
							<img src={userAvatar} alt="User" class="size-8 rounded-full object-cover" />
						{:else if isLoggedIn}
							<!-- Logged in but no avatar - show colored circle with initials fallback -->
							<div class="flex size-8 items-center justify-center rounded-full bg-purple-600 text-xs font-semibold text-white">
								{session?.user?.email?.charAt(0).toUpperCase() || 'U'}
							</div>
						{:else}
							<!-- Logged out - show generic icon -->
							<User class="size-5" />
						{/if}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-56 border-white/10 bg-black/70 backdrop-blur-md"
						align="end"
					>
						<AccountMenu {isLoggedIn} {handleLogout} />
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</nav>

<!-- Mobile Sidebar -->
<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content
		side="left"
		class="w-80 overflow-visible border-white/10 bg-black/50 p-0 backdrop-blur-2xl"
	>
		<MobileSidebar
			{routes}
			{currentPath}
			{isLoggedIn}
			{userAvatar}
			{handleLogout}
			onClose={() => (mobileMenuOpen = false)}
		/>
	</Sheet.Content>
</Sheet.Root>
