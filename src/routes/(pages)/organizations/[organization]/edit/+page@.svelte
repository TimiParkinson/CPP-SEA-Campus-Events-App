<script lang="ts">
	import { enhance } from '$app/forms';
	import { Calendar, Globe, Mail, Users, User, Pencil } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Detail from '$lib/components/shared/Detail.svelte';
	import EventCard from '$lib/components/cards/EventCard.svelte';
	import EventDialog from '$lib/components/dialogs/EventDialog.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import OrgPageShell from '$lib/components/orgs/OrgPageShell.svelte';
	import OrgPageContent from '$lib/components/orgs/OrgPageContent.svelte';

	import type { Organization, OrganizationCategory, Event } from '$lib/types/index.js';

	let { data } = $props();
	const org: Organization = data.organization;
	const allCategories: OrganizationCategory[] = data.allCategories;
	const upcomingEvents: Event[] = data.upcomingEvents;
	const pastEvents: Event[] = data.pastEvents;

	// ── Form state ─────────────────────────────────────────────────────────────
	let name = $state(org.name ?? '');
	let description = $state(org.description ?? '');
	let contactEmail = $state(org.contactEmail ?? '');
	let websiteUrl = $state(org.websiteUrl ?? '');
	let feedbackUrl = $state(org.feedbackUrl ?? '');
	let logoUrl = $state(org.logoUrl ?? '');
	let bannerImageUrl = $state(org.bannerImageUrl ?? '');
	let abbreviation = $state(org.abbreviation ?? '');
	let establishedDate = $state(
		org.establishedDate ? new Date(org.establishedDate).toISOString().split('T')[0] : ''
	);
	let selectedCategoryIds = $state(new Set<string>(org.categories?.map((c) => c.id) ?? []));

	// ── Submission state ───────────────────────────────────────────────────────
	let submitting = $state(false);
	let serverErrors = $state<Record<string, string>>({});

	// ── Client validation ──────────────────────────────────────────────────────
	let nameError = $derived(
		name.trim().length > 0 && name.trim().length < 2 ? 'Name must be at least 2 characters.' : ''
	);
	let emailError = $derived(
		contactEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
			? 'Enter a valid email.'
			: ''
	);
	let canSubmit = $derived(
		name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) && !submitting
	);

	// ── URL popup state (banner + logo only) ──────────────────────────────────
	let bannerPopupOpen = $state(false);
	let logoPopupOpen = $state(false);
	let tempBannerUrl = $state('');
	let tempLogoUrl = $state('');

	function openBannerPopup() {
		tempBannerUrl = bannerImageUrl;
		bannerPopupOpen = true;
	}
	function saveBannerUrl() {
		bannerImageUrl = tempBannerUrl.trim();
		bannerPopupOpen = false;
	}

	function openLogoPopup() {
		tempLogoUrl = logoUrl;
		logoPopupOpen = true;
	}
	function saveLogoUrl() {
		logoUrl = tempLogoUrl.trim();
		logoPopupOpen = false;
	}

	function toggleCategory(id: string) {
		if (selectedCategoryIds.has(id)) {
			selectedCategoryIds.delete(id);
		} else {
			selectedCategoryIds.add(id);
		}
		selectedCategoryIds = selectedCategoryIds;
	}

	// ── Event dialog (read-only on edit page) ──────────────────────────────────
	let selectedEvent = $state<Event | null>(null);
	let eventDialogOpen = $state(false);

	function openEvent(event: Event) {
		selectedEvent = event;
		eventDialogOpen = true;
	}
</script>

<svelte:head>
	<title>Edit: {org.name} - Campus Events</title>
</svelte:head>

<OrgPageShell
	org={{
		...org,
		bannerImageUrl: bannerImageUrl || org.bannerImageUrl,
		logoUrl: logoUrl || org.logoUrl
	}}
