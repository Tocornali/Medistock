import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany()
  console.log('Productos en BD:', JSON.stringify(products, null, 2))
}

main()
