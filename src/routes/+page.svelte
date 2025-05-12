<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<div class="landing-page-container text-center">
  <img src="/logo.png" alt="Mimimood Logo" class="landing-logo" />
  <h1 class="slogan">Track your mood <br /> get to know yourself better</h1>
  <button class="cta-button pink" on:click={() => goto("/register")}>
    Let's Start
  </button>
</div>

<style>
  .landing-page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 80px); /* Adjust 80px based on Navbar height */
    padding: 2rem;
    background-color: #e0f7fa; /* Light blue background */
  }

  .landing-logo {
    max-width: 200px;
    margin-bottom: 2rem;
  }

  .slogan {
    font-size: 2.5rem;
    color: #2c3e50; /* Darker text */
    margin-bottom: 2.5rem;
    line-height: 1.4;
  }

  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    /* Pink button style is already in app.css, but can be overridden or extended here */
  }
</style>

