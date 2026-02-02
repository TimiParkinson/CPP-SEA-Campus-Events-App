<script lang="ts">
	import OrgAvatar from '../orgs/OrgAvatar.svelte';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';
	import type { Organization } from '$lib/types/index.js';

	interface Props {
		organization: Organization;
		variant?: 'general' | 'featured';
		onclick?: () => void;
	}

	let { organization, variant = 'general', onclick }: Props = $props();

	const isFeatured = $derived(variant === 'featured');
	const shouldAbbreviate = $derived(organization.name.length > 23);
	const abbreviation = $derived(
		organization.abbreviation || generateAbbreviation(organization.name)
	);
</script>

{#if isFeatured}
	<!-- Featured -->
	<button
		{onclick}
		title={organization.name}
		aria-label="View details for {organization.name}"
		class="group aspect-square w-full cursor-pointer overflow-hidden rounded-full shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
	>
		<OrgAvatar {organization} size="featured" />
	</button>
{:else}
	<!-- General -->
	<div class="w-full">
		<div
			role="button"
			title={organization.name}
			aria-label="View details for {organization.name}"
			tabindex="0"
			{onclick}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onclick?.();
				}
			}}
			class="group relative flex h-full cursor-pointer flex-col items-center justify-between overflow-hidden rounded-xl bg-card p-3 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none sm:p-4"
		>
			<!-- Avatar -->
			<div class="mb-auto flex w-full items-center justify-center py-2">
				<OrgAvatar {organization} size="xl" />
			</div>

			<!-- Content -->
			<div class="flex w-full flex-col items-center gap-1.5 text-center sm:gap-2">
				<!-- Title -->
				<a href={`/organizations/${organization.id}`} class="w-full cursor-pointer hover:underline">
					<p class="text-xs leading-tight font-semibold text-foreground sm:text-sm">
						{#if shouldAbbreviate}
							<span class="block">{abbreviation}</span>
						{:else}
							<span class="line-clamp-2">{organization.name}</span>
						{/if}
					</p>
				</a>

				<!-- Categories -->
				{#if organization.categories && organization.categories.length > 0}
					<div class="flex flex-wrap justify-center gap-1">
						{#each organization.categories.slice(0, 2) as category}
							<a
								href="/search?tag={encodeURIComponent(category.name)}"
								class="cursor-pointer rounded-full px-1.5 py-0.5 text-[9px] font-medium transition-opacity hover:opacity-80 sm:px-2 sm:text-[10px]"
								style="background-color: {category.color}40; border: 1px solid {category.color}80; color: {category.color};"
							>
								{category.name}
							</a>
						{/each}
						{#if organization.categories.length > 2}
							<span
								class="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground sm:px-2 sm:text-[10px]"
							>
								+{organization.categories.length - 2}
							</span>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
