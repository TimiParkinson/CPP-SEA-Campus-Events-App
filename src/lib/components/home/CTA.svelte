<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { UserPlus } from '@lucide/svelte';
	import { Card, CardContent, CardTitle } from '../ui/card/index.js';
</script>

<Card class="my-10 flex flex-col items-center py-10">
	<CardTitle class="text-xl font-bold sm:text-2xl md:text-3xl"
		>Track your campus involvement.</CardTitle
	>
	<CardContent>
		<Button href="/register" variant="outline" style="padding: 1.5rem 2rem;">
			<UserPlus class="size-5" />
			<span class="text-base font-semibold">Sign Up</span>
		</Button>
	</CardContent>
</Card>
