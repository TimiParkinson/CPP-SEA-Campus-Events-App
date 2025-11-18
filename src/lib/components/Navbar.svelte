<script lang="ts">
	import { Menu, Search, User } from '@lucide/svelte';
	import AccountMenu from './AccountMenu.svelte';
	import MobileSidebar from './MobileSidebar.svelte';

	interface Route {
		name: string;
		path: string;
		icon?: any;
	}

	interface Props {
		routes?: Route[];
		currentPath?: string;
	}

	let { routes = [], currentPath = '/' }: Props = $props();

	// Add icons to routes (for mobile sidebar)
	const routesWithIcons = $derived(
		routes.map((route) => {
			let icon;
			if (route.path === '/calendar') icon = 'Calendar';
			else if (route.path === '/discover') icon = 'Compass';
			return { ...route, icon };
		})
	);

	let accountMenuOpen = $state(false);
	let mobileMenuOpen = $state(false);

	// Mock auth state
	let isLoggedIn = $state(true);
	let userAvatar = $state<string | null>("https://cdn-icons-png.flaticon.com/512/147/147142.png");

	function toggleAccountMenu() {
		accountMenuOpen = !accountMenuOpen;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
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
					onclick={toggleMobileMenu}
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
				<div class="hidden h-9 w-px ml-3 bg-white/20 sm:block"></div>

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
			<div class="flex gap-1 items-center">
				<!-- Search -->
				<a
					href="/search"
					class="flex size-10 cursor-pointer items-center justify-center rounded-lg text-gray-300 transition-colors duration-200 hover:text-white"
					aria-label="Search"
				>
					<Search class="size-5" />
				</a>

				<!-- Account -->
				<div class="relative">
					<button
						type="button"
						onclick={toggleAccountMenu}
						class="flex size-10 cursor-pointer items-center justify-center rounded-lg text-gray-300 transition-colors duration-200 hover:text-white"
						aria-label="Account"
					>
						{#if isLoggedIn && userAvatar}
							<img src={userAvatar} alt="User" class="size-8 rounded-full object-cover" />
						{:else}
							<User class="size-5" />
						{/if}
					</button>

					{#if accountMenuOpen}
						<AccountMenu {isLoggedIn} onClose={() => (accountMenuOpen = false)} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</nav>

<!-- Mobile Sidebar -->
{#if mobileMenuOpen}
	<MobileSidebar
		routes={routesWithIcons}
		{currentPath}
		{isLoggedIn}
		{userAvatar}
		onClose={() => (mobileMenuOpen = false)}
	/>
{/if}

<!-- Click outside to close account menu -->
{#if accountMenuOpen}
	<button
		type="button"
		onclick={() => (accountMenuOpen = false)}
		class="fixed inset-0 z-40 cursor-default"
		aria-label="Close menu"
		tabindex="-1"
	></button>
{/if}
