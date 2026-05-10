"use server"

import { prisma } from "@/lib/prisma"

export async function checkStaffAccount(rut: string) {
  const user = await prisma.user.findFirst({
    where: { rut }
  });

  if (!user) {
    return { exists: false };
  }

  if (user.role === 'USER' || user.role === 'COMPANY') {
    return { error: "USE_CLIENT_PORTAL" };
  }

  return { 
    exists: true, 
    isActive: user.isActive,
    rut: user.rut
  };
}
