<script lang="ts">
  import { goto } from "$app/navigation";
  import { userSession } from "$lib/store"; // Import the user session store

  let email = "";
  let password = "";
  let errorMessage = "";
  let successMessage = "";

  // Clear messages when user starts typing
  $: if (email || password) {
    errorMessage = "";
    successMessage = "";
  }

  async function handleLogin() {
    errorMessage = "";
    successMessage = "";

    if (!email || !password) {
      errorMessage = "Email and password are required.";
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.user) {
        // Update the user session store
        userSession.set({
          isLoggedIn: true,
          userId: result.user.id,
          email: result.user.email,
          username: result.user.username
        });

        successMessage = "Login successful! Redirecting to dashboard...";
        email = "";
        password = "";
        
        setTimeout(() => {
          goto("/dashboard");
        }, 1500);
      } else {
        errorMessage = result.message || "Login failed. Please check your credentials.";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage = "An unexpected error occurred. Please try again.";
    }
  }
</script>

<div class="auth-page-container">
  <div class="auth-card card">
    <img src="/logo.png" alt="Mimimood Logo" class="auth-logo" />
    <h2>Login to Mimimood</h2>
    
    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}
    {#if successMessage}
      <p class="success-message">{successMessage}</p>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} required />
      </div>
      <button type="submit" class="button">Login</button>
    </form>
    <p class="auth-switch">
      Don't have an account? <a href="/register">Register here</a>
    </p>
  </div>
</div>

<style>
  .auth-page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px); 
    padding: 2rem;
    background-color: #e0f7fa; /* Light blue background */
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
    text-align: center;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .auth-logo {
    max-width: 100px;
    margin-bottom: 1rem;
  }
  
  .auth-card h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .form-group {
    margin-bottom: 1rem;
    text-align: left;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .button {
    background-color: #e91e63; /* Pink for buttons */
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease;
    width: 100%; /* Make button full width */
    margin-top: 1rem;
  }

  .button:hover {
    background-color: #c2185b; /* Darker pink on hover */
  }

  .auth-switch {
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }

  .auth-switch a {
    color: #3498db; /* Blue for links */
    text-decoration: none;
    font-weight: bold;
  }

  .auth-switch a:hover {
    text-decoration: underline;
  }
  
  .error-message {
    color: red;
    background-color: #ffebee;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid red;
  }
  
  .success-message {
    color: green;
    background-color: #e8f5e9;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid green;
  }
</style>
