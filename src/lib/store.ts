import { writable } from "svelte/store";

export const userSession = writable({
  isLoggedIn: false,
  userId: null,
  email: null,
  username: null
});