>
	{#snippet topRight()}
		{#if org.memberCount}
			<div
				class="flex items-center gap-2 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-white backdrop-blur-sm sm:px-4"
			>
				<Users size="17" />
				<span class="text-sm font-semibold">{org.memberCount} members</span>
			</div>
		{/if}
	{/snippet}

	{#snippet bannerOverlay()}
		<!--
			Full-cover button: hovering anywhere on the banner blurs it and
			reveals the centered edit prompt (Spotify-style). z-index is below
			the back button (z-10) so that still works.
		-->
		<button
			type="button"
			onclick={openBannerPopup}
			aria-label="Change banner image"
			class="group absolute inset-0 cursor-pointer"
		>
			<!-- Blur + dim layer -->
			<div
				class="backdrop-blur-0 absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/30 group-hover:backdrop-blur-xs"
			></div>
			<!-- Centered edit label -->
			<div
				class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
			>
				<span
					class="flex items-center gap-2 rounded-lg bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm"
				>
					<Pencil class="size-4" />
					Change banner
				</span>
			</div>
		</button>
	{/snippet}

	{#snippet logoOverlay()}
		<!--
			Absolute overlay on top of the logo circle. Group hover is on the
			parent div in OrgPageShell (class="group relative"), so these
			group-hover: classes respond to hovering anywhere on the logo area.
		-->
		<button
			type="button"
			onclick={openLogoPopup}
			aria-label="Change logo"
			class="absolute inset-0 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100"
		>
			<!-- Blur + dim -->
			<div class="absolute inset-0 rounded-full backdrop-blur-xs"></div>
			<!-- Centered pencil -->
			<div class="absolute inset-0 flex items-center justify-center">
				<Pencil class="size-5 text-white drop-shadow" />
			</div>
		</button>
	{/snippet}

	{#snippet actions()}
		<!-- Save / Cancel replace Bookmark + Join during edit -->
		<Button
			href="/organizations/{org.id}"
			variant="secondary"
			size="lg"
			class="cursor-pointer px-4 text-sm shadow-lg sm:px-6 sm:text-base"
		>
			Cancel
		</Button>
		<Button
			type="submit"
			form="edit-org-form"
			size="lg"
			disabled={!canSubmit}
			class="cursor-pointer px-4 text-sm shadow-lg sm:px-6 sm:text-base"
		>
			{submitting ? 'Saving…' : 'Save'}
		</Button>
	{/snippet}

	<OrgPageContent>
		<form
			id="edit-org-form"
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					if (result.type === 'failure' && result.data?.errors) {
						serverErrors = result.data.errors as Record<string, string>;
					} else {
						serverErrors = {};
					}
					await update({ reset: false });
				};
			}}
		>
			<!-- Hidden inputs for state-managed fields -->
			{#each Array.from(selectedCategoryIds) as id}
				<input type="hidden" name="categoryIds" value={id} />
			{/each}
			<input type="hidden" name="websiteUrl" value={websiteUrl} />
			<input type="hidden" name="feedbackUrl" value={feedbackUrl} />
			<input type="hidden" name="logoUrl" value={logoUrl} />
			<input type="hidden" name="bannerImageUrl" value={bannerImageUrl} />
			<input type="hidden" name="abbreviation" value={abbreviation} />
			<input type="hidden" name="establishedDate" value={establishedDate} />

			<!-- Organization Header -->
			<div class="my-8">
				<!-- Name -->
				<div class="mb-3">
					<input
						name="name"
						bind:value={name}
						aria-invalid={!!(nameError || serverErrors.name)}
						class="title-field w-full"
						title="Edit organization name"
					/>
					{#if nameError || serverErrors.name}
						<p class="mt-1 text-sm text-destructive">{nameError || serverErrors.name}</p>
					{/if}
				</div>

				<!-- Categories -->
				<div class="flex flex-wrap gap-2">
					{#each allCategories as category (category.id)}
						<button
							type="button"
							onclick={() => toggleCategory(category.id)}
							class="cursor-pointer transition-opacity"
							class:opacity-30={!selectedCategoryIds.has(category.id)}
							title={selectedCategoryIds.has(category.id) ? 'Remove category' : 'Add category'}
						>
							<Badge
								variant="secondary"
								style="background-color: {category.color}20; border: 1px solid {category.color}; color: {category.color};"
								class="pointer-events-none text-xs sm:text-sm"
							>
								{category.name}
							</Badge>
						</button>
					{/each}
				</div>
			</div>

			<!-- Quick Details -->
			<div class="mb-8 space-y-4">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
					<Detail icon={Calendar} label="Established">
						{#snippet children()}
							<input
								type="date"
								name="establishedDate"
								bind:value={establishedDate}
								class="inline-field text-xs sm:text-sm"
								title="Edit established date"
							/>
						{/snippet}
					</Detail>

					<Detail icon={Mail} label="Contact">
						{#snippet children()}
							<input
								type="email"
								name="contactEmail"
								bind:value={contactEmail}
								aria-invalid={!!(emailError || serverErrors.contactEmail)}
								class="inline-field text-xs sm:text-sm"
								title="Edit contact email"
							/>
							{#if emailError || serverErrors.contactEmail}
								<p class="mt-0.5 text-xs text-destructive">
									{emailError || serverErrors.contactEmail}
								</p>
							{/if}
						{/snippet}
					</Detail>

					<Detail icon={Globe} label="Website">
						{#snippet children()}
							<input
								type="url"
								name="websiteUrl"
								bind:value={websiteUrl}
								placeholder="https://"
								class="inline-field text-xs sm:text-sm"
								title="Edit website URL"
							/>
						{/snippet}
					</Detail>
				</div>
			</div>

			<!-- About Organization -->
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold sm:text-2xl">About Organization</h2>
				<textarea
					name="description"
					bind:value={description}
					rows={4}
					class="inline-field no-border w-full resize-none text-sm leading-relaxed sm:text-base"
					title="Edit description"
				></textarea>
			</div>
		</form>

		<!-- Upcoming Events (read-only) -->
		{#if upcomingEvents && upcomingEvents.length > 0}
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold sm:text-2xl">Upcoming Events</h2>
				<CardGrid itemCount={upcomingEvents.length} variant="featured" cardType="event">
					{#each upcomingEvents as event (event.id)}
						<EventCard {event} variant="featured" onclick={() => openEvent(event)} />
					{/each}
				</CardGrid>
			</div>
		{/if}

		<!-- Past Events (read-only) -->
		{#if pastEvents && pastEvents.length > 0}
			<div class="mb-8">
				<h2 class="mb-4 text-xl font-bold sm:text-2xl">Past Events</h2>
				<div class="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 md:grid-cols-3 md:gap-6">
					{#each pastEvents as event (event.id)}
						<EventCard {event} variant="general" onclick={() => openEvent(event)} />
					{/each}
				</div>
			</div>
		{/if}
	</OrgPageContent>
</OrgPageShell>

<!-- Banner URL modal — centered on screen -->
{#if bannerPopupOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) bannerPopupOpen = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') bannerPopupOpen = false;
		}}
	>
		<div class="mx-4 w-full max-w-sm rounded-xl bg-background p-5 shadow-xl">
			<p class="mb-3 text-sm font-medium">Banner image URL</p>
			<input
				type="url"
				bind:value={tempBannerUrl}
				placeholder="https://example.com/banner.jpg"
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2"
				onkeydown={(e) => {
					if (e.key === 'Enter') saveBannerUrl();
					if (e.key === 'Escape') bannerPopupOpen = false;
				}}
			/>
			<div class="mt-4 flex justify-end gap-2">
				<Button variant="ghost" size="sm" onclick={() => (bannerPopupOpen = false)}>Cancel</Button>
				<Button size="sm" onclick={saveBannerUrl}>Apply</Button>
			</div>
		</div>
	</div>
{/if}

<!-- Logo URL modal — centered on screen -->
{#if logoPopupOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) logoPopupOpen = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') logoPopupOpen = false;
		}}
	>
		<div class="mx-4 w-full max-w-sm rounded-xl bg-background p-5 shadow-xl">
			<p class="mb-3 text-sm font-medium">Logo image URL</p>
			<input
				type="url"
				bind:value={tempLogoUrl}
				placeholder="https://example.com/logo.png"
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2"
				onkeydown={(e) => {
					if (e.key === 'Enter') saveLogoUrl();
					if (e.key === 'Escape') logoPopupOpen = false;
				}}
			/>
			<div class="mt-4 flex justify-end gap-2">
				<Button variant="ghost" size="sm" onclick={() => (logoPopupOpen = false)}>Cancel</Button>
				<Button size="sm" onclick={saveLogoUrl}>Apply</Button>
			</div>
		</div>
	</div>
{/if}

<!-- Event Dialog -->
<EventDialog
	event={selectedEvent}
	open={eventDialogOpen}
	onOpenChange={(open) => (eventDialogOpen = open)}
	onBookmark={() => {}}
	onRSVP={() => {}}
	isBookmarked={false}
/>

<style>
	.title-field {
		background: transparent;
		border: none;
		outline: none;
		padding: 0;
		margin: 0;
		font-family: inherit;
		font-style: inherit;
		font-variant: inherit;
		letter-spacing: inherit;
		color: inherit;
		display: block;
		/* Size is set by Tailwind classes on the element */
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.1;
		font-weight: 700;
	}

	@media (min-width: 640px) {
		.title-field {
			font-size: 2.25rem;
		}
	}
	@media (min-width: 768px) {
		.title-field {
			font-size: 3rem;
		}
	}

	.inline-field {
		background: transparent;
		border: none;
		border-bottom: 1.5px solid transparent;
		border-radius: 0;
		outline: none;
		padding: 0;
		font-family: inherit;
		font-style: inherit;
		font-weight: inherit;
		color: inherit;
		letter-spacing: inherit;
		line-height: inherit;
		display: block;
	}

	.inline-field:hover {
		border-bottom-color: color-mix(in srgb, currentColor 30%, transparent);
	}

	.inline-field:focus {
		border-bottom-color: color-mix(in srgb, currentColor 60%, transparent);
	}

	.inline-field[aria-invalid='true'] {
		border-bottom-color: var(--color-destructive, #ef4444);
	}

	/* Suppress the underline for the description textarea */
	.no-border,
	.no-border:hover,
	.no-border:focus {
		border-bottom-color: transparent !important;
	}

	.inline-field[type='date']::-webkit-calendar-picker-indicator {
		opacity: 0.4;
		cursor: pointer;
	}
</style>
