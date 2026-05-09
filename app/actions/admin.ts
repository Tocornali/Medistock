"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Role } from "@prisma/client"

export async function preRegisterEmployee(data: { rut: string, role: string }) {
  const session = await auth()
  const userRole = (session?.user as any)?.role

  // Solo ADMIN puede hacer esto (quizás FINANCE si lo requiere la lógica)
  if (userRole !== Role.ADMIN) {
    return { error: "No autorizado." }
  }

  if (!data.rut || !data.role) {
    return { error: "RUT y Rol son obligatorios." }
  }

  const existingUser = await prisma.user.findUnique({
    where: { rut: data.rut }
  })

  if (existingUser) {
    return { error: "El RUT ya está registrado." }
  }

  try {
    await prisma.user.create({
      data: {
        rut: data.rut,
        role: data.role as Role,
        isActive: false // El empleado debe activarlo
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Error al pre-registrar empleado:", error)
    return { error: "Ocurrió un error al pre-registrar." }
  }
}
