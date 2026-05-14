
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'malvados@gmail.com' },
    select: {
      id: true,
      email: true,
      role: true,
      rut: true,
      razonSocial: true,
      isActive: true
    }
  });

  console.log("Estado del usuario malvados@gmail.com:", user);
  await prisma.$disconnect();
}

checkUser();
