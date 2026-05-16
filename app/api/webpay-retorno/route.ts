import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { webpayTransaction as tx } from '@/lib/transbank'
import { getBaseUrl } from '@/lib/utils'
import { OrderStatus, PaymentStatus } from '@prisma/client'

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_ws = url.searchParams.get('token_ws');
  const TBK_TOKEN = url.searchParams.get('TBK_TOKEN');

  // Lógica de Anulación: Si existe TBK_TOKEN o no existe token_ws, el usuario canceló
  if (TBK_TOKEN || !token_ws) {
    return NextResponse.redirect(new URL('/checkout/error?error=cancelado', getBaseUrl()));
  }

  // Lógica de Confirmación (Commit)
  try {
    const response = await tx.commit(token_ws);

    if (response.status === 'AUTHORIZED') {
      // Mutación de Base de Datos
      // Buscamos la orden que comience con el buyOrder ya que tuvimos que recortarlo a 26 caracteres
      const order = await prisma.order.findFirst({
        where: {
          id: {
            startsWith: response.buy_order
          }
        }
      });

      if (order) {
        try {
          await prisma.$transaction(async (tx) => {
            const items = order.cartItems as any[];
            
            // 1. Check stock for all items
            for (const item of items) {
              const dbVariant = await tx.productVariant.findUnique({ where: { id: item.id } });
              if (!dbVariant || dbVariant.stock < item.cantidad) {
                throw new Error("INSUFFICIENT_STOCK");
              }
            }

            // 2. Decrement stock
            for (const item of items) {
              await tx.productVariant.update({
                where: { id: item.id },
                data: {
                  stock: {
                    decrement: item.cantidad
                  }
                }
              });
            }


            // 3. Mark as PAID
            await tx.order.update({
              where: { id: order.id },
              data: { 
                estado: OrderStatus.PAID,
                paymentStatus: PaymentStatus.PAID 
              }
            });
          });
        } catch (error: any) {
          if (error.message === "INSUFFICIENT_STOCK") {
            await prisma.order.update({
              where: { id: order.id },
              data: { paymentStatus: PaymentStatus.CANCELLED }
            });
            return NextResponse.redirect(new URL(`/checkout/error?error=stock&orden=${order.id}`, getBaseUrl()));
          }
          throw error;
        }
      }

      // Redirección Final al éxito
      return NextResponse.redirect(new URL(`/checkout/exito?orden=${response.buy_order}`, getBaseUrl()));
    } else {
      // Si la autorización falla, redirigimos a la vista de error
      return NextResponse.redirect(new URL(`/checkout/error?error=rechazado&orden=${response.buy_order}`, getBaseUrl()));
    }
  } catch (error) {
    console.error("Error al confirmar transacción de Transbank:", error);
    return NextResponse.redirect(new URL('/checkout/error?error=excepcion', getBaseUrl()));
  }
}
