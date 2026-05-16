"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { OrderStatus, PaymentMethod, Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function submitPurchaseOrder(formData: FormData) {
  try {
    // 1. Verificación de Autenticación
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Debes iniciar sesión para completar esta compra." }
    }
    const userId = session.user.id

    // 2. Extracción de Datos
    const ocNumber = formData.get("ocNumber") as string
    const ocFile = formData.get("ocFile") as File
    const cartTotalRaw = formData.get("cartTotal") as string

    if (!ocNumber || !ocFile) {
      return { success: false, error: "El número de OC y el documento PDF son obligatorios." }
    }

    // 3. Validación de Archivo (Seguridad)
    // Validación de Tipo MIME
    if (ocFile.type !== "application/pdf") {
      return { success: false, error: "Solo se permiten documentos en formato PDF." }
    }

    // Validación de Tamaño (Máximo 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB en bytes
    if (ocFile.size > MAX_FILE_SIZE) {
      return { success: false, error: "El documento excede el tamaño máximo permitido de 5MB." }
    }

    // 4. Servicio de Storage (SEUDOCÓDIGO)
    // Aquí es donde subirías el Buffer del archivo a AWS S3, Google Cloud Storage, o Vercel Blob
    /*
    const buffer = Buffer.from(await ocFile.arrayBuffer())
    const filename = `ocs/${userId}/${Date.now()}-${ocFile.name}`
    
    // Ejemplo de AWS S3 (Seudocódigo)
    const uploadResult = await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: "application/pdf"
    }))
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`
    */
    
    // Para propósitos de este ejercicio, simularemos la URL retornada por el Storage
    const uploadedFileUrl = `/storage/simulated-ocs/${ocFile.name}`

    // 5. Creación de la Orden en Base de Datos (con manejo Anticolisiones B2B)
    // Asumiremos un total ficticio o procesado desde el carrito si se pasaron los items
    const total = parseFloat(cartTotalRaw) || 0

    const order = await prisma.order.create({
      data: {
        userId: userId,
        total: total,
        paymentMethod: PaymentMethod.PURCHASE_ORDER,
        estado: OrderStatus.PENDING_OC_VALIDATION, // Estado inicial estricto B2B
        ocNumber: ocNumber.trim().toUpperCase(),   // Normalizamos el número de OC
        ocDocumentUrl: uploadedFileUrl,
        
        // Datos simulados de envío para que no falle si son requeridos
        deliveryMethod: "RETIRO",
        shippingCost: 0,
      }
    })

    // 6. Limpieza de caché (Opcional, para actualizar carritos o catálogos)
    revalidatePath("/checkout")
    revalidatePath("/dashboard/admin") // Avisar al dashboard admin

    return { success: true, order }

  } catch (error) {
    console.error("Error procesando OC B2B:", error)

    // Interceptamos la restricción única (@@unique([userId, ocNumber]))
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = (error.meta?.target as string[]) || [];
      if (target.includes('userId') || target.includes('ocNumber')) {
        return { 
          success: false, 
          error: `Ya ingresaste anteriormente la Orden de Compra #${formData.get("ocNumber")}. Si fue un error, contacta a soporte.` 
        }
      }
    }

    return { success: false, error: "Ocurrió un error al procesar tu solicitud." }
  }
}
