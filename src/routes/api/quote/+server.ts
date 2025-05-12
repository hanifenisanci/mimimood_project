import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch("https://zenquotes.io/api/today");
    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }
    const data = await response.json();
    // ZenQuotes API returns an array, WE LOOK FOR the first quote
    if (data && data.length > 0) {
      return json(data[0]);
    } else {
      return json({ q: "Could not retrieve a quote at this time.", a: "System" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error fetching daily quote:", error);
    return json({ q: "Could not retrieve a quote due to an error.", a: "System" }, { status: 500 });
  }
};
