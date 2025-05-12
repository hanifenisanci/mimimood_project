<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import "../app.css"; // Assuming a global stylesheet
</script>

<div class="app-container">
  <Navbar />
  <main class="main-content">
    <slot />
  </main>
</div>

<style>
  
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #e0f7fa;
  }

  .main-content {
    flex-grow: 1;
    padding: 1rem;
    
  }
</style>

