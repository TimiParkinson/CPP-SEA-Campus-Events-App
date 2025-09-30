<script lang="ts">
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";

    import { CalendarPlus, Clock, Heart, Star } from "@lucide/svelte";
</script>

<!-- Event Header -->
<Card.Root
    class="flex justify-end h-60 gap-3 bg-linear-to-b from-gray-400 to-black rounded-4xl"
>
    <Card.Header>
        <Card.Title class="text-white text-5xl font-semibold"
            >SEA General Meeting</Card.Title
        >
        <Card.Description class="text-[#F5EFF7]/80">SEA</Card.Description>
    </Card.Header>

    <Card.Content>
        <Card.Action class="space-x-2 flex items-center">
            <Button
                class="bg-[#F7F2FA] text-zinc-800 hover:bg-[#F7F2FA] hover:cursor-pointer"
            >
                <CalendarPlus strokeWidth="2.8" />
                Add</Button
            >
            <Badge variant="buttonMimic" class="bg-[#F7F2FA] text-zinc-800">
                <Clock strokeWidth="2.8" />12:00pm - 1:00pm</Badge
            >
        </Card.Action>
    </Card.Content>
</Card.Root>

<!-- Filters? -->
<div class="flex justify-center gap-1 my-6">
    <Button class="rounded-4xl w-32">Label</Button>
    <Button variant="outline" class="rounded-4xl w-32">Label</Button>
</div>

<!-- Description Cards -->
<Card.Root
    class="flex flex-row justify-between shadow-none rounded-none border-t-0 border-x-0 border-b-2"
>
    <Card.Header class="flex grow items-center gap-4 p-0">
        <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
        <div class="space-y-2">
            <Card.Title class="font-normal text-2xl"
                >Description_Name</Card.Title
            >
            <div class="text-sm text-muted-foreground">
                <p>Location</p>
                <p>Synopsis</p>
            </div>
        </div>
    </Card.Header>

    <Card.Action class="flex items-center gap-4">
        <div class="flex">
            {#each Array(5) as _}
                <Star
                    color="#625B71"
                    fill="#625B71"
                    strokeWidth="0"
                    class="w-5"
                />
            {/each}
        </div>
        <Heart color="#625B71" strokeWidth="2.8" class="w-6" />
    </Card.Action>
</Card.Root>
