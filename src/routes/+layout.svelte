<script>
  import '$css'; 
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
  
  let { children } = $props();

  // Dynamically get routes from the file system
  const routeModules = import.meta.glob('/src/routes/**/+page.svelte', { eager: true });
  
  const routes = Object.keys(routeModules)
    .map(path => {
      const match = path.match(/\/src\/routes(.*)\/\+page\.svelte$/);
      if (!match) return null;
      
      const routePath = match[1] || '/';
      const pathParts = routePath.split('/').filter(Boolean);
      if (pathParts.length > 1) return null;
      if (routePath === '/') return null; // Exclude home from navigation links
      if (pathParts[0].startsWith('_')) return null; // Exclude routes
      if (pathParts[0] === 'auth') return null; // Exclude auth from navigation
      const name = routePath === '/' 
        ? '' 
        : pathParts[0]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      
      return { name, path: routePath === '/' ? '' : routePath };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.path === '/') return -1;
      if (b.path === '/') return 1;
      return a.name.localeCompare(b.name);
    });

  
  let currentPath = $derived($page.url.pathname);
</script>

<div class="app">
  <header class="navbar">
    <div class="nav-container">
      <!-- Logo -->
      <a href="/" class="logo-link">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-primary">Campus Events</span>
            <span class="logo-secondary">Your Campus Hub</span>
          </div>
        </div>
      </a>

      <!-- Navigation Menu -->
      <NavigationMenu.Root class="nav-menu">
        <NavigationMenu.List class="nav-list">
          {#each routes as route}
            <NavigationMenu.Item>
              <NavigationMenu.Link 
                href={route.path}
                class="nav-item {currentPath === route.path ? 'active' : ''}"
              >
                {route.name}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {/each}
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <!-- Actions -->
      <div class="nav-actions">
        <Button variant="ghost" size="icon" class="search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </Button>
        <Button 
          variant="default" 
          class="signin-btn cursor-pointer"
          onclick={() => goto('/auth')}
        >
          Sign In
        </Button>
      </div>
    </div>
  </header>

  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
  }

  .app {
    min-height: 100vh;
    background: hsl(var(--background));
  }

  /* Navbar */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: hsl(var(--background) / 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid hsl(var(--border));
    box-shadow: 0 1px 3px hsl(var(--foreground) / 0.03);
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  /* Logo */
  .logo-link {
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .logo-link:hover {
    opacity: 0.85;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(var(--primary-foreground));
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.25);
  }

  .logo-icon svg {
    width: 22px;
    height: 22px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .logo-primary {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    line-height: 1.2;
  }

  .logo-secondary {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    font-weight: 500;
  }

  /* Navigation */
  :global(.nav-menu) {
    flex: 1;
  }

  :global(.nav-list) {
    gap: 0.25rem;
    justify-content: center;
  }

  :global(.nav-item) {
    padding: 0.5rem 1rem !important;
    font-size: 0.9375rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
    border-radius: 8px;
    transition: all 0.2s;
    position: relative;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }

  :global(.nav-item::after) {
    content: '';
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 50%;
    height: 2px;
    background: hsl(var(--primary));
    border-radius: 2px;
    transition: transform 0.2s;
  }

  :global(.nav-item:hover) {
    color: hsl(var(--foreground));
    background: hsl(var(--accent));
  }

  :global(.nav-item:hover::after) {
    transform: translateX(-50%) scaleX(1);
  }

  :global(.nav-item.active) {
    color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);
    font-weight: 600;
  }

  :global(.nav-item.active::after) {
    transform: translateX(-50%) scaleX(1);
  }

  /* Actions */
  .nav-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  :global(.search-btn) {
    color: hsl(var(--muted-foreground));
  }

  :global(.signin-btn) {
    font-weight: 600;
  }

  /* Content */
  .content {
    margin-top: 72px;
    padding: 2rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .logo-secondary {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .nav-container {
      flex-wrap: wrap;
      gap: 1rem;
    }

    .logo-link {
      order: 1;
    }

    .nav-actions {
      order: 2;
    }

    :global(.nav-menu) {
      order: 3;
      width: 100%;
    }

    :global(.nav-list) {
      justify-content: flex-start;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    :global(.nav-list::-webkit-scrollbar) {
      display: none;
    }

    .content {
      margin-top: 120px;
      padding: 1rem;
    }
  }
</style>