<!-- src/lib/components/calendar/Sidebar.svelte -->
<script lang="ts">
	import { calendars, toggleCalendar } from '$lib/calendar/store';
	import { hexToRgba } from '$lib/calendar/util';
	
	let q = $state('');

	const filtered = $derived($calendars.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())));
</script>

<aside class="w-[260px] shrink-0 border-r border-white/10 bg-zinc-950/40">
	<div class="p-4">
		<div class="mb-3 flex items-center justify-between">
			<div class="text-sm font-semibold text-white/80">Calendars</div>
			<div class="text-xs text-white/40">iCloud</div>
		</div>

		<input
			class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 placeholder:text-white/30 outline-none focus:border-white/20"
			placeholder="Search"
			bind:value={q}
		/>

		<div class="mt-4 space-y-1">
			{#each filtered as c (c.id)}
				<button
					class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-white/5"
					onclick={() => toggleCalendar(c.id)}
				>
					<span
						class="size-3 rounded-sm border border-white/20"
						style={`background:${c.enabled ? c.color : hexToRgba(c.color, 0.15)}`}
					/>
					<span class="flex-1 text-white/80">{c.name}</span>
					<span class="text-xs text-white/30">{c.enabled ? 'on' : 'off'}</span>
				</button>
			{/each}
		</div>

		<div class="mt-6 border-t border-white/10 pt-4 text-xs text-white/40">
			<div class="mb-2">ICS</div>
			<div class="space-y-2">
				<a
					href="/api/calendar/ics/export"
					class="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
				>
					Export (demo)
				</a>
				<label class="block cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
					<input class="hidden" type="file" accept=".ics,text/calendar" />
					Import (wire to /api…)
				</label>
			</div>
		</div>
	</div>
</aside>
