'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { webpayTransaction as tx } from '@/lib/transbank'

export async function createOrder(payload: {
  cartItems: any[],
  userId: string,
  deliveryMethod: string,
  deliverySpeed: string,
  address?: string,
  shippingCost: number,
  paymentMethod: string
}) {
  try {
    // Validación de seguridad para asegurarnos de que el usuario existe (o usar uno de fallback)
    let validUserId = payload.userId;
    const userExists = await prisma.user.findUnique({ where: { id: validUserId } });

    if (!userExists) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        throw new Error("No hay usuarios en la base de datos para asignar la orden.");
      }
      validUserId = firstUser.id;
    }

    // Calculamos el subtotal seguro iterando sobre cartItems consultando la BD
    let subtotal = 0;
    for (const item of payload.cartItems) {
      const dbProduct = await prisma.product.findUnique({ where: { id: item.id } });
      if (!dbProduct) throw new Error(`Producto no encontrado en la base de datos: ${item.id}`);
      subtotal += dbProduct.precio * item.cantidad;
    }
    const secureTotal = subtotal + payload.shippingCost;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear la orden
      const order = await tx.order.create({
        data: {
          userId: validUserId,
          total: secureTotal,
          estado: 'PENDIENTE_PAGO',
          deliveryMethod: payload.deliveryMethod,
          deliverySpeed: payload.deliverySpeed,
          address: payload.address,
          shippingCost: payload.shippingCost,
          paymentMethod: payload.paymentMethod,
        }
      });

      // 2. Iterar sobre los items y descontar stock
      for (const item of payload.cartItems) {
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

    let transbankResponse;
    try {
      // Transbank buyOrder limits to 26 characters max
      const buyOrder = String(result.id).slice(0, 26);
      transbankResponse = await tx.create(
        buyOrder,
        String(validUserId).replace(/-/g, '').slice(0, 61), // sessionId limit is 61
        secureTotal,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/webpay-retorno`
      );
    } catch (error) {
      console.error("Error de Transbank:", error);
      throw new Error("No se pudo iniciar la transacción con Transbank");
    }

    return { success: true, order: result, url: transbankResponse.url, token: transbankResponse.token };
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return { success: false, error: "Error al procesar el pedido." };
  }
}
