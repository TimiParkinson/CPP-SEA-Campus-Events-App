<script lang="ts">
	import { Search, User, ChevronUp, Calendar, Compass, House, Bookmark } from '@lucide/svelte';
	import * as Popover from '../ui/popover/index.js';
	import { Separator } from '../ui/separator/index.js';
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
		toggleSignedIn: () => void;
		onClose: () => void;
	}

	let { routes, currentPath, isLoggedIn, userAvatar, toggleSignedIn, onClose }: Props = $props();

	let searchQuery = $state('');
	let accountMenuOpen = $state(false);

	// Add icons to routes
	const routesWithIcons = $derived(
		routes.map((route) => {
			let icon;
			if (route.path === '/calendar') icon = 'Calendar';
			else if (route.path === '/discover') icon = 'Compass';
			return { ...route, icon };
		})
	);

	// Additional links not in navbar
	const quickLinks = [
		{ name: 'Home', path: '/', icon: House },
		{ name: 'Bookmarks', path: '/bookmarks', icon: Bookmark }
	];

	function handleSearchInput() {
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
		}
	}

	function handleNavigation(path: string) {
		window.location.href = path;
		onClose();
	}

	// Map icon names to components
	function getIcon(iconName: string | undefined) {
		if (iconName === 'Calendar') return Calendar;
		if (iconName === 'Compass') return Compass;
		return null;
	}
</script>

<!-- Sidebar Content -->
<div class="flex h-full flex-col">
	<!-- Logo Section -->
	<div class="shrink-0 p-6">
		<a href="/" class="flex items-center gap-3" onclick={onClose}>
			<div
				class="flex size-14 items-center justify-center rounded-xl bg-linear-to-br from-slate-700 to-slate-800 shadow-lg"
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

	<Separator class="bg-white/10" />

	<!-- Search Bar -->
	<div class="shrink-0 p-4">
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

	<Separator class="bg-white/10" />

	<!-- Quick Links -->
	<div class="shrink-0 p-4">
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

	<Separator class="bg-white/10" />

	<!-- Main Navigation Links -->
	<div class="min-h-0 flex-1 overflow-y-auto p-4">
		<h3 class="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">Explore</h3>
		<nav class="space-y-1">
			{#each routesWithIcons as route}
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

	<Separator class="bg-white/10" />

	<!-- Account Section -->
	<div class="shrink-0 p-4">
		<Popover.Root bind:open={accountMenuOpen}>
			<Popover.Trigger
				class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left transition-all hover:bg-white/10 focus:outline-none"
			>
				<div
					class="flex size-12 shrink-0 items-center justify-center rounded-lg {isLoggedIn
						? ''
						: 'bg-white/10'}"
				>
					{#if isLoggedIn && userAvatar}
						<img src={userAvatar} alt="User" class="size-12 rounded-full object-cover" />
					{:else}
						<User class="size-6 text-gray-300" />
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-base font-semibold text-white">
						{isLoggedIn ? 'My Account' : 'Sign In'}
					</p>
					<p class="text-xs text-gray-400">
						{isLoggedIn ? 'Manage your profile' : 'Get started today'}
					</p>
				</div>
				<ChevronUp
					class="size-4 shrink-0 text-gray-400 transition-transform duration-200 {accountMenuOpen
						? 'rotate-180'
						: ''}"
				/>
			</Popover.Trigger>

			<Popover.Content
				class="z-100 w-56 border-white/10 bg-black/70 backdrop-blur-md"
				side="top"
				align="start"
				sideOffset={8}
			>
				<button onclick={(e) => e.stopPropagation()}>
					<AccountMenu {isLoggedIn} {toggleSignedIn} />
				</button>
			</Popover.Content>
		</Popover.Root>
	</div>
</div>
