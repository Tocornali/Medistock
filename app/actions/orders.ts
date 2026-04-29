'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createOrder(cartItems: any[], userId: string) {
  try {
    // Validación de seguridad para asegurarnos de que el usuario existe (o usar uno de fallback)
    let validUserId = userId;
    const userExists = await prisma.user.findUnique({ where: { id: validUserId } });
    
    if (!userExists) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        throw new Error("No hay usuarios en la base de datos para asignar la orden.");
      }
      validUserId = firstUser.id;
    }

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear la orden
      const order = await tx.order.create({
        data: {
          userId: validUserId,
          total: total,
          estado: 'PENDIENTE',
        }
      });

      // 2. Iterar sobre los items y descontar stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock_global: {
              decrement: item.cantidad
            }
          }
        });
      }

      return order;
    });

    // 3. Revalidar la página del catálogo para mostrar el stock actualizado
    revalidatePath('/catalogo');
    
    return { success: true, order: result };
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return { success: false, error: "Error al procesar el pedido." };
  }
}
