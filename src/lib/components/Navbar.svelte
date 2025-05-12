<script lang="ts">
  import { page } from '$app/stores';
</script>

<nav class="navbar">
  <div class="navbar-brand">
    <a href="/">
      <img src="/logo.png" alt="Mimimood Logo" class="logo" />
      <span>mimimood</span>
    </a>
  </div>
  <div class="navbar-links">
    {#if !$page.data.user}
      <a href="/login" class:active={$page.url.pathname === 
'/login'}>Login</a>
      <a href="/register" class:active={$page.url.pathname === 
'/register'}>Register</a>
    {:else}
      <a href="/dashboard/mood-tracker" class:active={$page.url.pathname === 
'/dashboard/mood-tracker'}>Mood Tracker</a>
      <a href="/dashboard/stats" class:active={$page.url.pathname === 
'/dashboard/stats'}>My Stats</a>
      <a href="/logout">Logout</a>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #3498db; /* Blue base for navbar */
    color: white;
  }
  .navbar-brand a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
  }
  .logo {
    height: 40px;
    margin-right: 0.5rem;
  }
  .navbar-brand span {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .navbar-links a {
    color: white;
    text-decoration: none;
    margin-left: 1.5rem;
    padding: 0.5rem;
    border-radius: 4px;
  }
  .navbar-links a:hover,
  .navbar-links a.active {
    background-color: #2980b9; /* Darker blue for hover/active */
    text-decoration: underline;
  }
  
</style>

