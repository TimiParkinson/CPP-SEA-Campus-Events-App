<script lang="ts">
  let username = '';
  let password = '';
  let message: string | null = null;

  let step: 'username' | 'password' = 'username';

  function handleUsernameNext() {
    if (!username.trim()) {
      message = 'Please enter your username.';
      return;
    }
    message = null;
    step = 'password';
  }

  function handleSubmit() {
    if (!password.trim()) {
      message = 'Please enter your password.';
      return;
    }
    message = `Welcome back, ${username}!`;
    // TODO: call your API here
  }
</script>

<form class="flex flex-col gap-4">
  <h2 class="text-xl font-semibold text-center text-foreground">Sign In</h2>

  {#if step === 'username'}
    <label class="flex flex-col gap-1">
      <span class="text-sm text-muted-foreground">Username</span>
      <input
        type="text"
        bind:value={username}
        placeholder="Your username"
        class="bg-zinc-900/60 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary text-white backdrop-blur-sm"
      />
    </label>
    <button
      type="button"
      class="mt-2 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
      on:click={handleUsernameNext}
    >
      Next
    </button>
  {:else}
    <label class="flex flex-col gap-1">
      <span class="text-sm text-muted-foreground">Password</span>
      <input
        type="password"
        bind:value={password}
        placeholder="••••••••"
        class="bg-zinc-900/60 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary text-white backdrop-blur-sm"
      />
    </label>
    <button
      type="button"
      class="mt-2 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
      on:click={handleSubmit}
    >
      Sign In
    </button>
  {/if}

  {#if message}
    <p class="text-center text-sm text-muted-foreground mt-2">{message}</p>
  {/if}

  <a
    href="/auth/register"
    class="text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 cursor-pointer"
  >
    Don't have an account? Register
  </a>
</form>
