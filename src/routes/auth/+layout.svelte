<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { onMount } from 'svelte';

  // Keep tab in sync with URL path
  $: currentTab = $page.url.pathname.includes('/signin') ? 'signin' : 'register';

  function handleTabChange(value: string) {
    goto(`/auth/${value}`);
  }
</script>

<!-- Fixed full-screen overlay so modal is centered and background doesn't scroll -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  <div class="w-full max-w-md">
    <Card.Root class="border bg-popover shadow-lg">
      <Card.Header class="space-y-1 text-center p-6">
        <Card.Title class="text-2xl font-semibold">Welcome</Card.Title>
        <Card.Description>
          {currentTab === 'register' ? 'Create an account to get started' : 'Sign in to your account'}
        </Card.Description>
      </Card.Header>

      <Card.Content class="px-6 pb-4 pt-2">
        <Tabs.Root value={currentTab} onValueChange={handleTabChange}>
          <Tabs.List class="grid w-full grid-cols-2 gap-2 mb-6">
            <Tabs.Trigger value="register">Register</Tabs.Trigger>
            <Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
          </Tabs.List>

          <div class="mt-2">
            <!-- Page content from nested routes will render here -->
            <slot />
          </div>
        </Tabs.Root>
      </Card.Content>

      <Card.Footer class="flex gap-2 p-4">
        <Button variant="ghost" class="w-full" on:click={() => goto('/')}>Back to home</Button>
      </Card.Footer>
    </Card.Root>
  </div>
</div>
