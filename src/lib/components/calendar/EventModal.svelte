<script lang="ts">
	import type { CalendarEvent, CreateDraft } from '$lib/calendar/types';
	import { calendars, upsertEvent, selectedEventId } from '$lib/calendar/store';

	interface Props {
		draft: CreateDraft;
		selected: CalendarEvent | null;
		events: CalendarEvent[];
		onClose: () => void;
	}
	let { draft, selected, events, onClose }: Props = $props();

	// Editable form fields (owned by this component)
	let title = $state('');
	let description = $state('');
	let location = $state('');
	let calendarId = $state('local');
	let start = $state(new Date());
	let end = $state(new Date());
	let allDay = $state(false);

	// Sync form state when selected/draft changes (avoids “captures initial value” warnings)
	$effect(() => {
		title = selected?.title ?? '';
		description = selected?.description ?? '';
		location = selected?.location ?? '';
		calendarId = selected?.calendarId ?? $calendars[0]?.id ?? 'local';

		start = new Date(draft.start);
		end = new Date(draft.end);
		allDay = draft.allDay;
	});

	const nearby = $derived(() => {
		const center = start.getTime();
		const win = 2 * 60 * 60 * 1000; // +/- 2h
		return events
			.map((e) => ({ e, t: new Date(e.start).getTime() }))
			.filter(({ t, e }) => Math.abs(t - center) <= win && e.id !== selected?.id)
			.sort((a, b) => Math.abs(a.t - center) - Math.abs(b.t - center))
			.slice(0, 6)
			.map(({ e }) => e);
	});

	const conflicts = $derived(() => {
		const s = start.getTime();
		const en = end.getTime();
		return events
			.filter((e) => e.id !== selected?.id)
			.filter((e) => {
				const es = new Date(e.start).getTime();
				const ee = new Date(e.end).getTime();
				return !(ee <= s || es >= en);
			})
			.slice(0, 6);
	});

	function save() {
		const id = upsertEvent({
			id: selected?.id,
			calendarId,
			title: title.trim() || '(No title)',
			description: description.trim() || undefined,
			location: location.trim() || undefined,
			start: start.toISOString(),
			end: end.toISOString(),
			allDay,
			source: selected?.source ?? 'local',
			uid: selected?.uid,
			recurrenceRule: selected?.recurrenceRule,
			lastModified: new Date().toISOString(),
			raw: selected?.raw
		});
		selectedEventId.set(id);
		onClose();
	}
</script>


<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onclick={onClose}>
	<div
		class="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl backdrop-blur"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
			<div class="text-sm font-semibold text-white/80">{selected ? 'Edit Event' : 'New Event'}</div>
			<button class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10" onclick={onClose}>
				Close
			</button>
		</div>

		<div class="grid gap-4 p-4 md:grid-cols-[1fr_280px]">
			<div class="space-y-3">
				<input
					class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-base text-white/85 outline-none focus:border-white/20"
					placeholder="Title"
					bind:value={title}
				/>

				<div class="grid gap-2 md:grid-cols-2">
					<div class="rounded-xl border border-white/10 bg-white/5 p-3">
						<div class="text-xs text-white/40">Start</div>
						<div class="text-sm text-white/80">{start.toLocaleString()}</div>
						<div class="mt-2 flex gap-2">
							<button class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10" onclick={() => (start = addMinutes(start, -15))}>-15m</button>
							<button class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10" onclick={() => (start = addMinutes(start, 15))}>+15m</button>
						</div>
					</div>

					<div class="rounded-xl border border-white/10 bg-white/5 p-3">
						<div class="text-xs text-white/40">End</div>
						<div class="text-sm text-white/80">{end.toLocaleString()}</div>
						<div class="mt-2 flex gap-2">
							<button class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10" onclick={() => (end = addMinutes(end, -15))}>-15m</button>
							<button class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10" onclick={() => (end = addMinutes(end, 15))}>+15m</button>
						</div>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<input id="allday" type="checkbox" bind:checked={allDay} />
					<label for="allday" class="text-sm text-white/70">All-day</label>
				</div>

				<select
					class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 outline-none focus:border-white/20"
					bind:value={calendarId}
				>
					{#each $calendars as c (c.id)}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>

				<input
					class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/85 outline-none focus:border-white/20"
					placeholder="Location"
					bind:value={location}
				/>

				<textarea
					class="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/85 outline-none focus:border-white/20"
					placeholder="Notes"
					bind:value={description}
				/>

				<div class="flex justify-end gap-2">
					<button
						class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 hover:bg-white/10"
						onclick={onClose}
					>
						Cancel
					</button>
					<button
						class="rounded-xl border border-white/10 bg-white/15 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/20"
						onclick={save}
					>
						Save
					</button>
				</div>
			</div>

			<div class="space-y-3">
				<div class="rounded-xl border border-white/10 bg-white/5 p-3">
					<div class="mb-2 text-xs font-semibold text-white/50">Conflicts</div>
					{#if conflicts.length === 0}
						<div class="text-xs text-white/35">None</div>
					{:else}
						<div class="space-y-2">
							{#each conflicts as ev (ev.id)}
								<div class="rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white/75">
									<div class="truncate font-semibold">{ev.title}</div>
									<div class="text-white/45">
										{#if ev.allDay}
											All-day
										{:else}
											{toLocalTimeLabel(new Date(ev.start))} – {toLocalTimeLabel(new Date(ev.end))}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<div class="rounded-xl border border-white/10 bg-white/5 p-3">
					<div class="mb-2 text-xs font-semibold text-white/50">Happening around then</div>
					{#if nearby.length === 0}
						<div class="text-xs text-white/35">No suggestions</div>
					{:else}
						<div class="space-y-2">
							{#each nearby as ev (ev.id)}
								<div class="rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white/75">
									<div class="truncate font-semibold">{ev.title}</div>
									<div class="text-white/45">
										{#if ev.allDay}
											All-day
										{:else}
											{toLocalTimeLabel(new Date(ev.start))}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
