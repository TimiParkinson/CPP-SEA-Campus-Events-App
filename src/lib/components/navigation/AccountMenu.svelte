<script lang="ts">
	import { User, Settings, Moon, Sun, LogOut, LogIn } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';
	import Separator from '../ui/separator/separator.svelte';
	import Switch from '../ui/switch/switch.svelte';

	interface Props {
		isLoggedIn: boolean;
		handleLogout: () => void;
	}

	let { isLoggedIn, handleLogout }: Props = $props();

	function handleNavigation(path: string) {
		window.location.href = path;
	}
</script>

{#if isLoggedIn}
	<button
		type="button"
		onclick={() => handleNavigation('/')}
		class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
	>
		<User class="size-4" />
		<span>Dashboard</span>
	</button>

	<button
		type="button"
		onclick={() => handleNavigation('/')}
		class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
	>
		<Settings class="size-4" />
		<span>Settings</span>
	</button>
{/if}

<!-- Theme Toggle -->
<div
	class="m-2 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
	onclick={toggleMode}
	onkeydown={(e) => (e.key === 'Enter' || e.key === '') && toggleMode()}
	role="button"
	tabindex="0"
>
	<Sun class="size-5 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
	{#if mode.current === 'light'}
		<span>Light Mode</span>
	{/if}
	{#if mode.current === 'dark'}
		<span>Dark Mode</span>
	{/if}
	<Switch
		checked={mode.current === 'dark'}
		onCheckedChange={toggleMode}
		class="pointer-events-none ml-auto cursor-pointer"
	/>
	<Moon class="absolute size-5 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
</div>

<Separator />

{#if isLoggedIn}
	<button
		type="button"
		onclick={handleLogout}
		class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
	>
		<LogOut class="size-4 text-red-400" />
		<span>Logout</span>
	</button>
{:else}
	<button
		type="button"
		onclick={() => handleNavigation('/signin')}
		class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
	>
		<LogIn class="size-4" />
		<span>Sign In</span>
	</button>
{/if}
