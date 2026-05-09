"use server"

import { prisma } from "@/lib/prisma"

export async function checkAccountStatus(identifier: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { rut: identifier }
      ]
    }
  });

  if (!user) {
    return { exists: false };
  }

  return { 
    exists: true, 
    isActive: user.isActive,
    rut: user.rut
  };
}
