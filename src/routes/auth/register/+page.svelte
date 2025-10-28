<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Icon } from '$lib/components/ui/icon/index.js'; // optional

  let step = 1;
  let username = '';
  let password = '';
  
  let loading = false;
  let error = '';

  async function submitUsername() {
    error = '';
    if (!username.trim()) {
      error = 'Please enter a username or email.';
      return;
    }
    loading = true;
    try {
      // Optionally: validate username here, or call backend to check availability
      await new Promise((r) => setTimeout(r, 300)); // placeholder
      step = 2;
    } catch (err) {
      error = 'Failed — try again.';
    } finally {
      loading = false;
    }
  }

  async function submitPassword() {
    error = '';
    if (!password) {
      error = 'Please enter a password.';
      return;
    }
    loading = true;
    try {
      // TODO: Replace with Supabase signup:
      // import { createClient } from '@supabase/supabase-js'
      // const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
      // await supabase.auth.signUp({ email: username, password })
      await new Promise((r) => setTimeout(r, 700)); // placeholder
      // on success:
      goto('/'); // or to a welcome page
    } catch (err) {
      error = 'Sign up failed. ' + (err?.message ?? '');
    } finally {
      loading = false;
    }
  }

  async function handleOAuth(provider: 'google' | 'microsoft') {
    // TODO: Replace with supabase.auth.signInWithOAuth({ provider })
    loading = true;
    try {
      await new Promise((r) => setTimeout(r, 400));
      // supabase redirect will actually redirect; here we simulate success
      goto('/');
    } catch (err) {
      error = 'OAuth failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="space-y-4">
  {#if step === 1}
    <div class="space-y-2">
      <label class="text-sm font-medium">Username or email</label>
      <Input bind:value={username} placeholder="you@example.com or username" on:keydown={(e) => e.key === 'Enter' && submitUsername()} />
      {#if error}<p class="text-xs text-destructive">{error}</p>{/if}
      <div class="flex gap-2">
        <Button class="mt-2" on:click={submitUsername} disabled={loading}>
          {#if loading}Checking…{:else}Continue{/if}
        </Button>
      </div>
    </div>

    <div class="pt-4 border-t mt-4">
      <p class="text-xs text-muted-foreground">Or sign up with</p>
      <div class="flex gap-2 mt-2">
        <Button class="flex-1" on:click={() => handleOAuth('google')} disabled={loading}>Google</Button>
        <Button class="flex-1" on:click={() => handleOAuth('microsoft')} disabled={loading}>Microsoft</Button>
      </div>
    </div>
  {/if}

  {#if step === 2}
    <div class="space-y-2">
      <label class="text-sm font-medium">Create password</label>
      <Input type="password" bind:value={password} placeholder="Choose a password" on:keydown={(e) => e.key === 'Enter' && submitPassword()} />
      {#if error}<p class="text-xs text-destructive">{error}</p>{/if}

      <div class="flex gap-2 mt-2">
        <Button variant="ghost" on:click={() => { step = 1; error = ''; }}>Back</Button>
        <Button on:click={submitPassword} disabled={loading}>
          {#if loading}Creating…{:else}Create account{/if}
        </Button>
      </div>
    </div>

    <div class="pt-4 border-t mt-4 text-sm text-muted-foreground">
      <p>Signed up before? <a class="underline cursor-pointer" on:click={() => goto('/auth/signin')}>Sign in</a></p>
    </div>
  {/if}
</div>
