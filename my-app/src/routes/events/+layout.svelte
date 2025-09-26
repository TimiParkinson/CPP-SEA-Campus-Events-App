<script lang="ts">
    let { children } = $props();
</script>

<nav>
    <a href="/">home</a>
    <a href="/events">events</a>
</nav>

{@render children()}