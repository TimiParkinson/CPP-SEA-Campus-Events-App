<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ArrowLeft } from '@lucide/svelte';
	import { supabaseBrowser } from '$lib/supabaseClient';

	let step = $state<'email' | 'password'>('email');
	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let loading = $state(false);
	let error = $state('');

	async function handleEmailSubmit(e: Event) {
		e.preventDefault();
		if (!email) return;
		
		error = '';
		loading = true;
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			error = 'Please enter a valid email address';
			loading = false;
			return;
		}
		
		await new Promise(resolve => setTimeout(resolve, 500));
		loading = false;
		step = 'password';
	}

	async function handlePasswordSubmit(e: Event) {
		e.preventDefault();
		if (!password) return;
		
		error = '';
		loading = true;

		const { error: authError } =
    	await supabaseBrowser.auth.signInWithPassword({ email, password });

  	if (authError) {
    	error = authError.message;
   		loading = false;
    	return; // do NOT redirect
 	}
		
		// Supabase integration:
		// const { data, error: authError } = await supabase.auth.signInWithPassword({ 
		//   email, 
		//   password 
		// });
		// if (authError) {
		//   error = authError.message;
		//   loading = false;
		//   return;
		// }
	async function signIn() {
		error = '';
		const { error: err } = await supabaseBrowser.auth.signInWithPassword({ email, password });
		if (err) error = err.message;
		else goto('/');
	}

		await new Promise(resolve => setTimeout(resolve, 1000));
		loading = false;
		goto('/');
	}

	async function handleOAuthSignIn(provider: 'google' | 'microsoft') {
		loading = true;
		error = '';
		
		// Supabase OAuth:
		// const { data, error: authError } = await supabase.auth.signInWithOAuth({ 
		//   provider,
		//   options: {
		//     redirectTo: `${window.location.origin}/callback`
		//   }
		// });
  	
	
		await new Promise(resolve => setTimeout(resolve, 1000));
		loading = false;
	}

	function handleBack() {
		step = 'email';
		password = '';
		error = '';
	}
</script>

<div class="space-y-6">
	{#if step === 'email'}
		<form onsubmit={handleEmailSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="signin-email">Email Address</Label>
				<Input
					id="signin-email"
					type="email"
					placeholder="Enter your email address"
					bind:value={email}
					required
					disabled={loading}
					autofocus
					class={error ? 'border-destructive' : ''}
				/>
				{#if error}
					<p class="text-xs text-destructive">{error}</p>
				{/if}
			</div>
			<Button type="submit" class="w-full cursor-pointer" disabled={loading || !email}>
				{loading ? 'Processing...' : 'Continue'}
			</Button>
		</form>
	{:else}
		<button 
			onclick={handleBack}
			class="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
			type="button"
		>
			<ArrowLeft class="h-4 w-4" />
			<span class="font-medium">{email}</span>
		</button>

		<form onsubmit={handlePasswordSubmit} class="space-y-4">
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label for="signin-password">Password</Label>
					<a href="/reset-password" class="text-xs text-primary hover:text-primary/80 transition-colors">
						Forgot password?
					</a>
				</div>
				<Input
					id="signin-password"
					type="password"
					placeholder="Enter your password"
					bind:value={password}
					required
					disabled={loading}
					autofocus
					class={error ? 'border-destructive' : ''}
				/>
				{#if error}
					<p class="text-xs text-destructive">{error}</p>
				{/if}
			</div>

			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="remember-me"
					bind:checked={rememberMe}
					class="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
				/>
				<Label for="remember-me" class="text-sm font-normal cursor-pointer">
					Remember me
				</Label>
			</div>

			<Button type="submit" class="w-full cursor-pointer" disabled={loading || !password}>
				{loading ? 'Signing in...' : 'Sign In'}
			</Button>
		</form>
	{/if}

	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<Separator />
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-card px-2 text-muted-foreground">Or continue with</span>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3">
		<Button 
			variant="outline" 
			class="cursor-pointer h-11" 
			onclick={() => handleOAuthSignIn('google')}
			disabled={loading}
		>
			<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24">
				<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
				<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
				<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
				<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
			</svg>
			Google
		</Button>
		<Button 
			variant="outline" 
			class="cursor-pointer h-11" 
			onclick={() => handleOAuthSignIn('microsoft')}
			disabled={loading}
		>
			<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24">
				<path fill="#f25022" d="M11.4 11.4H0V0h11.4v11.4z"/>
				<path fill="#00a4ef" d="M24 11.4H12.6V0H24v11.4z"/>
				<path fill="#7fba00" d="M11.4 24H0V12.6h11.4V24z"/>
				<path fill="#ffb900" d="M24 24H12.6V12.6H24V24z"/>
			</svg>
			Microsoft
		</Button>
	</div>

	{#if step === 'email'}
		<p class="text-center text-sm text-muted-foreground">
			Don't have an account? 
			<a href="/register" class="font-medium text-primary hover:underline">
				Register
			</a>
		</p>
	{/if}
</div>