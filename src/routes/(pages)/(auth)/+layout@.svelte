<script lang="ts">
	import '$css';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	
	let { children } = $props();
	
	let currentTab = $derived($page.url.pathname.includes('/signin') ? 'signin' : 'register');
	
	function handleTabChange(value: string) {
		if (value === 'signin') {
			goto('/signin');
		} else {
			goto('/register');
		}
	}
</script>

<!-- Standalone auth page with centered card -->
<div class="min-h-screen flex items-center justify-center bg-background p-4">
	<div class="w-full max-w-md">
		<!-- Chrome-style tabs -->
		<div class="flex gap-1 mb-0">
			<button
				class="tab-button {currentTab === 'register' ? 'active' : ''}"
				onclick={() => handleTabChange('register')}
			>
				Register
			</button>
			<button
				class="tab-button {currentTab === 'signin' ? 'active' : ''}"
				onclick={() => handleTabChange('signin')}
			>
				Sign In
			</button>
			<div class="flex-1"></div>
		</div>

		<!-- Card content -->
		<div class="card-content">
			<div class="text-center mb-8">
				<h1 class="text-2xl font-bold mb-2">
					{currentTab === 'register' ? 'Welcome' : 'Welcome back'}
				</h1>
				<p class="text-muted-foreground text-sm">
					{currentTab === 'register' 
						? 'Create an account to get started' 
						: 'Sign in to your account to continue'}
				</p>
			</div>

			<!-- Child page content (signin or register forms) -->
			{@render children()}

			<div class="mt-6 text-center">
				<Button 
					variant="ghost" 
					class="w-full cursor-pointer text-sm text-muted-foreground hover:text-foreground" 
					onclick={() => goto('/')}
				>
					Back to Home
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.tab-button {
		position: relative;
		padding: 0.75rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: hsl(var(--muted-foreground));
		background: hsl(var(--background));
		border: 1px solid hsl(var(--border));
		border-bottom: none;
		border-top-left-radius: 0.75rem;
		border-top-right-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
		z-index: 1;
	}

	.tab-button:hover:not(.active) {
		background: hsl(var(--accent));
		color: hsl(var(--foreground));
	}

	.tab-button.active {
		background: hsl(var(--card));
		color: hsl(var(--foreground));
		font-weight: 600;
		border: 1px solid hsl(var(--border));
		border-bottom: 1px solid hsl(var(--card));
		z-index: 3;
		position: relative;
	}

	/* Make active tab blend into card */
	.tab-button.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background: hsl(var(--card));
		z-index: 4;
	}

	.card-content {
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: 0.75rem;
		border-top-left-radius: 0;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		position: relative;
		z-index: 2;
	}
</style>