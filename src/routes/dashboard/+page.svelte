<script lang="ts">
  import { onMount } from "svelte";

  let quote: { text: string; author: string } | null = null;
  let errorFetchingQuote = false;

  async function fetchQuote() {
    try {
      // Fetch quote from the internal backend API endpoint
      const response = await fetch("/api/quote"); 
      if (response.ok) {
        const data = await response.json();
        // The backend API directly returns the quote object { q: "text", a: "author" }
        if (data && data.q && data.a) {
          quote = { text: data.q, author: data.a };
          errorFetchingQuote = false;
        } else {
          console.error("Failed to parse quote data or empty response from backend");
          errorFetchingQuote = true;
        }
      } else {
        console.error("Failed to fetch quote from backend, status:", response.status);
        errorFetchingQuote = true;
      }
    } catch (error) {
      console.error("Error fetching quote from backend:", error);
      errorFetchingQuote = true;
    }
  }

  onMount(() => {
    fetchQuote();
  });

</script>

<div class="dashboard-overview card">
  <h3>Home</h3>
  <p>Welcome to your personal space for tracking and understanding your mood.</p>
  <p>Use the navigation above to log your mood or view your progress.</p>
  
  <div class="quote-section card" style="background-color: #f8bbd0; margin-top: 2rem;"> 
    <h4>Motivational Quote of the Day</h4>
    {#if quote}
      <blockquote class="quote-text">"{quote.text}"</blockquote>
      <p class="quote-author">- {quote.author}</p>
    {:else if errorFetchingQuote}
      <p>Could not load a quote at this time. Please try again later.</p>
    {:else}
      <p>Loading quote...</p>
    {/if}
    <p class="attribution">Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer">ZenQuotes API</a></p>
  </div>
</div>

<style>
  .dashboard-overview {
    text-align: center;
  }
  .dashboard-overview h3 {
    color: #3498db; /* Blue heading */
  }
  .quote-section {
    margin-top: 2rem;
    padding: 1.5rem;
    border-left: 5px solid #e91e63; /* Pink accent border */
    background-color: #fff9c4; /* Light yellow, can be adjusted */
  }
  .quote-text {
    font-size: 1.2rem;
    font-style: italic;
    margin-bottom: 0.5rem;
    color: #333;
  }
  .quote-author {
    text-align: right;
    font-weight: bold;
    color: #555;
    margin-bottom: 1rem; /* Added margin for spacing before attribution */
  }
  .attribution {
    font-size: 0.8rem;
    color: #777;
    text-align: center;
    margin-top: 1rem;
  }
  .attribution a {
    color: #555;
    text-decoration: none;
  }
  .attribution a:hover {
    text-decoration: underline;
  }
</style>
