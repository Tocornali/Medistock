import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de MEDISTOCK (V2 - Variantes)...')

  // 1. Crear Usuario Admin
  await prisma.user.upsert({
    where: { email: 'admin@medistock.com' },
    update: { rut: '12.345.678-5' },
    create: {
      rut: '12.345.678-5',
      email: 'admin@medistock.com',
      name: 'Admin Medistock',
      password: await bcrypt.hash('admin123', 10),
      isActive: true,
      role: Role.ADMIN,
    },
  })

  // 2. Limpieza
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // 3. Categorías
  const catInsumos = await prisma.category.create({ data: { name: 'Insumos Clínicos' } })
  const catEquipamiento = await prisma.category.create({ data: { name: 'Equipamiento Médico' } })
  const catProteccion = await prisma.category.create({ data: { name: 'Elementos de Protección' } })
  const catFarmacia = await prisma.category.create({ data: { name: 'Farmacia y Botiquín' } })


  // 4. Productos con Variantes
  
  // Producto 1: Jeringas (Insumo con variantes por tamaño)
  const jeringas = await prisma.product.create({
    data: {
      name: 'Jeringas Hipodérmicas Pro',
      description: 'Jeringas de tres partes estériles con aguja, diseñadas para un uso clínico preciso y seguro.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Jeringas_5ml_(Caja_x_100).png',
      categoryId: catInsumos.id,
      maxRetailQty: 20,
      maxCompanyQty: 500,
      variants: {
        create: [
          {
            sku: 'JER-003ML',
            nameModifier: '3ml (Caja x100)',
            price: 12000,
            companyPrice: 9500,
            stock: 100000,
            weight: 0.8,
            length: 20, width: 15, height: 10
          },
          {
            sku: 'JER-005ML',
            nameModifier: '5ml (Caja x100)',
            price: 15500,
            companyPrice: 12400,
            stock: 50000,
            weight: 1.0,
            length: 22, width: 15, height: 12
          },
          {
            sku: 'JER-010ML',
            nameModifier: '10ml (Caja x100)',
            price: 18000,
            companyPrice: 14500,
            stock: 30000,
            weight: 1.5,
            length: 25, width: 18, height: 15
          }
        ]
      }
    }
  })

  // Producto 2: Desfibrilador (Equipamiento Institucional)
  await prisma.product.create({
    data: {
      name: 'Desfibrilador Externo Automático (DEA)',
      description: 'Equipo de emergencia portátil con instrucciones de voz en español y parches bifásicos.',
      brand: 'Estándar Profesional',
      imageUrl: '/images/products/Desfibrilador Externo Automatico.png',
      categoryId: catEquipamiento.id,
      isInstitutionalOnly: true,
      maxRetailQty: 2,
      maxCompanyQty: 20,
      variants: {
        create: [
          {
            sku: 'EQU-DEA-001',
            nameModifier: 'Estándar Profesional',
            price: 1200000,
            companyPrice: 1050000,
            stock: 5000,
            weight: 2.5,
            length: 30, width: 25, height: 15
          }
        ]
      }
    }
  })

  // Producto 3: Amoxicilina (Farmacia con Receta)
  await prisma.product.create({
    data: {
      name: 'Amoxicilina 500mg',
      description: 'Antibiótico de amplio espectro.',
      brand: 'Genérico Certificado',
      imageUrl: '/images/products/Amoxicilina.png',
      categoryId: catFarmacia.id,
      requiereReceta: true,
      variants: {
        create: [
          {
            sku: 'PHA-AMX-500-20',
            nameModifier: 'Caja 20 Cápsulas',
            price: 4500,
            companyPrice: 3800,
            stock: 150,
            weight: 0.1,
            length: 10, width: 5, height: 2
          }
        ]
      }
    }
  })

  // Producto 4: Guantes de Nitrilo (Protección por Talla)
  await prisma.product.create({
    data: {
      name: 'Guantes de Nitrilo Premium (Caja x100)',
      description: 'Guantes de examen sin polvo, de alta resistencia y sensibilidad táctil superior.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Guantes_de_Nitrilo_M_(Caja_x_100).png',
      categoryId: catProteccion.id,
      variants: {
        create: [
          {
            sku: 'PRO-GUA-S',
            nameModifier: 'Talla S',
            price: 9800,
            companyPrice: 7840,
            stock: 10000,
            weight: 0.5,
            length: 20, width: 12, height: 8
          },
          {
            sku: 'PRO-GUA-M',
            nameModifier: 'Talla M',
            price: 9800,
            companyPrice: 7840,
            stock: 200,
            weight: 0.5,
            length: 20, width: 12, height: 8
          },
          {
            sku: 'PRO-GUA-L',
            nameModifier: 'Talla L',
            price: 10500,
            companyPrice: 8400,
            stock: 80,
            weight: 0.6,
            length: 21, width: 13, height: 9
          }
        ]
      }
    }
  })

  // Producto 5: Alcohol Gel (Higiene B2C)
  await prisma.product.create({
    data: {
      name: 'Alcohol Gel 70%',
      description: 'Gel sanitizante de manos con aloe vera, secado rápido sin residuos.',
      brand: 'Calidad Garantizada',
      imageUrl: '/images/products/Alcohol_Gel_70.png',
      categoryId: catProteccion.id,
      variants: {
        create: [
          {
            sku: 'HIG-ALC-250',
            nameModifier: 'Botella 250ml',
            price: 2500,
            companyPrice: 1900,
            stock: 500,
            weight: 0.3,
            length: 15, width: 5, height: 5
          },
          {
            sku: 'HIG-ALC-1000',
            nameModifier: 'Bidón 1 Litro',
            price: 6900,
            companyPrice: 5500,
            stock: 200,
            weight: 1.1,
            length: 25, width: 10, height: 10
          }
        ]
      }
    }
  })

  // Producto 6: Parches Curitas (Botiquín B2C)
  await prisma.product.create({
    data: {
      name: 'Apósitos Adhesivos (Curitas)',
      description: 'Parches protectores transpirables y resistentes al agua.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Curitas.png',
      categoryId: catInsumos.id,
      variants: {
        create: [
          {
            sku: 'BOT-CUR-20',
            nameModifier: 'Caja x20 unidades',
            price: 1200,
            companyPrice: 900,
            stock: 1000,
            weight: 0.05,
            length: 10, width: 8, height: 2
          },
          {
            sku: 'BOT-CUR-100',
            nameModifier: 'Caja x100 unidades',
            price: 4500,
            companyPrice: 3600,
            stock: 300,
            weight: 0.2,
            length: 15, width: 10, height: 5
          }
        ]
      }
    }
  })

  // Producto 7: Algodón Hidrófilo
  await prisma.product.create({
    data: {
      name: 'Algodón Hidrófilo Premium',
      description: 'Algodón 100% puro y natural, altamente absorbente.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Algodon_Hidrofilo.png',
      categoryId: catInsumos.id,
      variants: {
        create: [
          {
            sku: 'BOT-ALG-100',
            nameModifier: 'Paquete 100g',
            price: 1500,
            companyPrice: 1200,
            stock: 400,
            weight: 0.12,
            length: 20, width: 10, height: 5
          },
          {
            sku: 'BOT-ALG-500',
            nameModifier: 'Paquete 500g',
            price: 5500,
            companyPrice: 4400,
            stock: 150,
            weight: 0.55,
            length: 35, width: 20, height: 10
          }
        ]
      }
    }
  })

  // Producto 8: Suero Fisiológico (Clásico re-integrado)
  await prisma.product.create({
    data: {
      name: 'Suero Fisiológico 0.9%',
      description: 'Solución salina estéril para irrigación y limpieza.',
      brand: 'Estándar Clínico',
      imageUrl: '/images/products/Suero Fisiologico 0.9 500ml.png',
      categoryId: catInsumos.id,
      variants: {
        create: [
          {
            sku: 'INS-SUE-500',
            nameModifier: 'Frasco 500ml',
            price: 1800,
            companyPrice: 1400,
            stock: 300,
            weight: 0.6,
            length: 18, width: 8, height: 8
          },
          {
            sku: 'INS-SUE-1000',
            nameModifier: 'Frasco 1000ml',
            price: 3200,
            companyPrice: 2600,
            stock: 150,
            weight: 1.1,
            length: 22, width: 10, height: 10
          }
        ]
      }
    }
  })

  // Producto 9: Mascarillas KN95
  await prisma.product.create({
    data: {
      name: 'Mascarilla KN95 Certificada',
      description: 'Protección respiratoria de alta eficiencia con 5 capas de filtrado bacteriano.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Mascarilla KN95 (Caja x 20).png',
      categoryId: catProteccion.id,
      variants: {

        create: [
          {
            sku: 'PRO-MSK-10',
            nameModifier: 'Caja x10 unidades',
            price: 4500,
            companyPrice: 3200,
            stock: 500,
            weight: 0.1,
            length: 15, width: 12, height: 5
          },
          {
            sku: 'PRO-MSK-50',
            nameModifier: 'Caja x50 unidades',
            price: 18900,
            companyPrice: 14500,
            stock: 20000,
            weight: 0.4,
            length: 20, width: 15, height: 12
          }
        ]
      }
    }
  })

  // Producto 10: Pecheras Desechables
  await prisma.product.create({
    data: {
      name: 'Pecheras Desechables Manga Larga',
      description: 'Protección corporal impermeable para procedimientos.',
      brand: 'Importado',
      imageUrl: '/images/products/Pecheras Desechables Manga Larga.png',
      categoryId: catProteccion.id,
      variants: {
        create: [
          {
            sku: 'PRO-PEC-10',
            nameModifier: 'Pack x10 unidades',
            price: 8500,
            companyPrice: 6900,
            stock: 0,
            weight: 0.5,
            length: 30, width: 20, height: 5
          },
          {
            sku: 'PRO-PEC-50',
            nameModifier: 'Bulto x50 unidades',
            price: 38000,
            companyPrice: 31000,
            stock: 0,
            weight: 2.2,
            length: 40, width: 30, height: 15
          }
        ]
      }
    }
  })

  // Producto 11: Gasas Estériles
  await prisma.product.create({
    data: {
      name: 'Gasa Estéril 10x10cm',
      description: 'Gasa de algodón altamente absorbente, sobres individuales.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Gasas Esteriles 10x10cm (Caja x 50).png',
      categoryId: catInsumos.id,
      variants: {
        create: [
          {
            sku: 'INS-GAS-50',
            nameModifier: 'Caja x50 sobres',
            price: 6500,
            companyPrice: 5200,
            stock: 5,
            weight: 0.3,
            length: 15, width: 10, height: 10
          },
          {
            sku: 'INS-GAS-100',
            nameModifier: 'Caja x100 sobres',
            price: 11500,
            companyPrice: 9200,
            stock: 10000,
            weight: 0.5,
            length: 20, width: 12, height: 12
          }
        ]
      }
    }
  })

  // Producto 12: Catre Clínico (Equipamiento Pesado)
  await prisma.product.create({
    data: {
      name: 'Catre Clínico Manual',
      description: 'Cama hospitalaria de alta resistencia con 2 manivelas para ajuste de posición.',
      brand: 'Estándar Clínico',
      imageUrl: '/images/products/Catre Clinico Manual de 2 Manivelas.png',
      categoryId: catEquipamiento.id,
      isInstitutionalOnly: true,
      variants: {
        create: [
          {
            sku: 'EQU-CAT-MAN-2',
            nameModifier: '2 Manivelas Estándar',
            price: 450000,
            companyPrice: 380000,
            stock: 1000,
            weight: 85,
            length: 210, width: 95, height: 50
          }
        ]
      }
    }
  })

  // Producto 13: Estetoscopio
  await prisma.product.create({
    data: {
      name: 'Estetoscopio Profesional',
      description: 'Campana de acero inoxidable con excelente respuesta acústica para cardiología.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Estetoscopio_Cardiologico_Pro.png',
      categoryId: catEquipamiento.id,
      variants: {
        create: [
          {
            sku: 'EQU-EST-PRO',
            nameModifier: 'Cardiológico Pro',
            price: 85000,
            companyPrice: 68000,
            stock: 2500,
            weight: 0.2,
            length: 30, width: 15, height: 5
          }
        ]
      }
    }
  })

  // Producto 14: Monitor de Presión
  await prisma.product.create({
    data: {
      name: 'Monitor de Presión Arterial',
      description: 'Tensiómetro digital de brazo con detección de pulso irregular y memoria.',
      brand: 'Digital Estándar',
      imageUrl: '/images/products/Monitor_de_Presion_Arterial_Digital.png',
      categoryId: catEquipamiento.id,
      variants: {
        create: [
          {
            sku: 'EQU-TEN-DIG',
            nameModifier: 'Digital de Brazo',
            price: 45900,
            companyPrice: 35000,
            stock: 40,
            weight: 0.4,
            length: 15, width: 12, height: 10
          }
        ]
      }
    }
  })

  // Producto 15: Oxímetro
  await prisma.product.create({
    data: {
      name: 'Oxímetro de Pulso',
      description: 'Medición precisa de saturación de oxígeno y frecuencia cardíaca.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Oximetro de Pulso Profesional.png',
      categoryId: catEquipamiento.id,
      variants: {
        create: [
          {
            sku: 'EQU-OXI-PRO',
            nameModifier: 'Profesional Digital',
            price: 22000,
            companyPrice: 16500,
            stock: 6000,
            weight: 0.05,
            length: 6, width: 3, height: 3
          }
        ]
      }
    }
  })

  // Producto 16: Termómetro Infrarrojo
  await prisma.product.create({
    data: {
      name: 'Termómetro Infrarrojo Frontal',
      description: 'Medición sin contacto en 1 segundo, grado médico.',
      brand: 'Calidad Médica',
      imageUrl: '/images/products/Termometro Infrarrojo Frontal.png',
      categoryId: catEquipamiento.id,
      variants: {
        create: [
          {
            sku: 'EQU-TER-INF',
            nameModifier: 'Sin Contacto Pro',
            price: 28000,
            companyPrice: 21000,
            stock: 100,
            weight: 0.15,
            length: 15, width: 10, height: 5
          }
        ]
      }
    }
  })

  // Producto 17: Paracetamol
  await prisma.product.create({
    data: {
      name: 'Paracetamol',
      description: 'Analgésico y antipirético de uso común.',
      brand: 'Genérico Certificado',
      imageUrl: '/images/products/Paracetamol.png',
      categoryId: catFarmacia.id,
      variants: {
        create: [
          {
            sku: 'PHA-PAR-500-16',
            nameModifier: '500mg (16 Comprimidos)',
            price: 800,
            companyPrice: 600,
            stock: 1000,
            weight: 0.02,
            length: 10, width: 5, height: 1
          },
          {
            sku: 'PHA-PAR-1000-10',
            nameModifier: '1g (10 Comprimidos)',
            price: 1500,
            companyPrice: 1100,
            stock: 500,
            weight: 0.03,
            length: 10, width: 5, height: 1
          }
        ]
      }
    }
  })

  console.log('Seed V2 completado exitosamente.')
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
