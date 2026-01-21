<script lang="ts">
	import {
		User,
		Settings,
		Moon,
		Sun,
		LogOut,
		LogIn,
		type Icon as IconType
	} from '@lucide/svelte';
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

{#snippet MenuOption(name: string, onclick: () => void, icon: typeof IconType, styling?: string)}
	{@const Icon = icon}
	<button
		type="button"
		{onclick}
		class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 transition-colors hover:bg-accent-foreground/10 {styling}"
	>
		<Icon  strokeWidth={2} class="size-4" />
		<span>{name}</span>
	</button>
{/snippet}

<div class="m-1 text-left text-sm font-medium">
	{#if isLoggedIn}
		{@render MenuOption('Dashboard', () => handleNavigation('/'), User)}
		{@render MenuOption('Settings', () => handleNavigation('/'), Settings)}
	{/if}

	<!-- Theme Toggle -->
	<div
		class="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 transition-colors hover:bg-accent-foreground/10"
		onclick={toggleMode}
		onkeydown={(e) => (e.key === 'Enter' || e.key === '') && toggleMode()}
		role="button"
		tabindex="0"
	>
		<Sun strokeWidth={2} class="size-4 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
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
		<Moon strokeWidth={2} class="absolute size-4 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
	</div>

	<Separator class="my-2" />

	{#if isLoggedIn}
		{@render MenuOption('Logout', handleLogout, LogOut, 'text-red-400 hover:bg-red-500/10')}
	{:else}
		{@render MenuOption('Sign In', () => handleNavigation('/signin'), LogIn)}
	{/if}
</div>
