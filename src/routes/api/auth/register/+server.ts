import prisma from "$lib/server/prisma";
import bcrypt from "bcryptjs";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password) {
      return json({ message: "Email and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return json({ message: "User already exists with this email" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Don't send password back
    const { password: _, ...userWithoutPassword } = newUser;

    return json({ message: "User registered successfully", user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return json({ message: "An error occurred during registration" }, { status: 500 });
  }
};
