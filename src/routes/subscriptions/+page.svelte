<script lang="ts">
	import { allTags, filteredItems, searchQuery, tagFilter } from '$lib/stores/filters.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import {
		AlarmClock,
		Calendar,
		MapPin,
		Search,
		UsersRound,
		X,
		type Icon as IconType
	} from '@lucide/svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
</script>

<main>
	<h1 class="text-3xl mb-4">Your Subscriptions</h1>

	<!-- Search Bar -->
	<InputGroup.Root>
		<InputGroup.Input placeholder="Search subscriptions..." value={$searchQuery} oninput={e => $searchQuery = e.currentTarget.value} />
		<InputGroup.Addon>
			<Search />
		</InputGroup.Addon>
	</InputGroup.Root>

	<!-- Filters -->
	<section class="my-6 flex gap-1">
		{#each allTags as tag}
			<Button
				variant={$tagFilter.includes(tag) ? 'default' : 'outline'}
				class="cursor-pointer"
				onclick={() => {
					if ($tagFilter.includes(tag)) {
						$tagFilter = $tagFilter.filter((currentTag) => currentTag !== tag);
					} else {
						$tagFilter = [...$tagFilter, tag];
					}
				}}
			>
				{tag}
			</Button>
		{/each}
		{#if $tagFilter.length !== 0}
			<Button class="cursor-pointer" onclick={() => ($tagFilter = [])}>
				<X aria-label="Clear all labels." />
			</Button>
		{/if}
	</section>

	<!-- Subscriptions Gallery -->
	<section class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
		{#if $filteredItems.length === 0}
			<p>No subscriptions found</p>
		{/if}
		{#each $filteredItems as subscription (subscription.title)}
			<Dialog.Root>
				<Dialog.Trigger
					class="cursor-pointer self-start"
					aria-label="View details for {subscription.title}"
				>
					<div class="flex flex-col text-left">
						<div class="temp-img"></div>
						<h2 class="mt-2 line-clamp-1 font-semibold">{subscription.title}</h2>
						{#if subscription.date}
							<p class="font-extralight">
								{new Date(subscription.date).toLocaleDateString('en-US', {
									month: '2-digit',
									day: '2-digit',
									year: '2-digit'
								})}
							</p>
						{/if}
					</div>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>{subscription.title}</Dialog.Title>
						<Dialog.Description>
							Organization Description for {subscription.title}
						</Dialog.Description>
					</Dialog.Header>
					<section class="space-y-6">
						<!-- Tags -->
						{#if subscription.tags.length > 0}
							<div>
								<div class="flex flex-wrap gap-2">
									{#each subscription.tags as tag}
										<Badge variant="secondary">{tag}</Badge>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Subscription Details -->
						<div class="grid grid-cols-2 gap-4">
							{#if subscription.date}
								{@render subscriptionDetail('Date', subscription.date, Calendar)}
							{/if}

							{#if true}
								{@render subscriptionDetail('Time', '12:00 - 1:00', AlarmClock)}
							{/if}

							{#if subscription.location}
								{@render subscriptionDetail('Location', subscription.location, MapPin)}
							{/if}

							{@render subscriptionDetail('Organization', subscription.organization, UsersRound)}
						</div>

						<!-- Open subscription -->
						<div class="mt-16">
							<Button class="cursor-pointer" disabled>View Full Organization Details</Button>
						</div>
					</section>
				</Dialog.Content>
			</Dialog.Root>
		{/each}
	</section>
</main>

{#snippet subscriptionDetail(label: string, detail: string, icon: typeof IconType)}
	<div class="flex items-center gap-3">
		<div>
			<svelte:component this={icon} class="h-5 w-5 text-muted-foreground" />
		</div>
		<div>
			<h3 class="text-sm font-medium text-muted-foreground">{label}</h3>
			<p class="text-sm">
				{#if label === 'Date'}
					{new Date(detail).toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'short',
						day: 'numeric',
						year: 'numeric'
					})}
				{:else}
					{detail}
				{/if}
			</p>
		</div>
	</div>
{/snippet}

<style>
	.temp-img {
		width: 160px;
		aspect-ratio: 1;
		background-color: gray;
		border-radius: 16px;
	}
</style>
