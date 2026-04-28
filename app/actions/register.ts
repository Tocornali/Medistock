"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = (formData.get("role") as Role) || "OPERADOR"

  if (!name || !email || !password) {
    return { error: "Todos los campos son obligatorios" }
  }

  // Verificar si el correo ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "El correo electrónico ya está registrado. Por favor, inicia sesión." }
  }

  // Hashear la contraseña con bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    })
    
    return { success: true }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return { error: "Ocurrió un error al intentar crear el usuario." }
  }
}
