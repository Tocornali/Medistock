"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

import { authSchema } from "@/lib/validations/auth"
import { z } from "zod"

const staffActivateSchema = authSchema.extend({
  name: z.string().min(1, "El nombre es obligatorio"),
})

export async function activateUser(rut: string, rawData: any) {
  const validation = staffActivateSchema.safeParse(rawData)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const data = validation.data

  const user = await prisma.user.findUnique({
    where: { rut }
  });

  if (!user) {
    return { error: "RUT no encontrado" }
  }

  if (user.isActive) {
    return { error: "La cuenta ya está activa" }
  }

  // Verificar si el correo ya existe en otro usuario
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingEmail && existingEmail.id !== user.id) {
    return { error: "El correo electrónico ya está en uso" }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    await prisma.user.update({
      where: { rut },
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        isActive: true
      }
    });

    return { success: true }
  } catch (error) {
    console.error("Error al activar usuario:", error);
    return { error: "Ocurrió un error al activar la cuenta" }
  }
}
