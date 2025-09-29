<script lang="ts">
	let { children } = $props();
</script>

<div id="body">
    <nav id="navBar">
        <a href="/">Home</a><br>
        <a href="/events">Events</a><br>
    </nav>

	<main>
        {@render children()}
    </main>
</div>

<style>
    #body {
        display: flex; 
        height:100%;
        background-color: rgb(210, 210, 210);
    }
    #navBar {
        text-align: center;
        width: 5%;
        color:rgb(93, 93, 93);
    }
    main{
        width:100%;
        height: 90%;
        background-color: white;
        border-radius: 10px;
    }
</style>