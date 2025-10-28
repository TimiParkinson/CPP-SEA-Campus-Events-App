<script lang="ts">
	import type { EventItem } from '$lib/stores/filters.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { AlarmClock, Calendar, MapPin, UsersRound, type Icon as IconType } from '@lucide/svelte';

	interface Props {
		subscription: EventItem | null;
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}

	let { subscription, open, onOpenChange }: Props = $props();
</script>

<Dialog.Root {open} {onOpenChange}>
	<Dialog.Content>
		{#if subscription}
			<Dialog.Header>
				<Dialog.Title>{subscription.title}</Dialog.Title>
				<Dialog.Description>
					Subscription Description for {subscription.title}
				</Dialog.Description>
			</Dialog.Header>
				<section>
					<div class="pt-4">
						<Button class="w-full sm:w-auto" disabled>View Full Subscription Details</Button>
					</div>
				</section>
		{/if}
	</Dialog.Content>
</Dialog.Root>