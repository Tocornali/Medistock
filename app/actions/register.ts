"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { registerSchema } from "@/lib/validations/auth"
import { signIn } from "@/auth"

export async function registerUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const validation = registerSchema.safeParse(data)

  if (!validation.success) {
    const errorMsg = validation.error.issues[0].message
    return { error: errorMsg }
  }

  const { name, email, password, rut, accountType, razonSocial, giro } = validation.data
  const role = accountType === "EMPRESA" ? Role.COMPANY : Role.USER

  // Verificar si el correo ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "El correo electrónico ya está registrado. Por favor, inicia sesión." }
  }

  if (rut) {
    const existingRut = await prisma.user.findUnique({
      where: { rut }
    })
    if (existingRut) {
      return { error: "El RUT ya está registrado." }
    }
  }

  // Hashear la contraseña con bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true, // Si se registran ellos mismos, entran activos
        role: role as Role,
        ...(accountType === "EMPRESA" ? {
          rut,
          razonSocial,
          giro
        } : {})
      },
    })
    
    return { success: true }
    
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return { error: "Ocurrió un error al intentar crear el usuario." }
  }
}


