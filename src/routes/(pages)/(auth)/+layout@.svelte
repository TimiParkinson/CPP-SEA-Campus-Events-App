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
		<!-- Tabs -->
		<div class="tab-buttons">
			<button
				id="register"
				class="tab-button {currentTab === 'register' ? 'active' : ''}"
				onclick={() => handleTabChange('register')}
			>
				Register
			</button>
			<button
				id="signin"
				class="tab-button {currentTab === 'signin' ? 'active' : ''}"
				onclick={() => handleTabChange('signin')}
			>
				Sign In
			</button>
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

			{@render children()}

			<div class="mt-6 text-center">
				<Button 
					variant="ghost"
					class="w-full cursor-pointer text-sm text-muted-foreground hover:text-foreground"
					style="background: none;"
					onclick={() => goto('/')}
				>
					Back to Home
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.tab-buttons {
		display: flex;
		width: 100%;
		border: 1px solid #2d2d30; /* var(--border) kept rendering differently here */
		border-bottom: none;
		border-top-left-radius: 0.75rem;
		border-top-right-radius: 0.75rem;
		overflow: hidden; 
	}

	.tab-button {
		
		flex: 1;
		padding: 0.75rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--muted-foreground);
		background: var(--background);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-button:hover:not(.active) {
		color: var(--foreground);
		background: color-mix(in srgb, var(--background) 90%, var(--border) 10%);
	}

	.tab-button.active {
		background: var(--card);
		color: var(--foreground);
		font-weight: 600;
		position: relative;
		z-index: 2;
	}

	.tab-button.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--card);
	}

	.card-content {
		background: var(--card);
		border: 1px solid var(--border);
		border-top: none;
		border-bottom-left-radius: 0.75rem;
		border-bottom-right-radius: 0.75rem;
		padding: 2rem;
		z-index: 1;
		position: relative;
		margin-top: -1px;
	}
</style>
