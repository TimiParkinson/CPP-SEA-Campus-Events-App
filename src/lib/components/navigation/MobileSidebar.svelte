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
		handleLogout: () => void;
		onClose: () => void;
	}

	let { routes, currentPath, isLoggedIn, userAvatar, handleLogout, onClose }: Props = $props();

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
				<span class="text-xl font-bold">Campus Events</span>
				<span class="text-sm text-accent-foreground">Your Campus Hub</span>
			</div>
		</a>
	</div>

	<Separator class="bg-accent-foreground/10" />

	<!-- Search Bar -->
	<div class="shrink-0 p-4">
		<div class="relative">
			<Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
			<input
				type="text"
				bind:value={searchQuery}
				oninput={handleSearchInput}
				placeholder="Search events, clubs..."
				class="w-full rounded-lg border border-accent-foreground/10 bg-accent/25 py-3 pr-4 pl-9 text-sm placeholder-accent-foreground transition-all focus:border-accent-foreground/20 focus:bg-accent/60 focus:outline-none"
			/>
		</div>
	</div>

	<Separator class="bg-accent-foreground/10" />

	<!-- Quick Links -->
	<div class="shrink-0 px-4 py-6">
		<h3 class="text-md mb-2 px-2 font-semibold tracking-wider uppercase">Quick Links</h3>
		<nav class="space-y-1">
			{#each quickLinks as link}
				{@const Icon = link.icon}
				<button
					type="button"
					onclick={() => handleNavigation(link.path)}
					class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-all hover:bg-accent/45
					{currentPath === link.path && 'bg-accent/45 font-semibold'}"
				>
					<Icon class="size-5 shrink-0" />
					<span>{link.name}</span>
				</button>
			{/each}
		</nav>
	</div>

	<Separator class="bg-accent-foreground/10" />

	<!-- Main Navigation Links -->
	<div class="min-h-0 flex-1 overflow-y-auto px-4 py-6">
		<h3 class="text-md mb-2 px-2 font-semibold tracking-wider uppercase">Explore</h3>
		<nav class="space-y-1">
			{#each routesWithIcons as route}
				{@const Icon = getIcon(route.icon)}
				<button
					type="button"
					onclick={() => handleNavigation(route.path)}
					class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-all hover:bg-accent/45
					{currentPath === route.path && 'bg-accent/45 font-semibold'}"
				>
					{#if Icon}
						<Icon class="size-5 shrink-0" />
					{/if}
					<span>{route.name}</span>
				</button>
			{/each}
		</nav>
	</div>

	<Separator class="bg-accent-foreground/10" />

	<!-- Account Section -->
	<div class="shrink-0 p-4">
		<Popover.Root bind:open={accountMenuOpen}>
			<Popover.Trigger
				class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left transition-all hover:bg-accent/40 focus:outline-none"
			>
				<div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent/50">
					{#if isLoggedIn && userAvatar}
						<img src={userAvatar} alt="User" class="size-12 rounded-full object-cover" />
					{:else}
						<User class="size-6" />
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-base font-semibold">
						{isLoggedIn ? 'My Account' : 'Sign In'}
					</p>
					<p class="text-xs text-accent-foreground">
						{isLoggedIn ? 'Manage your profile' : 'Get started today'}
					</p>
				</div>
				<ChevronUp
					class="size-4 shrink-0 transition-transform duration-200 {accountMenuOpen
						? 'rotate-180'
						: ''}"
				/>
			</Popover.Trigger>

			<Popover.Content
				class="z-100 w-56 border-accent/10 bg-accent/25 backdrop-blur-xl"
				side="top"
				align="start"
				sideOffset={8}
			>
				<button onclick={(e) => e.stopPropagation()}>
					<AccountMenu {isLoggedIn} {handleLogout} />
				</button>
			</Popover.Content>
		</Popover.Root>
	</div>
</div>
