<script lang="ts">
    import { onMount } from "svelte";

    // Mock data (we'll replace later)
    type Sub = { name: string; logo?: string};
    type Ev = { title: string; date: string; image?: string; location?: string };

    // Mock user data (later this will come from the DB via +page.server.ts)
    let user = { name: 'umarDaGoat', avatar: ''};

    // Subscription list (clubs/ orgs)
    let subscriptions: Sub[] = [
        { name: 'SEA'}, {name: 'CPP Official' }, {name: 'NSBE' },
        {name: 'E=sports' }, { name: 'Anime'}, { name: 'UAV-SAR'},
        {name: 'Chess' }
    ];

    // Events list (mock data with title/date/location)
    let events: Ev[] = [
        { title: 'SEA Hack Night', date: 'Tomorrow • 6:00 PM', location: 'Bldg 9, Lab 213' },
        { title: 'NSBE Resume Clinic', date: 'Fri • 3:00 PM', location: 'Career Center' },
        { title: 'Anime Screening', date: 'Sat • 7:30 PM', location: 'Ursa Minor' }
    ];

    // Skeleton loader logic
    // "loading" = true means show gray placeholders first
    let loading = true;

    // When the component mounts, wait 800ms then flip loading = false
    onMount(() => {
        const t = setTimeout(() => (loading = false), 800);
        return () => clearTimeout(t); // cleanup if component unmounts
    });
</script>

<!-- Container for the whole page-->
 <div class ="mx-auto max-w-6xl px-4 py-6">
    <!--Profile section-->
    <section class="flex items-center justify-between">
        <div class="flex items-center gap-3">
            {#if loading}
                <!--Skeleton avatar-->
                <div class="h-40 w-10 rounded bg-gray-200 animate-pulse"></div>
                <!--Skeleton username-->
                <div class="h-6 w-10 rounded bg-gray-200 animate-pulse"></div>
            {:else}
                <!--Real avatar(empty gray circle for now)-->
                <div class="h-15 w-15 rounded-full bg-gray-100"></div>
                <!--Real username-->
                <h1 class="text-3xl font-semibold">{user.name}</h1>
            {/if}
        </div>

        <!--Icons on the right-->
        <div class="flex items-center gap-4 text-gray-500">
            <!--Icon emoji palceholders for now-->
            <button aria-label="Notifications">🔔</button>
            <button aria-label="Settings">⚙️</button>
        </div>
    </section>
    <!--Subscriptions preview-->
    <section class="mt-12">
        <!--Header row for this section-->
        <div class="mb-2 flex items-center justify-between">
            <!--Section title-->
            <h2 class="text-xl font-semibold">Your Subscriptions →</h2>
            <!--Link to a page that lists all subsriptions-->
            <a href="/subscriptions" class="text-sm underline">See all</a>
        </div>

        <!--Horizontal scroll roll-->
        <div class="flex gap-8 overflow-x-auto pb-2">
            {#if loading}
                <!--Render 8 skeleton "org chips" while loading, dont care about the value-->
                {#each Array(8) as _}
                    <div class="shrink-0 w-24">
                        <!--Circular skeleton for the org logo-->
                        <div class="mx-auto h-16 w-16 rounded bg-gray-200 animate-pulse"></div>
                        <!--Small rectangle skeleton where the org names will show-->
                        <div class="mx-auto mt-2 h-3 w-14 rounded bg-gray-200 animate-pulse"></div>
                    </div>
                {/each}
            {:else}
                <!--Loop through subscriptions array and render each item as 's'-->  
                {#each subscriptions as s}
                    <!--(Link to org page later)-->
                    <a class="shrink-0 w-24" href="#">
                        <!--Round logo container (empty for now put <img src ={s.logo})-->
                        <div class="mx-auto h-26 w-26 rounded-full bg-gray-200 overflow-hidden"></div>
                        <!--Org name centered; truncate prevents long name from wrapping-->
                        <p class="mt-2 text-center text-sm truncate">{s.name}</p>
                    </a>
                {/each}
            {/if}
        </div>     
    </section>
 </div>
