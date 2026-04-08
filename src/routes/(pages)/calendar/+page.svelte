<!-- src/routes/(whatever)/calendar/+page.svelte  (REPLACE FILE CONTENT) -->
<script lang="ts">
	import TabSwitcher from '$lib/components/discover/TabSwitcher.svelte';
	import CalendarShell from '$lib/components/calendar/CalendarShell.svelte';

	let selectedTab = $state<'day' | 'week' | 'month'>('week');
</script>

<svelte:head>
	<title>Calendar - CPP SEA Campus Events</title>
	<meta
		name="description"
		content="Explore events happening on the CPP SEA Campus with our interactive calendar."
	/>
</svelte:head>

<div class="pt-24">
	<div
		class="mb-8 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h1 class="mb-2 text-3xl font-bold sm:text-4xl lg:text-5xl">Calendar</h1>
			<p class="text-sm sm:text-base">
				Explore events happening on the CPP SEA Campus with our interactive calendar
			</p>
		</div>

		<TabSwitcher
			tabs={[
				{ value: 'day', label: 'Day' },
				{ value: 'week', label: 'Week' },
				{ value: 'month', label: 'Month' }
			]}
			selected={selectedTab}
			onSelect={(value) => (selectedTab = value)}
		/>
	</div>

	<CalendarShell view={selectedTab} />
</div>
