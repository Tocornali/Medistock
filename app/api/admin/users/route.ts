
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: {
      role: {
        notIn: ['USER', 'COMPANY']
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return NextResponse.json(users);
}
