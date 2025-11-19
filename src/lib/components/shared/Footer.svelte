<script lang="ts">
	import { Instagram, Linkedin, Youtube, Facebook } from '@lucide/svelte';

	const platformLinks = [
		{ name: 'Privacy', href: 'https://www.cpp.edu/privacy.shtml' },
		{
			name: 'Release Notes',
			href: 'https://github.com/TimiParkinson/CPP-SEA-Campus-Events-App/releases'
		},
		{ name: 'Support', href: '#' }
	];

	const resourceLinks = [
		{ name: 'Advisor Resources', href: 'https://www.cpp.edu/blc/partners/advisors.shtml' },
		{
			name: 'ASI Financial Services',
			href: 'https://asi.cpp.edu/services/club-services/finance-support/'
		},
		{ name: 'Bronco Leadership Center', href: 'https://www.cpp.edu/blc/index.shtml' },
		{
			name: 'Club Resources',
			href: 'https://www.cpp.edu/blc/student-leaders/club-org-toolkit.shtml'
		}
	];

	const campusLinks = [
		{ name: 'CPP Home Page', href: 'https://www.cpp.edu/' },
		{ name: 'myBar', href: 'https://mybar.cpp.edu/' }
	];

	const socialLinks = [
		{ name: 'LinkedIn', href: 'https://www.linkedin.com/school/cal-poly-pomona/', icon: Linkedin },
		{ name: 'Facebook', href: 'https://www.facebook.com/calpolypomona', icon: Facebook },
		{ name: 'Instagram', href: 'https://www.instagram.com/calpolypomona/', icon: Instagram },
		{ name: 'YouTube', href: 'https://www.youtube.com/user/calpolypomona', icon: Youtube },
		{ name: 'X', href: 'https://x.com/calpolypomona', icon: null } // uses X SVG
	];
</script>

<footer class="border-t border-white/10 bg-black py-12 text-white">
	<div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Footer Content -->
		<div
			class="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between"
		>
			<!-- Logo -->
			<div class="shrink-0">
				<a href="/" class="inline-flex items-center gap-3">
					<div
						class="flex size-16 items-center justify-center rounded-xl bg-linear-to-br from-slate-700 to-slate-800 shadow-lg"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="size-9 text-white"
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
						<span class="text-xl leading-tight font-bold">Campus Events</span>
						<span class="text-sm text-gray-400">Your Campus Hub</span>
					</div>
				</a>
			</div>

			<!-- Main Links -->
			<div class="flex w-full flex-col gap-8 md:w-auto md:flex-row md:gap-12 lg:gap-16">
				<!-- Campus Links -->
				<div class="text-center md:text-left">
					<h3 class="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
						Campus Links
					</h3>
					<ul class="space-y-3">
						{#each campusLinks as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-gray-300 transition-all hover:text-white hover:underline"
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Platform Links -->
				<div class="text-center md:text-left">
					<h3 class="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
						Platform
					</h3>
					<ul class="space-y-3">
						{#each platformLinks as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-gray-300 transition-all hover:text-white hover:underline"
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Resources Links -->
				<div class="text-center md:text-left">
					<h3 class="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
						Resources
					</h3>
					<ul class="space-y-3">
						{#each resourceLinks as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-gray-300 transition-all hover:text-white hover:underline"
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row"
		>
			<!-- Copyright -->
			<p class="text-sm text-gray-400">
				© {new Date().getFullYear()} Campus Events. Built by members of SEA 🦭
			</p>

			<!-- Social Links -->
			<div class="flex items-center gap-4">
				{#each socialLinks as social}
					<a
						href={social.href}
						aria-label={social.name}
						class="text-gray-400 transition-colors hover:text-white"
					>
						{#if social.icon}
							<svelte:component this={social.icon} class="size-5" />
						{:else if social.name === 'X'}
							<!-- X Icon -->
							<svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
								/>
							</svg>
						{/if}
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
