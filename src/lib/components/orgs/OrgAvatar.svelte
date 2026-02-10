<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar/index.js';
	import { getRandomGradient } from '$lib/utils/gradients.js';
	import { generateAbbreviation } from '$lib/utils/orgNameFormatters.js';
	import type { Organization } from '$lib/types/index.js';

	interface Props {
		organization: Organization;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'featured';
	}

	let { organization, size = 'md' }: Props = $props();

	const gradient = $derived(getRandomGradient(organization.id));
	const abbreviation = $derived(
		organization.abbreviation || generateAbbreviation(organization.name)
	);

	const sizeClasses = {
		xs: 'size-6',
		sm: 'size-8',
		md: 'size-10',
		lg: 'size-12',
		xl: 'size-16',
		featured: 'size-full'
	};

	const fontSizeClasses = {
		xs: 'text-[10px]',
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
		xl: 'text-xl',
		featured: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
	};
</script>

<Avatar class={sizeClasses[size]}>
	<AvatarImage src={organization.logoUrl} alt={organization.name} class="object-cover" />
	<AvatarFallback
		class="font-bold text-white transition-transform group-hover:scale-105"
		style="background: {gradient};"
	>
		<span class={fontSizeClasses[size] + ' leading-none tracking-tight'}>
			{abbreviation}
		</span>
	</AvatarFallback>
</Avatar>
