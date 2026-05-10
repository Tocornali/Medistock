"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const rut = formData.get("rut") as string
  
  const accountType = formData.get("accountType") as string
  const razonSocial = formData.get("razonSocial") as string
  const giro = formData.get("giro") as string

  const role = accountType === "EMPRESA" ? Role.COMPANY : Role.USER

  if (!name || !email || !password) {
    return { error: "Todos los campos básicos son obligatorios" }
  }

  if (accountType === "EMPRESA" && (!rut || !razonSocial || !giro)) {
    return { error: "Los datos de la empresa (RUT, Razón Social, Giro) son obligatorios" }
  }

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
