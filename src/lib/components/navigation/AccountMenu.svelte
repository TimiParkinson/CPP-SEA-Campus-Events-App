<script lang="ts">
	import { User, Settings, Moon, Sun, LogOut, LogIn } from '@lucide/svelte';

	interface Props {
		isLoggedIn: boolean;
		onClose: () => void;
	}

	let { isLoggedIn, onClose }: Props = $props();

	// Mock dark mode state
	let darkMode = $state(true);

	function toggleDarkMode() {
		darkMode = !darkMode;
		console.log('Dark mode toggled:', darkMode);
	}

	function handleNavigation(path: string) {
		window.location.href = path;
		onClose();
	}
</script>

<!-- Dropdown Menu -->
<div
	class="absolute top-12 right-0 z-50 w-56 overflow-hidden rounded-lg border border-white/10 bg-black/70 shadow-xl backdrop-blur-md"
>
	{#if isLoggedIn}
		<!-- Logged In Options -->
		<div class="p-2">
			<button
				type="button"
				onclick={() => handleNavigation('/dashboard')}
				class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
			>
				<User class="size-4" />
				<span>Dashboard</span>
			</button>

			<button
				type="button"
				onclick={() => handleNavigation('/settings')}
				class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
			>
				<Settings class="size-4" />
				<span>Settings</span>
			</button>

			<!-- Dark Mode Toggle -->
			<button
				type="button"
				onclick={toggleDarkMode}
				class="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
			>
				<div class="flex items-center gap-3">
					{#if darkMode}
						<Moon class="size-4" />
					{:else}
						<Sun class="size-4" />
					{/if}
					<span>Dark Mode</span>
				</div>
				<div
					class="relative h-5 w-9 rounded-full transition-colors {darkMode
						? 'bg-purple-600'
						: 'bg-gray-600'}"
				>
					<div
						class="absolute top-0.5 size-4 rounded-full bg-white transition-transform {darkMode
							? 'translate-x-4'
							: 'translate-x-0.5'}"
					></div>
				</div>
			</button>

			<!-- Divider -->
			<div class="my-2 h-px bg-white/10"></div>

			<!-- Logout -->
			<button
				type="button"
				onclick={() => handleNavigation('/auth/logout')}
				class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
			>
				<LogOut class="size-4" />
				<span>Logout</span>
			</button>
		</div>
	{:else}
		<!-- Logged Out Options -->
		<div class="p-2">
			<!-- Dark Mode Toggle -->
			<button
				type="button"
				onclick={toggleDarkMode}
				class="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
			>
				<div class="flex items-center gap-3">
					{#if darkMode}
						<Moon class="size-4" />
					{:else}
						<Sun class="size-4" />
					{/if}
					<span>Dark Mode</span>
				</div>
				<div
					class="relative h-5 w-9 rounded-full transition-colors {darkMode
						? 'bg-purple-600'
						: 'bg-gray-600'}"
				>
					<div
						class="absolute top-0.5 size-4 rounded-full bg-white transition-transform {darkMode
							? 'translate-x-4'
							: 'translate-x-0.5'}"
					></div>
				</div>
			</button>

			<!-- Divider -->
			<div class="my-2 h-px bg-white/10"></div>

			<!-- Sign In -->
			<button
				type="button"
				onclick={() => handleNavigation('/register')}
				class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
			>
				<LogIn class="size-4" />
				<span>Sign In</span>
			</button>
		</div>
	{/if}
</div>
