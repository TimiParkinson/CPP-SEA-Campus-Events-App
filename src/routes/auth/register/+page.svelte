<script lang="ts">
  let username = '';
  let password = '';
  let confirmPassword = '';
  let message: string | null = null;

  let step: 'username' | 'password' | 'confirm' = 'username';

  function handleUsernameNext() {
    if (!username.trim()) {
      message = 'Please enter a username.';
      return;
    }
    message = null;
    step = 'password';
  }

  function handlePasswordNext() {
    if (!password.trim()) {
      message = 'Please enter a password.';
      return;
    }
    message = null;
    step = 'confirm';
  }

  function handleSubmit() {
    if (!confirmPassword.trim()) {
      message = 'Please confirm your password.';
      return;
    }
    if (password !== confirmPassword) {
      message = 'Passwords do not match.';
      return;
    }
    message = `Account for ${username} created successfully!`;
    // TODO: call your API here
  }
</script>

<form class="flex flex-col gap-4">
  <h2 class="text-xl font-semibold text-center text-foreground">Create Account</h2>

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
  {:else if step === 'password'}
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
      on:click={handlePasswordNext}
    >
      Next
    </button>
  {:else}
    <label class="flex flex-col gap-1">
      <span class="text-sm text-muted-foreground">Confirm Password</span>
      <input
        type="password"
        bind:value={confirmPassword}
        placeholder="••••••••"
        class="bg-zinc-900/60 border border-zinc-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary text-white backdrop-blur-sm"
      />
    </label>
    <button
      type="button"
      class="mt-2 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
      on:click={handleSubmit}
    >
      Register
    </button>
  {/if}

  {#if message}
    <p class="text-center text-sm text-muted-foreground mt-2">{message}</p>
  {/if}

  <a
    href="/auth/signin"
    class="text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 cursor-pointer"
  >
    Already have an account? Sign in
  </a>
</form>
