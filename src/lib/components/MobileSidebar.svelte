<script lang="ts">
	import { Search, User, ChevronUp, Calendar, Compass, Home, Bookmark } from '@lucide/svelte';
	import AccountMenu from './AccountMenu.svelte';

	interface Route {
		name: string;
		path: string;
		icon?: string;
	}

	interface Props {
		routes: Route[];
		currentPath: string;
		isLoggedIn: boolean;
		userAvatar: string | null;
		onClose: () => void;
	}

	let { routes, currentPath, isLoggedIn, userAvatar, onClose }: Props = $props();

	let searchQuery = $state('');
	let accountMenuOpen = $state(false);

	function handleSearchInput() {
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
		}
	}

	function handleNavigation(path: string) {
		window.location.href = path;
		onClose();
	}

	function toggleAccountMenu() {
		accountMenuOpen = !accountMenuOpen;
	}

	// Map icon names to components
	function getIcon(iconName: string | undefined) {
		if (iconName === 'Calendar') return Calendar;
		if (iconName === 'Compass') return Compass;
		return null;
	}

	// Additional quick links for mobile
	const quickLinks = [
		{ name: 'Home', path: '/', icon: Home },
		{ name: 'Bookmarks', path: '/bookmarks', icon: Bookmark }
	];
</script>

<!-- Backdrop Blur Background on menu open -->
<button
	type="button"
	onclick={onClose}
	class="fixed inset-0 z-40 animate-in bg-black/40 backdrop-blur-sm duration-300 fade-in md:hidden"
	aria-label="Close menu"
	tabindex="-1"
></button>

<!-- Sidebar -->
<div
	class="fixed top-0 bottom-0 left-0 z-50 w-80 max-w-[85vw] animate-in border-r border-white/10 backdrop-blur-2xl duration-300 ease-out slide-in-from-left md:hidden"
>
	<!-- Background -->
	<div class="absolute inset-0 bg-black/50"></div>

	<div class="relative flex h-full flex-col">
		<!-- Logo Section -->
		<div class="shrink-0 border-b border-white/10 p-6">
			<a href="/" class="flex items-center gap-3" onclick={onClose}>
				<div
					class="flex size-14 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-blue-600 shadow-lg"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="size-8 text-white"
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
				<div class="flex flex-col">
					<span class="text-xl font-bold text-white">Campus Events</span>
					<span class="text-sm text-gray-400">Your Campus Hub</span>
				</div>
			</a>
		</div>

		<!-- Search Bar -->
		<div class="shrink-0 border-b border-white/10 p-4">
			<div class="relative">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-300"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					oninput={handleSearchInput}
					placeholder="Search events, clubs..."
					class="w-full rounded-lg border border-white/10 bg-white/5 py-3 pr-4 pl-10 text-sm text-white placeholder-gray-400 backdrop-blur-xl transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none"
				/>
			</div>
		</div>

		<!-- Quick Links -->
		<div class="shrink-0 border-b border-white/10 p-4">
			<h3 class="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
				Quick Links
			</h3>
			<nav class="space-y-1">
				{#each quickLinks as link}
					{@const Icon = link.icon}
					<button
						type="button"
						onclick={() => handleNavigation(link.path)}
						class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all hover:bg-white/10 {currentPath ===
						link.path
							? 'bg-white/10 font-bold text-white'
							: 'font-normal text-gray-300 hover:text-white'}"
					>
						<Icon class="size-5 shrink-0" />
						<span>{link.name}</span>
					</button>
				{/each}
			</nav>
		</div>

		<!-- Main Navigation Links -->
		<div class="min-h-0 flex-1 overflow-y-auto p-4">
			<h3 class="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
				Explore
			</h3>
			<nav class="space-y-1">
				{#each routes as route}
					{@const Icon = getIcon(route.icon)}
					<button
						type="button"
						onclick={() => handleNavigation(route.path)}
						class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all hover:bg-white/10 {currentPath ===
						route.path
							? 'bg-white/10 font-bold text-white'
							: 'font-normal text-gray-300 hover:text-white'}"
					>
						{#if Icon}
							<Icon class="size-5 shrink-0" />
						{/if}
						<span>{route.name}</span>
					</button>
				{/each}
			</nav>
		</div>

		<!-- Account Section -->
		<div class="relative shrink-0 border-t border-white/10 p-4">
			<!-- Account Button -->
			<button
				type="button"
				onclick={toggleAccountMenu}
				class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left transition-all hover:bg-white/10"
			>
				<div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
					{#if isLoggedIn && userAvatar}
						<img src={userAvatar} alt="User" class="size-10 rounded-full object-cover" />
					{:else}
						<User class="size-6 text-gray-300" />
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-base font-semibold text-white">
						{isLoggedIn ? 'My Account' : 'Sign In'}
					</p>
					<p class="truncate text-xs text-gray-400">
						{isLoggedIn ? 'Manage your profile' : 'Get started today'}
					</p>
				</div>
				<ChevronUp
					class="size-4 shrink-0 text-gray-400 transition-transform duration-200 {accountMenuOpen
						? 'rotate-180'
						: ''}"
				/>
			</button>

			<!-- Account Menu Dropdown -->
			{#if accountMenuOpen}
				<div class="absolute inset-x-11 {isLoggedIn ? "bottom-80" : "bottom-60"}">
					<AccountMenu {isLoggedIn} onClose={() => (accountMenuOpen = false)} />
				</div>
			{/if}
		</div>
	</div>
</div>
