import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { webpayTransaction as tx } from '@/lib/transbank'

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_ws = url.searchParams.get('token_ws');
  const TBK_TOKEN = url.searchParams.get('TBK_TOKEN');

  // Lógica de Anulación: Si existe TBK_TOKEN o no existe token_ws, el usuario canceló
  if (TBK_TOKEN || !token_ws) {
    return NextResponse.redirect(new URL('/carrito', request.url));
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
        await prisma.order.update({
          where: { id: order.id },
          data: { estado: 'PAGADO' }
        });
      }

      // Redirección Final al éxito
      return NextResponse.redirect(new URL(`/checkout/exito?orden=${response.buy_order}`, request.url));
    } else {
      // Si la autorización falla, redirigimos al carrito
      return NextResponse.redirect(new URL('/carrito?error=rechazado', request.url));
    }
  } catch (error) {
    console.error("Error al confirmar transacción de Transbank:", error);
    return NextResponse.redirect(new URL('/carrito?error=excepcion', request.url));
  }
}
