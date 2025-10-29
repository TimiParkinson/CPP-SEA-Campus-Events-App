<script lang="ts">
  import FilterDialog from '$lib/components/filterDialog.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as InputGroup from '$lib/components/ui/input-group/index.js';
  import {
    AlarmClock,
    Calendar,
    MapPin,
    Search,
    UsersRound,
    X,
    Filter as FilterIcon,
    type Icon
  } from '@lucide/svelte';
  import Badge from '$lib/components/ui/badge/badge.svelte';
  import { events, organizations, type Event, type Organization } from '$lib/stores/enrichedDataExample.js';
  
  let searchQuery = $state('');
  let filterDialogOpen = $state(false);
  let selectedView = $state<'events' | 'organizations'>('events');
  let selectedFilter = $state<'all' | 'upcoming' | 'past' | 'thisMonth'>('all');
  let selectedTags = $state<string[]>([]);
  
  // Get all unique tags from both events and organizations
  let allEventTags = $derived([...new Set(events.flatMap(e => e.tags))].sort());
  let allOrgTags = $derived([...new Set(organizations.flatMap(o => o.tags))].sort());
  let allTags = $derived(selectedView === 'events' ? allEventTags : allOrgTags);
  
  let filteredEvents = $derived(
    events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || event.tags.some(tag => selectedTags.includes(tag));
      
      // Apply time-based filter
      const now = new Date();
      const eventStart = new Date(event.start_time);
      const eventEnd = new Date(event.end_time);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      let matchesTimeFilter = true;
      if (selectedFilter === 'upcoming') {
        matchesTimeFilter = eventStart > now;
      } else if (selectedFilter === 'past') {
        matchesTimeFilter = eventEnd < now;
      } else if (selectedFilter === 'thisMonth') {
        matchesTimeFilter = eventStart >= startOfMonth && eventStart <= endOfMonth;
      }
      
      return matchesSearch && matchesTags && matchesTimeFilter;
    })
  );
  
  let filteredOrganizations = $derived(
    organizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           org.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || org.tags.some(tag => selectedTags.includes(tag));
      return matchesSearch && matchesTags;
    })
  );
  
  function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
</script>

<main class="container mx-auto px-4 py-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <Button 
      variant="outline" 
      class="cursor-pointer gap-2"
      onclick={() => filterDialogOpen = true}
    >
      <FilterIcon class="h-4 w-4" />
      Filter
      <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span class="text-xs">⌘</span>K
      </kbd>
    </Button>
  </div>
  
  <FilterDialog 
    bind:open={filterDialogOpen}
    bind:selectedView
    bind:selectedFilter
    bind:selectedTags
    {allTags}
  />
  
  <!-- Search Bar -->
  <InputGroup.Root class="mb-6">
    <InputGroup.Input 
      placeholder="Search..." 
      bind:value={searchQuery}
    />
    <InputGroup.Addon>
      <Search class="h-4 w-4" />
    </InputGroup.Addon>
  </InputGroup.Root>
  
  <!-- Content based on selected view -->
  {#if selectedView === 'events'}
    <section class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {#if filteredEvents.length === 0}
        <p class="text-muted-foreground">No events found</p>
      {/if}
      {#each filteredEvents as event (event.id)}
        <Dialog.Root>
          <button
            class="cursor-pointer self-start text-left hover:opacity-80 transition-opacity"
            onclick={() => {}}
          >
            <div class="flex flex-col">
              <div class="temp-img"></div>
              <h2 class="mt-2 line-clamp-1 font-semibold">{event.title}</h2>
              <p class="text-sm text-muted-foreground">
                {new Date(event.start_time).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: '2-digit'
                })}
              </p>
            </div>
          </button>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{event.title}</Dialog.Title>
              <Dialog.Description>
                {event.description}
              </Dialog.Description>
            </Dialog.Header>
            <section class="space-y-6">
              {#if event.tags.length > 0}
                <div>
                  <div class="flex flex-wrap gap-2">
                    {#each event.tags as tag}
                      <Badge variant="secondary">{tag}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}
              <div class="grid grid-cols-2 gap-4">
                {@render eventDetail('Date', event.start_time.toString(), Calendar)}
                {@render eventDetail('Time', `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`, AlarmClock)}
                {@render eventDetail('Location', event.location, MapPin)}
                {@render eventDetail('Organization', event.organizer, UsersRound)}
              </div>
              <div class="mt-16">
                <Button class="cursor-pointer w-full">View Full Event Details</Button>
              </div>
            </section>
          </Dialog.Content>
        </Dialog.Root>
      {/each}
    </section>
  {:else}
    <section class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
      {#if filteredOrganizations.length === 0}
        <p class="text-muted-foreground">No organizations found</p>
      {/if}
      {#each filteredOrganizations as org (org.id)}
        <Dialog.Root>
          <button
            class="cursor-pointer self-start text-left hover:opacity-80 transition-opacity"
            onclick={() => {}}
          >
            <div class="flex flex-col">
              <div class="temp-img"></div>
              <h2 class="mt-2 line-clamp-1 font-semibold">{org.name}</h2>
              <p class="text-sm text-muted-foreground">{org.events.length} events</p>
            </div>
          </button>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{org.name}</Dialog.Title>
              <Dialog.Description>
                {org.description}
              </Dialog.Description>
            </Dialog.Header>
            <section class="space-y-6">
              {#if org.tags.length > 0}
                <div>
                  <h3 class="text-sm font-medium mb-2">Categories</h3>
                  <div class="flex flex-wrap gap-2">
                    {#each org.tags as tag}
                      <Badge variant="secondary">{tag}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}
              <div>
                <h3 class="text-sm font-medium mb-2">Events</h3>
                <p class="text-sm text-muted-foreground">
                  This organization has {org.events.length} {org.events.length === 1 ? 'event' : 'events'}
                </p>
              </div>
              <div class="mt-16">
                <Button class="cursor-pointer w-full">View Full Organization</Button>
              </div>
            </section>
          </Dialog.Content>
        </Dialog.Root>
      {/each}
    </section>
  {/if}
</main>

{#snippet eventDetail(label: string, detail: string, icon: typeof Icon)}
  <div class="flex items-center gap-3">
    <div>
      {#if icon === Calendar}
        <Calendar class="h-5 w-5 text-muted-foreground" />
      {:else if icon === AlarmClock}
        <AlarmClock class="h-5 w-5 text-muted-foreground" />
      {:else if icon === MapPin}
        <MapPin class="h-5 w-5 text-muted-foreground" />
      {:else if icon === UsersRound}
        <UsersRound class="h-5 w-5 text-muted-foreground" />
      {/if}
    </div>
    <div>
      <h3 class="text-sm font-medium text-muted-foreground">{label}</h3>
      <p class="text-sm">
        {#if label === 'Date'}
          {new Date(detail).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        {:else}
          {detail}
        {/if}
      </p>
    </div>
  </div>
{/snippet}

<style>
  .temp-img {
    width: 160px;
    aspect-ratio: 1;
    background-color: hsl(var(--muted));
    border-radius: 16px;
  }
</style>