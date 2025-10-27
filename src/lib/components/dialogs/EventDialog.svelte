<script lang="ts">
	import type { EventItem } from '$lib/stores/filters.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { AlarmClock, Calendar, MapPin, UsersRound, type Icon as IconType } from '@lucide/svelte';

	interface Props {
		event: EventItem | null;
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}

	let { event, open, onOpenChange }: Props = $props();
</script>

{#snippet detailGroup(label: string, value: string, icon: typeof IconType)}
	{@const Icon = icon}
	<div class="flex items-center gap-3">
		<Icon class="h-5 w-5 text-muted-foreground" />
		<div>
			<h3 class="text-sm font-medium text-muted-foreground">{label}</h3>
			<p class="text-sm">
				{#if label === 'Date'}
					{new Date(value).toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'short',
						day: 'numeric',
						year: 'numeric'
					})}
				{:else}
					{value}
				{/if}
			</p>
		</div>
	</div>
{/snippet}

<Dialog.Root {open} {onOpenChange}>
	<Dialog.Content>
		{#if event}
			<Dialog.Header>
				<Dialog.Title>{event.title}</Dialog.Title>
				<Dialog.Description>
					Event Description for {event.title}
				</Dialog.Description>
			</Dialog.Header>
			<section class="space-y-6 flex flex-col items-center sm:block">
				<!-- Tags -->
				{#if event.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each event.tags as tag}
							<Badge variant="secondary">{tag}</Badge>
						{/each}
					</div>
				{/if}

				<!-- Event Details -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{#if event.date}
						{@render detailGroup('Date', event.date, Calendar)}
					{/if}

					{@render detailGroup('Time', '12:00 - 1:00', AlarmClock)}

					{#if event.location}
						{@render detailGroup('Location', event.location, MapPin)}
					{/if}

					{@render detailGroup('Organization', event.organization, UsersRound)}
				</div>

				<!-- Open Event -->
				<div class="pt-4">
					<Button class="w-full sm:w-auto" disabled>View Full Event Details</Button>
				</div>
			</section>
		{/if}
	</Dialog.Content>
</Dialog.Root>
