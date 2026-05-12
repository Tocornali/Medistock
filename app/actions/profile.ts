"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { profileSchema, passwordUpdateSchema } from "@/lib/validations/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(data: { name: string, email: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "No autorizado" }
  }

  const validation = profileSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { name, email } = validation.data

  // Verificar si el email ya está en uso por otro usuario
  if (email !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return { error: "El correo electrónico ya está en uso" }
    }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email }
    })
    revalidatePath("/configuracion")
    return { success: "Perfil actualizado correctamente" }
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return { error: "Error al actualizar el perfil" }
  }
}

export async function updatePassword(data: any) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "No autorizado" }
  }

  const validation = passwordUpdateSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { currentPassword, newPassword } = validation.data

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user || !user.password) {
    return { error: "Usuario no encontrado o sin contraseña configurada" }
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password)
  if (!passwordMatch) {
    return { error: "La contraseña actual es incorrecta" }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })
    return { success: "Contraseña actualizada correctamente" }
  } catch (error) {
    console.error("Error al actualizar contraseña:", error)
    return { error: "Error al actualizar la contraseña" }
  }
}

export async function verifyPassword(password: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "No autorizado" }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user || !user.password) {
    return { error: "Usuario no encontrado" }
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  return { valid: passwordMatch }
}
