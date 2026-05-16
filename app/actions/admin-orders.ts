"use server"

import { prisma } from "@/lib/prisma"
import { OrderStatus, PaymentStatus, Role } from "@prisma/client"
import { requireStrictAuth } from "@/lib/auth-validator"
import { revalidatePath } from "next/cache"

/**
 * Server Action para aprobar una Orden de Compra (B2B)
 */
export async function approvePurchaseOrder(orderId: string) {
  try {
    // 1. Autorización de Nivel Administrativo (Solo Finanzas o Admin general)
    const admin = await requireStrictAuth([Role.ADMIN, Role.FINANCE]);

    // 2. Mutación Atómica en la BD
    // Cambiamos a OC_APPROVED, lo que indica a Logística que ya puede despachar.
    const order = await prisma.order.update({
      where: { 
        id: orderId,
        estado: OrderStatus.PENDING_OC_VALIDATION // Dobre validación: Asegura que solo se aprueben OCs pendientes
      },
      data: { 
        estado: OrderStatus.OC_APPROVED,
        paymentStatus: PaymentStatus.PENDING // Sigue sin pagar, pero la OC está validada
      }
    });

    // 3. Limpieza de caché para que el Dashboard UI se actualice
    revalidatePath("/dashboard/admin");
    
    // (Opcional) Aquí dispararías un evento a la cola de Logística
    console.log(`[B2B] OC Aprobada por ${admin.email} para la orden ${orderId}`);

    return { success: true, order };
  } catch (error) {
    console.error("Error al aprobar OC:", error);
    return { success: false, error: "Error de servidor al aprobar la OC." };
  }
}

/**
 * Server Action para rechazar una Orden de Compra (B2B)
 */
export async function rejectPurchaseOrder(orderId: string, rejectionReason: string) {
  try {
    // 1. Autorización
    await requireStrictAuth([Role.ADMIN, Role.FINANCE]);

    // 2. Validación de regla de negocio
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      return { success: false, error: "Debe proveer una justificación clara de al menos 10 caracteres para la clínica." };
    }

    // 3. Obtenemos la orden para enviar el correo
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) return { success: false, error: "Orden no encontrada." };

    // 4. Servicio de Correo Electrónico (SEUDOCÓDIGO)
    // Usarías Resend, SendGrid o AWS SES
    /*
    await resend.emails.send({
      from: 'finanzas@medistock.com',
      to: order.user.email,
      subject: `[Urgente] Problema con tu Orden de Compra #${order.ocNumber}`,
      html: `
        <p>Estimado/a ${order.user.name},</p>
        <p>Lamentamos informar que su Orden de Compra ha sido rechazada por nuestro equipo financiero.</p>
        <p><strong>Motivo del rechazo:</strong> ${rejectionReason}</p>
        <p>Por favor, ingrese a su portal y suba un documento corregido.</p>
      `
    });
    */
    console.log(`[B2B EMAIL ENVIADO] A ${order.user.email} - Motivo: ${rejectionReason}`);

    // 5. Actualizamos el estado para reflejar el rechazo
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus: PaymentStatus.CANCELLED,
        // Idealmente tendríamos un OrderStatus.OC_REJECTED, pero lo marcaremos cancelado
      }
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Error al rechazar OC:", error);
    return { success: false, error: "Error de servidor al procesar el rechazo." };
  }
}
