<script lang="ts">
    import type { Snippet } from 'svelte'; //used for reusable UI feats
    import { ArrowLeft } from '@lucide/svelte';
    import { getRandomGradient } from '$lib/utils/gradients.js';
    import type { Event } from '$lib/types/index.js';
	
    interface Props { // shared properties for the view event and edit event pages
        event: Event
        topRight?: Snippet;         // attendee count badge on the view page; nothing on edit
        hosts?: Snippet;            // OrgHostsDisplay on view; nothing or simplified on edit
        actions?: Snippet;          // Bookmark + RSVP on view; Save + Cancel on edit       
        bannerOverlay?: Snippet;    // hover-to-edit button on the edit page banner
        hideBackButton?: boolean;
        children: Snippet;
    }

    let { event,
          topRight, 
          hosts, 
          actions, 
          bannerOverlay, 
          hideBackButton = false, 
          children 
    } : Props = $props();

    let gradient = $derived(getRandomGradient(event.id));
    
    function handleBack() {
        window.history.back();
    }

</script>

<div class="min-h-screen">

    <!-- Banner -->
	<div class="relative h-64 overflow-hidden sm:h-80 md:h-96">
		<!-- Background Image/Gradient -->
		{#if event.imageUrl}
			<img src={event.imageUrl} alt={event.title} class="size-full object-cover object-center" />
		{:else}
			<div class="size-full" style="background: {gradient};"></div>
		{/if}

		<!-- Dark overlay -->
		<div class="absolute inset-0 bg-linear-to-t from-black/30 to-black/10"></div>

		<!-- Back Button -->
		<div class="absolute top-4 left-4 sm:top-6 sm:left-6">
			<button
				onclick={handleBack}
				class="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-white/90 hover:text-black sm:size-12"
				aria-label="Go back"
			>
				<ArrowLeft class="size-5 sm:size-6" />
			</button>
		</div>

		<!-- Top right slot (attendee count) -->
		{#if topRight}
			<div class="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
                {@render topRight()}
            </div>
		{/if}

        <!-- Banner edit overlay -->
        {#if bannerOverlay}
            {@render bannerOverlay()}
        {/if}
	</div>
    <!-- End Banner -->

    <!-- Primary CTA -->
	<div class="relative px-4 sm:px-6 lg:px-8">
		<div class="container mx-auto max-w-4xl">
			<div class="flex -translate-y-6 items-end justify-between gap-3 sm:gap-4">
				<!-- Hosts slot -->
				{#if hosts}
                    <div class="relative">
					    {@render hosts()}
                    </div>
				{:else}
                    <!-- spacer so actions stay right-aligned even with no hosts -->
                    <div></div>
                {/if}

				<!-- Actions slot -->
                {#if actions}
                    <div class="flex shrink-0 items-center gap-2 sm:gap-3">
                            {@render actions()}
                    </div>
                {/if}

			</div>
		</div>
	</div>
    <!-- End Primary CTA -->

    {@render children()}

  
</div>