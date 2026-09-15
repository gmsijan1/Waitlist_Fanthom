import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  const body = await req.json();
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return Response.json({ message: "Email is required." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return Response.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.waitlistEmail.create({
      data: {
        email,
      },
    });

    return Response.json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return Response.json(
        { message: "This email has already joined the waitlist." },
        { status: 409 },
      );
    }

    return Response.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
