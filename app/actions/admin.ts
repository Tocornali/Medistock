
"use server"

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserStatus(userId: string, data: { role?: Role, isActive?: boolean }) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data
    });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Error al actualizar el usuario" };
  }
}

export async function preRegisterEmployee(data: { rut: string, role: string }) {
  try {
    const { rut, role } = data;

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { rut }
    });

    if (existingUser) {
      return { error: "Ya existe un usuario registrado con este RUT." };
    }

    // Crear usuario inactivo (esperando activación)
    await prisma.user.create({
      data: {
        rut,
        role: role as Role,
        isActive: false, // Debe activarse después
      }
    });

    revalidatePath("/admin/usuarios");
    revalidatePath("/dashboard/admin/empleados");
    return { success: true };
  } catch (error) {
    console.error("Error in preRegisterEmployee:", error);
    return { error: "Ocurrió un error al pre-registrar al empleado." };
  }
}

