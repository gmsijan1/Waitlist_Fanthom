import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return Response.json(user);
}
