<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Calendar, Globe, Users, Mail } from '@lucide/svelte';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';
	import { formatFullDate } from '$lib/utils/dateFormatters.js';
	import BookmarkButton from '$lib/components/shared/BookmarkBtn.svelte';
	import Detail from '../shared/Detail.svelte';

	interface Organization {
		id: string;
		name: string;
		description?: string | null;
		logoUrl?: string | null;
		abbreviation?: string;
		categories?: Array<{ name: string; color: string }>;
		memberCount?: number | null;
		establishedDate?: Date | null;
		websiteUrl?: string | null;
		contactEmail?: string;
	}

	interface Props {
		organization: Organization | null;
		open: boolean;
		onOpenChange: (open: boolean) => void;
		onBookmark?: () => void;
		onJoin?: () => void;
		isBookmarked?: boolean;
	}

	let {
		organization,
		open,
		onOpenChange,
		onBookmark,
		onJoin,
		isBookmarked = false
	}: Props = $props();

	let gradient = $derived(organization ? getRandomGradient(organization.id) : '');
	let descriptionExpanded = $state(false);
	const MAX_DESCRIPTION_LENGTH = 200;

	let displayAbbreviation = $derived(
		organization ? organization.abbreviation || generateAbbreviation(organization.name) : ''
	);

	let shouldTruncateDescription = $derived(
		organization?.description && organization.description.length > MAX_DESCRIPTION_LENGTH
	);

	let displayedDescription = $derived(() => {
		if (!organization?.description) return '';
		if (!shouldTruncateDescription || descriptionExpanded) return organization.description;
		return organization.description.slice(0, MAX_DESCRIPTION_LENGTH) + '...';
	});

	// Calculate font size for dialog logo based on abbreviation length - AGGRESSIVE shrinking
	let dialogLogoFontSize = $derived(() => {
		const length = displayAbbreviation.length;
		if (length <= 2) return 'text-5xl sm:text-6xl md:text-7xl tracking-tighter';
		if (length <= 3) return 'text-4xl sm:text-5xl md:text-6xl tracking-tight';
		if (length <= 4) return 'text-3xl sm:text-4xl md:text-5xl tracking-tight';
		if (length <= 5) return 'text-2xl sm:text-3xl md:text-4xl tracking-tight';
		if (length <= 6) return 'text-xl sm:text-2xl md:text-3xl tracking-normal';
		if (length <= 8) return 'text-lg sm:text-xl md:text-2xl tracking-normal';
		if (length <= 10) return 'text-base sm:text-lg md:text-xl tracking-normal';
		if (length <= 12) return 'text-sm sm:text-base md:text-lg tracking-normal';
		return 'text-xs sm:text-sm md:text-base tracking-normal';
	});

	function handleViewFullOrg() {
		if (organization) {
			window.location.href = `/organizations/${organization.id}`;
		}
	}

	function handleWebsiteClick() {
		if (organization?.websiteUrl) {
			window.open(organization.websiteUrl, '_blank');
		}
	}

	function handleEmailClick() {
		if (organization?.contactEmail) {
			window.location.href = `mailto:${organization.contactEmail}`;
		}
	}

	function handleCategoryClick(categoryName: string) {
		console.log('Filter by category:', categoryName);
	}

	function handleBookmarkClick(e: MouseEvent) {
		onBookmark?.();
	}

	function handleJoinClick() {
		onJoin?.();
	}

	function toggleDescription() {
		descriptionExpanded = !descriptionExpanded;
	}
</script>

