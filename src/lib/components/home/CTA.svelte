<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { UserPlus } from '@lucide/svelte';

	interface Props {
		title?: string;
		buttonText?: string;
		buttonHref?: string;
	}

	let {
		title = 'Sign up to track your involvement on campus',
		buttonText = 'Sign Up',
		buttonHref = '/auth/register'
	}: Props = $props();
</script>

<section class="bg-black py-10 sm:py-12 lg:py-16">
	<div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div
			class="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14"
		>
			<div class="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-12">
				<div class="flex-1 text-center md:text-left">
					<h2 class="text-2xl leading-tight font-bold text-white sm:text-3xl lg:text-4xl">
						{title}
					</h2>
				</div>

				<div class="shrink-0">
					<Button
						href={buttonHref}
						size="lg"
						class="h-12 cursor-pointer gap-2 px-10 text-base sm:h-14 sm:px-12 sm:text-lg"
					>
						<UserPlus class="size-5" />
						{buttonText}
					</Button>
				</div>
			</div>
		</div>
	</div>
</section>
