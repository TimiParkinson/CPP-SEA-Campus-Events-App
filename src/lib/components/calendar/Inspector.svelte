<!-- src/lib/components/calendar/Inspector.svelte -->
<script lang="ts">
	import type { CalendarEvent } from '$lib/calendar/types';
	import { calendars, deleteEvent } from '$lib/calendar/store';
	import { toLocalTimeLabel } from '$lib/calendar/util';

	interface Props {
		events: CalendarEvent[];
		selected: CalendarEvent | null;
		onCreate: () => void;
		onEdit: () => void;
	}
	let { events, selected, onCreate, onEdit }: Props = $props();

	function calColor(id: string) {
		return $calendars.find((c) => c.id === id)?.color ?? '#3b82f6';
	}

	const s = $derived(selected ? new Date(selected.start) : null);
	const e = $derived(selected ? new Date(selected.end) : null);
</script>

<aside class="w-[320px] shrink-0 border-l border-white/10 bg-zinc-950/40">
	<div class="flex h-full flex-col p-4">
		<div class="mb-3 flex items-center justify-between">
			<div class="text-sm font-semibold text-white/80">Details</div>
			<button
				class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
				onclick={onCreate}
			>
				+ New
			</button>
		</div>

		{#if !selected}
			<div class="flex flex-1 items-center justify-center text-sm text-white/35">No Event Selected</div>
		{:else}
			<div class="space-y-3">
				<div class="flex items-start gap-2">
					<span class="mt-1 size-3 rounded-sm" style={`background:${calColor(selected.calendarId)}`} />
					<div class="min-w-0">
						<div class="truncate text-base font-semibold text-white/85">{selected.title}</div>
						<div class="text-xs text-white/45">
							{#if selected.allDay}
								All-day
							{:else if s && e}
								{toLocalTimeLabel(s)} – {toLocalTimeLabel(e)}
							{/if}
						</div>
					</div>
				</div>

				{#if selected.location}
					<div class="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/70">
						<div class="text-xs text-white/40">Location</div>
						<div>{selected.location}</div>
					</div>
				{/if}

				{#if selected.description}
					<div class="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/70">
						<div class="text-xs text-white/40">Notes</div>
						<div class="whitespace-pre-wrap">{selected.description}</div>
					</div>
				{/if}

				<div class="flex gap-2">
					<button
						class="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/10"
						onclick={onEdit}
					>
						Edit
					</button>
					<button
						class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20"
						onclick={() => deleteEvent(selected.id)}
					>
						Delete
					</button>
				</div>
			</div>
		{/if}
	</div>
</aside>
