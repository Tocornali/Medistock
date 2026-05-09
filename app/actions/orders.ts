'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { webpayTransaction as tx } from '@/lib/transbank'
import { getBaseUrl } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'

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
    // Obtenemos el usuario directamente de la sesión de Auth.js
    const session = await auth()
    
    let validUserId = session?.user?.id || payload.userId;
    const userExists = await prisma.user.findUnique({ where: { id: validUserId } });

    if (!userExists) {
      throw new Error("No se pudo identificar al usuario para procesar la orden.");
    }

    // Calculamos el subtotal seguro iterando sobre cartItems consultando la BD
    let subtotal = 0;
    for (const item of payload.cartItems) {
      const dbProduct = await prisma.product.findUnique({ where: { id: item.id } });
      if (!dbProduct) throw new Error(`Producto no encontrado en la base de datos: ${item.id}`);
      if (dbProduct.stock_global < item.cantidad) {
        throw new Error(`No hay stock suficiente para el producto: ${dbProduct.nombre}`);
      }
      const finalPrice = calculatePrice(dbProduct, userExists);
      subtotal += finalPrice * item.cantidad;
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
          cartItems: payload.cartItems, // Guardamos los items para procesarlos en el retorno
        }
      });

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
        `${getBaseUrl()}/api/webpay-retorno`
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
