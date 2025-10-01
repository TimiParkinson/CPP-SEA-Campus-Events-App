<script lang="ts">
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";

    import { CalendarPlus, Clock, Heart, Star } from "@lucide/svelte";

    // Static Values
    const event = {
        title: "SEA General Meeting",
        organization: "SEA",
        time: "12:00pm – 1:00pm",
        description_name: "Description_Name",
        location: "Location",
        synopsis: "Synopsis",
        labels: ["General", "Workshop"],
        rating: 4,
        isFavorite: false,
    };
</script>

<!-- Event Header -->
<Card.Root
    class="flex justify-end h-60 gap-3 border-none bg-linear-to-b from-gray-400 to-black rounded-4xl"
>
    <Card.Header>
        <Card.Title class="text-white text-5xl font-semibold"
            >{event.title}</Card.Title
        >
        <Card.Description class="text-[#F5EFF7]/80"
            >{event.organization}</Card.Description
        >
    </Card.Header>

    <Card.Content>
        <Card.Action class="space-x-2 flex items-center">
            <Button class="bg-[#F7F2FA] cursor-pointer text-zinc-800">
                <CalendarPlus strokeWidth="2.8" />
                Add</Button
            >
            <Badge variant="buttonMimic" class="bg-[#F7F2FA] text-zinc-800">
                <Clock strokeWidth="2.8" />{event.time}</Badge
            >
        </Card.Action>
    </Card.Content>
</Card.Root>

<!-- Filters? -->
<div class="flex justify-center gap-1 my-6">
    {#each event.labels as label, i}
        <Button
            class="rounded-4xl w-32 cursor-pointer"
            variant={i === 0 ? "default" : "outline"}>{label}</Button
        >
    {/each}
</div>

<!-- Description Cards -->
<Card.Root
    class="flex flex-row justify-between bg-transparent shadow-none rounded-none border-t-0 border-x-0 border-b-2"
>
    <Card.Header class="flex grow items-center gap-4 p-0">
        <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
        <div class="space-y-2">
            <Card.Title class="font-normal text-2xl"
                >{event.description_name}</Card.Title
            >
            <div class="text-sm text-muted-foreground">
                <p>{event.location}</p>
                <p>{event.synopsis}</p>
            </div>
        </div>
    </Card.Header>

    <Card.Action class="flex items-center gap-4">
        <div class="flex">
            {#each Array(5) as _, i}
                <Star
                    color="#625B71"
                    fill={i < event.rating ? "#FFCC00" : "#625B71"}
                    strokeWidth="0"
                    class="w-5"
                />
            {/each}
        </div>
        <Button
            class="cursor-pointer"
            variant="ghost"
            onclick={() => (event.isFavorite = !event.isFavorite)}
        >
            <Heart
                class="size-4, {event.isFavorite
                    ? 'fill-[#FF2600] stroke-[#FF2600]'
                    : 'fill-[#625B71] stroke-[#625B71]'}"
                strokeWidth="2.8"
            />
        </Button>
    </Card.Action>
</Card.Root>