<Dialog.Root {open} {onOpenChange}>
	<Dialog.Content
		class="max-h-[85vh] w-[calc(100vw-2rem)] max-w-2xl gap-0 overflow-hidden overflow-y-auto p-0 sm:max-h-[90vh] sm:w-full"
	>
		{#if organization}
			<!-- Organization Header with Gradient Background -->
			<div
				class="relative h-48 shrink-0 overflow-hidden sm:h-56 md:h-64"
				style="background: {gradient};"
			>
				{#if !organization.logoUrl}
					<!-- Circular Logo ONLY when no image logo provided -->
					<div class="absolute inset-0 flex items-center justify-center">
						<div
							class="size-36 overflow-hidden rounded-full border-4 border-white/20 bg-black/10 backdrop-blur-sm sm:size-40 md:size-44"
						>
							<!-- Circle with club name/abbreviation - ALWAYS SINGLE LINE, NO TRUNCATION -->
							<!-- PADDING: Adjust p-5/p-6/p-7 to control spacing around text -->
							<div class="flex size-full items-center justify-center p-5 sm:p-6 md:p-7">
								<span
									class="w-full text-center leading-none font-bold whitespace-nowrap text-white select-none {dialogLogoFontSize()}"
								>
									{displayAbbreviation}
								</span>
							</div>
						</div>
					</div>
				{:else}
					<!-- Image logo directly on gradient background (no circle) -->
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="size-36 sm:size-40 md:size-44">
							<img
								src={organization.logoUrl}
								alt={organization.name}
								class="size-full rounded-full object-cover"
							/>
						</div>
					</div>
				{/if}
			</div>

			<!-- CTAs positioned on border between header and content -->
			<div class="relative px-4 sm:px-5 md:px-8">
				<div
					class="absolute inset-x-4 -top-5 flex flex-wrap items-center justify-between gap-2 sm:inset-x-5 md:inset-x-8"
				>
					<!-- Left: Join & Bookmark -->
					<div class="flex items-center gap-2 sm:gap-3">
						<!-- Join (Primary) -->
						<Button
							onclick={handleJoinClick}
							class="h-9 cursor-pointer px-3 text-xs shadow-lg sm:h-10 sm:px-4 sm:text-sm"
						>
							Join
						</Button>

						<!-- Bookmark Button -->
						<BookmarkButton
							{isBookmarked}
							onclick={handleBookmarkClick}
							size="dialog"
							class="size-10 border bg-background shadow-lg sm:size-11"
						/>
					</div>

					<!-- Right: Member Count -->
					{#if organization.memberCount !== null && organization.memberCount !== undefined}
						<div
							class="flex h-9 items-center gap-1 rounded-lg border bg-black px-2 text-xs font-medium whitespace-nowrap shadow-lg sm:h-10 sm:gap-1.5 sm:px-2.5 sm:text-sm md:px-4"
						>
							<Users class="size-3 shrink-0 sm:size-3.5 md:size-4" />
							<span class="text-white">{organization.memberCount}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Content -->
			<div class="px-4 pt-8 pb-4 sm:px-5 sm:pt-9 sm:pb-5 md:px-8 md:pt-10 md:pb-8">
				<!-- Heading -->
				<div class="mb-5 space-y-2 sm:mb-6">
					<!-- Title -->
					<h2 class="text-lg leading-tight font-bold sm:text-xl md:text-2xl">
						{organization.name}
					</h2>

					<!-- Description -->
					{#if organization.description}
						<p class="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
							{displayedDescription()}
							{#if shouldTruncateDescription}
								<button
									onclick={toggleDescription}
									class="mt-1 mb-4 block cursor-pointer text-xs font-semibold text-primary underline hover:underline sm:text-sm"
								>
									{descriptionExpanded ? 'Read Less' : 'Read More'}
								</button>
							{/if}
						</p>
					{/if}

					<!-- Categories -->
					{#if organization.categories && organization.categories.length > 0}
						<div class="flex flex-wrap gap-1.5 sm:gap-2">
							{#each organization.categories as category}
								<button
									onclick={() => handleCategoryClick(category.name)}
									class="cursor-pointer transition-opacity hover:opacity-80"
								>
									<Badge
										variant="secondary"
										style="background-color: {category.color}20; border: 1px solid {category.color}; color: {category.color};"
										class="text-[10px] sm:text-xs"
									>
										{category.name}
									</Badge>
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Organization Details Grid -->
				<div class="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 md:gap-6">
					<!-- Established Date -->
					{#if organization.establishedDate}
						<Detail
							icon={Calendar}
							label="Established"
							value={formatFullDate(organization.establishedDate)}
						/>
					{/if}

					<!-- Website (Clickable) -->
					{#if organization.websiteUrl}
						<Detail
							icon={Globe}
							label="Website"
							value={organization.websiteUrl}
							clickable={true}
							onclick={handleWebsiteClick}
						/>
					{/if}

					<!-- Contact Email (Clickable) -->
					{#if organization.contactEmail}
						<Detail
							icon={Mail}
							label="Contact"
							value={organization.contactEmail}
							clickable={true}
							onclick={handleEmailClick}
						/>
					{/if}
				</div>

				<!-- View Full Organization -->
				<Button
					onclick={handleViewFullOrg}
					variant="outline"
					class="w-full cursor-pointer py-5 text-xs sm:py-6 sm:text-sm"
				>
					View Full Organization Details
				</Button>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
