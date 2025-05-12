import prisma from "$lib/server/prisma";
import bcrypt from "bcryptjs";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return json({ message: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return json({ message: "Invalid credentials" }, { status: 401 });
    }


    const { password: _, ...userWithoutPassword } = user;

    return json({ message: "Login successful", user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return json({ message: "An error occurred during login" }, { status: 500 });
  }
};
