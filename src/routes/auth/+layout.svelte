<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import gsap from 'gsap';

  let currentTab: 'signin' | 'register' = 'register';
  let card: HTMLElement;
  let tabButtons: NodeListOf<HTMLButtonElement>;

  onMount(() => {
    document.body.style.overflow = 'hidden';
    tabButtons = document.querySelectorAll('.tab-btn');

    gsap.from(card, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  afterUpdate(() => {
    gsap.to('.tab-content', {
      opacity: 0,
      y: 5,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to('.tab-content', {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    });

    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === currentTab;
      gsap.to(btn, {
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
        borderTopLeftRadius: isActive ? 0 : 12,
        borderTopRightRadius: isActive ? 0 : 12,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  });
</script>

<!-- Fullscreen modal overlay -->
<div class="fixed inset-0 flex items-center justify-center bg-zinc-900/95">
  <div
    bind:this={card}
    class="relative w-full max-w-md mx-auto p-0 rounded-3xl bg-zinc-800/90 shadow-2xl backdrop-blur-2xl border border-white/10 overflow-hidden"
  >
    <!-- Tabs -->
    <div class="flex space-x-2 mb-0">
      <button
        class="tab-btn flex-1 py-2 text-center font-medium transition-all duration-200"
        data-tab="signin"
        on:click={() => (currentTab = 'signin')}
      >
        Sign In
      </button>

      <button
        class="tab-btn flex-1 py-2 text-center font-medium transition-all duration-200"
        data-tab="register"
        on:click={() => (currentTab = 'register')}
      >
        Register
      </button>
    </div>

    <!-- Content area -->
    <div class="tab-content p-6 rounded-b-3xl bg-zinc-800/90 shadow-inner">
      {#if currentTab === 'register'}
        <slot name="register" />
      {:else}
        <slot name="signin" />
      {/if}
    </div>
  </div>
</div>

<style>
  .tab-btn {
    background: rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.6);
    border: none;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    cursor: pointer;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }

  .tab-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .tab-content {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
</style>
