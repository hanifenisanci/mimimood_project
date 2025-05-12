<script lang="ts">
  import { onMount } from "svelte";
  import { userSession } from "$lib/store"; // Import the user session store
  import { goto } from "$app/navigation";

  let selectedMood: string | null = null;
  let notes: string = "";
  let selectedDate: string = new Date().toISOString().split("T")[0];
  let errorMessage: string = "";
  let successMessage: string = "";
  let currentUserId: number | null = null;

  const moods = ["Happy", "Sad", "Neutral", "Excited", "Calm", "Anxious"];
  let alreadyLoggedToday = false;

  // Subscribe to userSession to get userId
  userSession.subscribe(value => {
    currentUserId = value.userId;
  });

  function selectMood(mood: string) {
    selectedMood = mood;
    errorMessage = "";
    successMessage = "";
  }

  async function handleSubmitMood() {
    errorMessage = "";
    successMessage = "";

    if (!selectedMood) {
      errorMessage = "Please select a mood.";
      return;
    }

    if (!currentUserId) {
      errorMessage = "User not identified. Please log in again.";
      
      return;
    }

    try {
      const response = await fetch("/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          date: selectedDate, 
          mood: selectedMood, 
          notes, 
          userId: currentUserId  
        }),
      });

      const result = await response.json();

      if (response.ok) {
        successMessage = result.message || "Mood saved successfully!";
        
        await checkExistingLog(); 
      } else {
        errorMessage = result.message || "Failed to save mood. Please try again.";
      }
    } catch (error) {
      console.error("Error submitting mood:", error);
      errorMessage = "An unexpected error occurred. Please try again.";
    }
  }

  async function checkExistingLog() {
    

    if (!currentUserId) {
      // Don't try to fetch if no user is logged in
      alreadyLoggedToday = false;
      return;
    }
    
    try {
      // Pass userId to the GET request as a query parameter
      const response = await fetch(`/api/moods?date=${selectedDate}&userId=${currentUserId}`);
      if (response.ok) {
        const moodEntries = await response.json(); // Expecting an array from the backend GET
        // Find if there's an entry for the selectedDate
        const entryForDate = moodEntries.find((entry: any) => {
            const entryDate = new Date(entry.date).toISOString().split('T')[0];
            return entryDate === selectedDate;
        });

        if (entryForDate) {
            selectedMood = entryForDate.mood;
            notes = entryForDate.notes || "";
            alreadyLoggedToday = true;
            
        } else {
            // Reset form if no log for this date for this user
            selectedMood = null; 
            notes = "";
            alreadyLoggedToday = false;
        }
      } else {
        // If error fetching (e.g. 404 if no entry), assume not logged
        selectedMood = null;
        notes = "";
        alreadyLoggedToday = false;
        // errorMessage = "Could not fetch existing mood entries.";
      }
    } catch (error) {
      console.error("Error checking existing log:", error);
      selectedMood = null;
      notes = "";
      alreadyLoggedToday = false;
      errorMessage = "Could not check existing mood entries.";
    }
  }

  onMount(() => {
    // Check if user is logged in, if not, redirect to login
    if (!currentUserId) {
      goto("/login");
    } else {
      checkExistingLog();
    }
  });

  // Watch for date changes to re-check existing logs
  $: if (selectedDate && currentUserId) {
    checkExistingLog();
  }

</script>

<div class="mood-tracker-page card">
  <h3>How are you feeling today?</h3>
  
  {#if successMessage}
    <p class="success-message">{successMessage}</p>
  {/if}
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}

  <div class="date-selector form-group">
    <label for="mood-date">Select Date:</label>
    <input type="date" id="mood-date" bind:value={selectedDate} />
  </div>

  <div class="mood-selection">
    <p>Select your mood:</p>
    <div class="mood-options">
      {#each moods as mood}
        <button 
          class="mood-button" 
          class:selected={selectedMood === mood} 
          on:click={() => selectMood(mood)}
          style="background-color: {selectedMood === mood ? '#e91e63' : '#3498db'};"
        >
          {mood}
        </button>
      {/each}
    </div>
  </div>

  <div class="notes-section form-group">
    <label for="mood-notes">Any notes? (Optional)</label>
    <textarea id="mood-notes" rows="4" bind:value={notes}></textarea>
  </div>

  <button class="submit-mood-button button pink" on:click={handleSubmitMood}>
    {#if alreadyLoggedToday}Update Mood{:else}Save Mood{/if}
  </button>
</div>

<style>
  .mood-tracker-page {
    max-width: 700px;
    margin: 2rem auto;
    background-color: white; /* Card background */
  }

  .mood-tracker-page h3 {
    text-align: center;
    color: #3498db; /* Blue heading */
    margin-bottom: 1.5rem;
  }

  .date-selector {
    margin-bottom: 1.5rem;
  }

  .mood-selection p {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .mood-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem; /* Spacing between mood buttons */
    margin-bottom: 1.5rem;
    justify-content: center;
  }

  .mood-button {
    padding: 0.75rem 1.25rem;
    border: 2px solid transparent;
    border-radius: 20px; /* Rounded buttons */
    cursor: pointer;
    color: white;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .mood-button:hover {
    opacity: 0.8;
  }

  .mood-button.selected {
    border-color: #c2185b; /* Darker pink border for selected */
    box-shadow: 0 0 10px rgba(233, 30, 99, 0.5);
  }

  .notes-section label {
    font-weight: 500;
  }

  .submit-mood-button {
    width: 100%;
    padding: 0.8rem;
    font-size: 1.1rem;
    margin-top: 1rem;
  }
  
  .success-message {
    color: green;
    background-color: #e8f5e9;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid green;
    text-align: center;
  }
  
  .error-message {
    color: red;
    background-color: #ffebee;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid red;
    text-align: center;
  }
</style>
