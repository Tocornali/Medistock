'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { webpayTransaction as tx } from '@/lib/transbank'
import { getBaseUrl } from '@/lib/utils'
import { auth } from '@/auth'
import { calculatePrice } from '@/lib/prices'
import { PaymentMethod, PaymentStatus, Role } from '@prisma/client'

export async function createOrder(payload: {
  cartItems: any[],
  userId: string,
  deliveryMethod: string,
  deliverySpeed: string,
  address?: string,
  shippingCost: number,
  paymentMethod: PaymentMethod,
  documentUrl?: string
}) {
  try {
    const session = await auth()
    
    let validUserId = session?.user?.id || payload.userId;
    const userExists = await prisma.user.findUnique({ where: { id: validUserId } });

    if (!userExists) {
      throw new Error("No se pudo identificar al usuario para procesar la orden.");
    }

    // 1. Calculamos el subtotal seguro iterando sobre cartItems consultando la BD
    let subtotal = 0;
    for (const item of payload.cartItems) {
      // 'item.id' ahora es el variantId
      const dbVariant = await prisma.productVariant.findUnique({ 
        where: { id: item.id },
        include: { product: true }
      });
      
      if (!dbVariant) throw new Error(`Variante no encontrada en la base de datos: ${item.id}`);
      
      // Validación de stock preventiva
      if (dbVariant.stock < item.cantidad) {
        throw new Error(`No hay stock suficiente para: ${dbVariant.product.name} (${dbVariant.nameModifier})`);
      }

      // Lógica de Precios: Usa companyPrice si el usuario es EMPRESA
      const finalPrice = calculatePrice(dbVariant, userExists);
      subtotal += finalPrice * item.cantidad;
    }
    const secureTotal = subtotal + payload.shippingCost;


    // 2. Creación de la orden en la BD
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: validUserId,
          total: secureTotal,
          estado: payload.paymentMethod === PaymentMethod.INVOICE ? 'PENDIENTE_APROBACION' : 'PENDIENTE_PAGO',
          paymentStatus: payload.paymentMethod === PaymentMethod.INVOICE ? PaymentStatus.PENDING_APPROVAL : PaymentStatus.PENDING,
          deliveryMethod: payload.deliveryMethod,
          deliverySpeed: payload.deliverySpeed,
          address: payload.address,
          shippingCost: payload.shippingCost,
          paymentMethod: payload.paymentMethod,
          documentUrl: payload.documentUrl,
          cartItems: payload.cartItems,
        }
      });

      // Si es Factura (B2B), descontamos stock de inmediato
      if (payload.paymentMethod === PaymentMethod.INVOICE) {
        for (const item of payload.cartItems) {
          await tx.productVariant.update({
            where: { id: item.id },
            data: { stock: { decrement: item.cantidad } }
          });
        }
      }

      return order;
    });


    revalidatePath('/catalogo');

    // 3. Flujo asimétrico según el método de pago
    if (payload.paymentMethod === PaymentMethod.WEBPAY) {
      try {
        const buyOrder = String(result.id).slice(0, 26);
        const transbankResponse = await tx.create(
          buyOrder,
          String(validUserId).replace(/-/g, '').slice(0, 61),
          secureTotal,
          `${getBaseUrl()}/api/webpay-retorno`
        );
        return { 
          success: true, 
          order: result, 
          url: transbankResponse.url, 
          token: transbankResponse.token,
          type: 'WEBPAY' 
        };
      } catch (error) {
        console.error("Error de Transbank:", error);
        throw new Error("No se pudo iniciar la transacción con Transbank");
      }
    } else if (payload.paymentMethod === PaymentMethod.INVOICE) {
      // Notificación al Ejecutivo de Cuentas (Simulada mediante log administrativo)
      console.log(`[ADMIN NOTIFICATION] Nueva orden B2B pendiente de aprobación: ID ${result.id}. Cliente: ${userExists.name || userExists.rut}. OC: ${payload.documentUrl || 'No adjunta'}`);
      
      return { 
        success: true, 
        order: result, 
        type: 'INVOICE',
        redirectUrl: `/checkout/exito?orden=${result.id}&method=invoice` 
      };
    }

    return { success: true, order: result };

  } catch (error) {
    console.error("Error al crear la orden:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error al procesar el pedido." };
  }
}

