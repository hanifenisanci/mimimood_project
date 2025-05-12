<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte"; // Main Navbar is already created
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Placeholder for user data 
  let user = { name: "User" }; 

  // Mock authentication check 
  onMount(() => {
    
  });
</script>

<div class="dashboard-layout">
  
  <!-- <Navbar /> --> 
  <header class="dashboard-header">
    <h2>Welcome back, {user.name}!</h2>
    <p>Ready to check in on your well-being?</p>
  </header>
  
  <nav class="dashboard-nav">
    <a href="/dashboard/mood-tracker" class:active={$page.url.pathname.startsWith("/dashboard/mood-tracker")}>Mood Tracker</a>
    <a href="/dashboard/stats" class:active={$page.url.pathname.startsWith("/dashboard/stats")}>My Stats</a>
   
  </nav>

  <main class="dashboard-content">
    <slot />
  </main>

  <footer class="dashboard-footer">
    <p>&copy; {new Date().getFullYear()} Mimimood. Stay positive!</p>
  </footer>
</div>

<style>
  .dashboard-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Ensure it takes full height */
  }

  .dashboard-header {
    background-color: #2980b9; /* Darker blue for dashboard header */
    color: white;
    padding: 1.5rem 2rem;
    text-align: center;
  }

  .dashboard-header h2 {
    margin: 0 0 0.5rem 0;
    color: white;
  }

  .dashboard-nav {
    display: flex;
    justify-content: center;
    background-color: #3498db; /* Main blue for sub-nav */
    padding: 0.5rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .dashboard-nav a {
    color: white;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.3s ease;
  }

  .dashboard-nav a:hover,
  .dashboard-nav a.active {
    background-color: #e91e63; /* Pink accent for active/hover link */
    border-radius: 4px;
  }

  .dashboard-content {
    flex-grow: 1;
    padding: 2rem;
    background-color: #f4f9fc; /* Very light blue/grey for content background */
  }

  .dashboard-footer {
    text-align: center;
    padding: 1rem;
    background-color: #2c3e50; /* Dark footer */
    color: #ecf0f1;
    font-size: 0.9rem;
  }
</style>

