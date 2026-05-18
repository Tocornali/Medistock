import { PrismaClient, PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Generando ventas de prueba para el dashboard...')
  
  const users = await prisma.user.findMany()
  const admin = users.find(u => u.role === 'ADMIN')
  const userId = admin ? admin.id : users[0]?.id || 'dummy-user-id'

  const orders = []
  
  // Generar datos para los últimos 45 días
  for (let i = 0; i < 45; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Generar 2 a 6 órdenes por día B2C (WEBPAY)
    const b2cCount = Math.floor(Math.random() * 5) + 2
    for (let j = 0; j < b2cCount; j++) {
      // Hora aleatoria del día
      const orderDate = new Date(date)
      orderDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
      
      orders.push({
        userId,
        total: Math.floor(Math.random() * 80000) + 15000, // Entre 15k y 95k
        estado: OrderStatus.PAID,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.WEBPAY,
        createdAt: orderDate,
        cartItems: []
      })
    }

    // Generar 0 a 2 órdenes por día B2B (INVOICE)
    const b2bCount = Math.floor(Math.random() * 3)
    for (let j = 0; j < b2bCount; j++) {
      const orderDate = new Date(date)
      orderDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
      
      // Algunas B2B pagadas
      orders.push({
        userId,
        total: Math.floor(Math.random() * 1500000) + 300000, // Entre 300k y 1.8M
        estado: OrderStatus.PAID,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.INVOICE,
        createdAt: orderDate,
        cartItems: []
      })
    }
  }

  // Generar un par de órdenes B2B "PENDIENTE_APROBACION" recientes para la tabla
  for (let i = 0; i < 3; i++) {
    orders.push({
      userId,
      total: Math.floor(Math.random() * 2000000) + 500000,
      estado: OrderStatus.PENDING_OC_VALIDATION,
      paymentStatus: PaymentStatus.PENDING_APPROVAL,
      paymentMethod: PaymentMethod.INVOICE,
      createdAt: new Date(),
      cartItems: []
    })
  }

  await prisma.order.createMany({
    data: orders
  })

  console.log(`✅ ¡Se generaron ${orders.length} órdenes de prueba exitosamente!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
