<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { Mood } from '@prisma/client'; 
  interface MoodEntryDisplay extends Mood {}

  let chartInstance: Chart | null = null;
  let moodEntries: MoodEntryDisplay[] = [];
  let selectedPeriod: string = "last7"; // Default to last 7 days
  let errorMessage: string | null = null;

  // Function to get the correct API endpoint for moods based on selected period
  function getMoodsApiEndpoint(userId: string, period: string): string {
    let startDate: Date | null = null;
    let endDate: Date | null = new Date(); // Today

    switch (period) {
      case "last7":
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "last30":
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "last90":
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "all":
        // No date filtering for 'all time'
        return `/api/moods?userId=${userId}`;
      default:
        // Fallback or error for unknown period
        console.warn("Unknown period selected:", period);
        return `/api/moods?userId=${userId}`;
    }
    // Format dates as YYYY-MM-DD for the API query parameters
    const startDateString = startDate ? startDate.toISOString().split('T')[0] : '';
    const endDateString = endDate ? endDate.toISOString().split('T')[0] : '';
    
    return `/api/moods?userId=${userId}&startDate=${startDateString}&endDate=${endDateString}`;
  }

  async function fetchMoodData() {
    errorMessage = null;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      errorMessage = 'User not logged in. Please log in to see your stats.';
      moodEntries = [];
      renderChart();
      return;
    }

    try {
      const apiUrl = getMoodsApiEndpoint(userId, selectedPeriod);
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data: MoodEntryDisplay[] = await response.json();
      moodEntries = data.sort((a: MoodEntryDisplay, b: MoodEntryDisplay) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error: any) {
      console.error('Error fetching mood data:', error);
      errorMessage = `Failed to load mood data: ${error.message}`;
      moodEntries = [];
    }
    renderChart();
  }

  function getMoodValue(mood: string): number {
    const moodMap: { [key: string]: number } = {
      'Awful': 1,
      'Sad': 2,
      'Okay': 3,
      'Good': 4,
      'Happy': 5,
    };
    return moodMap[mood] || 0;
  }

  function renderChart() {
    const canvas = document.getElementById('moodChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const labels = moodEntries.map(entry => new Date(entry.date).toLocaleDateString());
    const dataPoints = moodEntries.map(entry => getMoodValue(entry.mood));

    chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Over Time',
          data: dataPoints,
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          pointBackgroundColor: '#e91e63',
          pointBorderColor: '#e91e63',
          tension: 0.1,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: function(value: string | number) {
                const moodLabels: { [key: number]: string } = {
                  1: 'Awful',
                  2: 'Sad',
                  3: 'Okay',
                  4: 'Good',
                  5: 'Happy'
                };
                return moodLabels[Number(value)] || '';
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#333'
            }
          }
        }
      }
    });
  }

  onMount(() => {
    fetchMoodData();
  });

  $: if (typeof document !== 'undefined' && selectedPeriod) {
    fetchMoodData();
  }

</script>

<div class="stats-page card">
  <h3>Your Mood Statistics</h3>

  <div class="period-selector form-group">
    <label for="period">Select Period:</label>
    <select id="period" bind:value={selectedPeriod}>
      <option value="last7">Last 7 Days</option>
      <option value="last30">Last 30 Days</option>
      <option value="last90">Last 90 Days</option>
      <option value="all">All Time</option>
    </select>
  </div>

  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}

  <div class="chart-container card" style="height: 400px; background-color: #f0f8ff; border: 1px solid #add8e6;">
    <canvas id="moodChart"></canvas>
  </div>

  <div class="stats-display mt-6">
    {#if moodEntries.length > 0}
      <h4>Mood Entry History</h4>
      <ul class="mood-list">
        {#each moodEntries as entry (entry.id)}
          <li class="mood-entry card">
            <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
            <p><strong>Mood:</strong> <span class="mood-value {entry.mood.toLowerCase()}">{entry.mood}</span></p>
            {#if entry.notes}
              <p class="notes"><em>Notes: {entry.notes}</em></p>
            {/if}
          </li>
        {/each}
      </ul>
    {:else if !errorMessage}
      <p class="no-data-message">No mood entries found for the selected period. Start tracking your mood!</p>
    {/if}
  </div>

</div>

<style>
  .stats-page {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .stats-page h3 {
    text-align: center;
    color: #3498db; /* Blue heading */
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }

  .period-selector {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
  }
  .period-selector label {
    font-weight: bold;
    color: #2c3e50;
  }
  .period-selector select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    background-color: #ecf0f1;
    color: #2c3e50;
  }

  .chart-container {
    position: relative; 
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .stats-display h4 {
    color: #2980b9; 
    margin-bottom: 1rem;
    border-bottom: 2px solid #e0f7fa; 
    padding-bottom: 0.5rem;
    font-size: 1.4rem;
  }

  .mood-list {
    list-style: none;
    padding: 0;
  }

  .mood-entry {
    margin-bottom: 1rem;
    padding: 1rem;
    border-left: 5px solid #3498db; 
    background-color: #fdfefe;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .mood-entry .mood-value {
    font-weight: bold;
  }
  .mood-value.happy { color: #2ecc71; }
  .mood-value.good { color: #1abc9c; } 
  .mood-value.okay { color: #f1c40f; }
  .mood-value.sad { color: #e74c3c; }
  .mood-value.awful { color: #c0392b; }

  .mood-entry .notes {
    font-size: 0.9rem;
    color: #555;
    margin-top: 0.5rem;
  }

  .no-data-message {
    text-align: center;
    color: #7f8c8d;
    padding: 2rem;
    font-style: italic;
    background-color: #f9f9f9;
    border-radius: 4px;
  }
  .error-message {
    text-align: center;
    color: #e74c3c; 
    background-color: #fdd;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #e74c3c;
  }
  .mt-6 {
    margin-top: 1.5rem; 
  }
</style>

