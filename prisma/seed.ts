import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de MEDISTOCK...')

  // 1. Crear 1 usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: 'admin@medistock.com' },
    update: {},
    create: {
      email: 'admin@medistock.com',
      role: Role.ADMIN,
    },
  })

  // 2. Crear 5 productos médicos
  const products = [
    { sku: 'MED-JER-001', nombre: 'Jeringas 5ml (Caja x 100)', precio: 15.00, stock_global: 50 },
    { sku: 'MED-MON-001', nombre: 'Monitor de Presión Arterial', precio: 120.50, stock_global: 15 },
    { sku: 'MED-GUA-001', nombre: 'Guantes de Látex M (Caja x 100)', precio: 12.00, stock_global: 200 },
    { sku: 'MED-EST-001', nombre: 'Estetoscopio Cardiológico', precio: 85.00, stock_global: 10 },
    { sku: 'MED-GAS-001', nombre: 'Gasas Estériles 10x10cm (Caja x 50)', precio: 5.50, stock_global: 150 },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    })
  }

  console.log('Seed ejecutado correctamente: 1 usuario y 5 productos creados.')
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
