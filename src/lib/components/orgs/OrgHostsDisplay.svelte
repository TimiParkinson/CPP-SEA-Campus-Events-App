<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import OrgAvatar from './OrgAvatar.svelte';
	import OrgAvatarGroup from './OrgAvatarGroup.svelte';
	import { formatOrgsForDisplay } from '$lib/utils/orgNameFormatters.js';
	import type { Organization } from '$lib/types/index.js';

	interface Props {
		organizations: Organization[];
		maxLength?: number;
		onOrgClick?: (orgId: string) => void;
		size?: 'sm' | 'md';
	}

	let { organizations, maxLength = 50, onOrgClick, size = 'sm' }: Props = $props();

	let popoverOpen = $state(false);

	const displayResult = $derived(formatOrgsForDisplay(organizations, maxLength));
	const textClasses = $derived(size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base');
	const avatarSize = $derived(size === 'sm' ? 'sm' : 'md');
	const buttonClasses = $derived(
		size === 'sm' ? 'h-11 gap-2 px-3' : 'h-11 gap-2 px-3 sm:gap-3 sm:px-4'
	);

	function handleOrgClick(orgId: string) {
		popoverOpen = false;
		onOrgClick?.(orgId);
	}
</script>

{#if organizations.length === 0}
	<!-- Empty state -->
{:else if organizations.length === 1}
	<!-- Single Organization -->
	<button
		onclick={() => handleOrgClick(organizations[0].id)}
		class="group flex {buttonClasses} cursor-pointer items-center rounded-lg border bg-popover/90 backdrop-blur-sm transition-colors hover:bg-popover hover:text-accent-foreground"
	>
		<OrgAvatar organization={organizations[0]} size={avatarSize} />
		<span
			class="hidden font-semibold whitespace-nowrap {textClasses} transition-opacity group-hover:opacity-80 sm:inline"
		>
			{organizations[0].name}
		</span>
	</button>
{:else if displayResult.showMenu}
	<!-- 4+ Organizations -->
	<Popover.Root bind:open={popoverOpen}>
		<Popover.Trigger
			class="group flex {buttonClasses} cursor-pointer items-center rounded-lg border bg-popover/90 backdrop-blur-sm transition-colors hover:bg-popover hover:text-accent-foreground"
		>
			<OrgAvatarGroup {organizations} max={2} size={avatarSize} />
			<span
				class="hidden font-semibold whitespace-nowrap {textClasses} transition-opacity group-hover:opacity-80 sm:inline"
			>
				{displayResult.text}
			</span>
		</Popover.Trigger>

		<Popover.Content
			class="z-50 w-[calc(100vw-2rem)] max-w-xs rounded-lg border border-border bg-popover p-2 shadow-lg sm:w-80"
			align="start"
			side="top"
			sideOffset={8}
		>
			<div class="space-y-1">
				{#each organizations as org}
					<button
						onclick={() => handleOrgClick(org.id)}
						class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<OrgAvatar organization={org} size="md" />
						<span class="min-w-0 flex-1 truncate text-sm font-medium">
							{org.name}
						</span>
					</button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>
{:else}
	<!-- 2-3 Organizations -->
	<div class="flex {buttonClasses} items-center rounded-lg border bg-popover/90 backdrop-blur-sm">
		<OrgAvatarGroup {organizations} max={3} size={avatarSize} />
		<span class="truncate font-semibold {textClasses}">
			{displayResult.text}
		</span>
	</div>
{/if}
