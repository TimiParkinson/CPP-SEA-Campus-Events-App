<script lang="ts">
	import { supabaseBrowser } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	let email = '';
	let password = '';
	let error: string | null = null;

	async function signIn() {
		error = null;
		const { error: err } = await supabaseBrowser.auth.signInWithPassword({ email, password });
		if (err) error = err.message;
		else goto('/');
	}
</script>

<div class="mx-auto mt-12 max-w-sm space-y-3">
	<h1 class="text-xl font-semibold">Login</h1>
	<input bind:value={email} type="email" placeholder="email" class="w-full rounded border p-2" />
	<input
		bind:value={password}
		type="password"
		placeholder="password"
		class="w-full rounded border p-2"
	/>
	<button on:click|preventDefault={signIn} class="w-full rounded border p-2">Log in</button>
	{#if error}<p class="text-red-500">{error}</p>{/if}
</div>
