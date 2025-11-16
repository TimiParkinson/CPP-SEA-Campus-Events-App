<script lang="ts">
	import OrgCard from '../cards/OrgCard.svelte';
	import OrgDialog from '../dialogs/OrgDialog.svelte';
	import CardGrid from '$lib/components/cards/CardGrid.svelte';
	import { ArrowRight } from '@lucide/svelte';

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
		organizations: Organization[];
		title?: string;
		subtitle?: string;
	}

	let {
		organizations,
		title = 'Featured Organizations',
		subtitle = 'Join one of these popular groups and meet new people'
	}: Props = $props();

	// Dialog state
	let selectedOrg = $state<Organization | null>(null);
	let dialogOpen = $state(false);
	let bookmarkedOrgs = $state<Set<string>>(new Set());

	function openOrg(org: Organization) {
		selectedOrg = org;
		dialogOpen = true;
	}

	function toggleOrgBookmark(orgId: string) {
		if (bookmarkedOrgs.has(orgId)) {
			bookmarkedOrgs.delete(orgId);
		} else {
			bookmarkedOrgs.add(orgId);
		}
		bookmarkedOrgs = bookmarkedOrgs;
	}

	function handleJoin() {
		console.log('Join clicked');
	}
</script>

<section class="bg-black py-10 sm:py-12 lg:py-16">
	<div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div
			class="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end"
		>
			<div>
				<h2 class="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
					{title}
				</h2>
				<p class="text-sm text-gray-400 sm:text-base">
					{subtitle}
				</p>
			</div>
			<a
				href="/discover?tab=orgs"
				class="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
			>
				<span>Discover more orgs</span>
				<ArrowRight class="size-4 transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		<!-- Organization Grid - Using CardGrid with featured variant and org type -->
		<CardGrid itemCount={organizations.length} variant="featured" cardType="org">
			{#each organizations as org (org.id)}
				<OrgCard organization={org} variant="featured" onclick={() => openOrg(org)} />
			{/each}
		</CardGrid>
	</div>
</section>

<!-- Organization Dialog -->
<OrgDialog
	organization={selectedOrg}
	open={dialogOpen}
	onOpenChange={(open) => (dialogOpen = open)}
	onBookmark={() => selectedOrg && toggleOrgBookmark(selectedOrg.id)}
	onJoin={handleJoin}
	isBookmarked={selectedOrg ? bookmarkedOrgs.has(selectedOrg.id) : false}
/>
