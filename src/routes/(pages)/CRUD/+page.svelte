<script lang=ts>

    import { Input } from "$lib/components/ui/input/index.js";
    import TextArea from "$lib/components/ui/textarea/textarea.svelte";

</script>

<div class="pt-24">

    <h1 class="text-4xl mb-8 leading-tight font-bold">Edit Your Organization</h1>

    <h2 class="mb-4 text-xl font-bold sm:text-2xl">Name</h2>
    <Input type="orgName" placeholder="Organization Name" class="max-w-xs mb-4" />

    <h2 class="mb-4 text-xl font-bold sm:text-2xl">Description</h2>
    
</div>