import prisma from "$lib/server/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// POST request to create a new mood entry
export const POST: RequestHandler = async ({ request, locals }) => {
  // placeholder or that it might be passed in the request (not ideal for security)
  // const userId = locals.user?.id; 
  // if (!userId) {
  //   return json({ message: "User not authenticated" }, { status: 401 });
  // }

  try {
    const { date, mood, notes, userId } = await request.json(); 

    if (!date || !mood || !userId) {
      return json({ message: "Date, mood, and userId are required" }, { status: 400 });
    }

    

    const newMoodEntry = await prisma.moodEntry.create({
      data: {
        date: new Date(date), 
        mood,
        notes,
        userId: parseInt(userId, 10), // Ensure userId is an integer
      },
    });

    return json({ message: "Mood entry created successfully", moodEntry: newMoodEntry }, { status: 201 });

  } catch (error) {
    console.error("Error creating mood entry:", error);
    // Check for specific Prisma errors, e.g., foreign key constraint if userId doesn't exist
    if (error.code === 'P2003') { // Prisma foreign key constraint failed
        return json({ message: "Invalid user ID provided."}, { status: 400 });
    }
    return json({ message: "An error occurred while creating the mood entry" }, { status: 500 });
  }
};

// GET request to retrieve mood entries (e.g., for stats)
export const GET: RequestHandler = async ({ url, locals }) => {
  // const userId = locals.user?.id;
  // if (!userId) {
  //   return json({ message: "User not authenticated" }, { status: 401 });
  // }
  
  // For now, expect userId as a query parameter for simplicity in testing without full auth setup
  const userIdParam = url.searchParams.get("userId");
  const startDateParam = url.searchParams.get("startDate");
  const endDateParam = url.searchParams.get("endDate");

  if (!userIdParam) {
    return json({ message: "User ID is required" }, { status: 400 });
  }
  const userId = parseInt(userIdParam, 10);
  if (isNaN(userId)) {
    return json({ message: "Invalid User ID format" }, { status: 400 });
  }

  try {
    const whereClause: any = { userId };

    if (startDateParam) {
      whereClause.date = { ...whereClause.date, gte: new Date(startDateParam) };
    }
    if (endDateParam) {
      whereClause.date = { ...whereClause.date, lte: new Date(endDateParam) };
    }

    const moodEntries = await prisma.moodEntry.findMany({
      where: whereClause,
      orderBy: {
        date: "desc", // Or 'asc', depending on desired order
      },
    });

    return json(moodEntries, { status: 200 });

  } catch (error) {
    console.error("Error retrieving mood entries:", error);
    return json({ message: "An error occurred while retrieving mood entries" }, { status: 500 });
  }
};
