import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de MEDISTOCK...')

  // 1. Crear 1 usuario de prueba
  const user = await prisma.user.upsert({
    where: { rut: '1-9' },
    update: {},
    create: {
      rut: '1-9',
      email: 'admin@medistock.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      isActive: true,
      role: Role.ADMIN,
    },
  })

  // 2. Limpiar y Crear productos médicos profesionales
  await prisma.product.deleteMany()
  
  const products = [
    { 
      sku: 'MED-JER-001', 
      nombre: 'Jeringas 5ml (Caja x 100)', 
      descripcion: 'Jeringas hipodérmicas estériles de tres partes, diseñadas para una administración precisa de medicamentos.',
      category: 'Insumos Básicos',
      image: '/images/products/Jeringas_5ml_(Caja_x_100).png',
      especificaciones: {
        material: 'Polipropileno grado médico',
        estéril: 'Sí (Óxido de Etileno)',
        volumen: '5ml',
        presentacion: 'Caja x 100 unidades'
      },
      precio: 15500, 
      companyPrice: 12400,
      stock_global: 50 
    },
    { 
      sku: 'MED-MON-001', 
      nombre: 'Monitor de Presión Arterial Digital', 
      descripcion: 'Monitor de brazo automático con detección de arritmias y memoria para dos usuarios.',
      category: 'Equipamiento',
      image: '/images/products/Monitor_de_Presion_Arterial_Digital.png',
      especificaciones: {
        tipo: 'Digital de brazo',
        memoria: '90 lecturas',
        precision: '+/- 3 mmHg',
        certificaciones: 'ISO 13485'
      },
      precio: 45000, 
      companyPrice: 38250,
      stock_global: 15 
    },
    { 
      sku: 'MED-GUA-001', 
      nombre: 'Guantes de Nitrilo M (Caja x 100)', 
      descripcion: 'Guantes de examen sin polvo, alta resistencia y sensibilidad táctil.',
      category: 'Protección',
      image: '/images/products/Guantes_de_Nitrilo_M_(Caja_x_100).png',
      especificaciones: {
        material: 'Nitrilo sintético',
        color: 'Azul cobalto',
        talla: 'M',
        caracteristica: 'Libre de látex'
      },
      precio: 9800, 
      companyPrice: 7840,
      stock_global: 200 
    },
    { 
      sku: 'MED-EST-001', 
      nombre: 'Estetoscopio Cardiológico Pro', 
      descripcion: 'Instrumento acústico de alta sensibilidad para auscultación cardíaca y pulmonar superior.',
      category: 'Diagnóstico',
      image: '/images/products/Estetoscopio_Cardiologico_Pro.png',
      especificaciones: {
        campana: 'Acero inoxidable',
        diafragma: 'Sintonizable',
        longitud: '69 cm',
        peso: '175g'
      },
      precio: 89000, 
      companyPrice: 75650,
      stock_global: 5 
    },
    { 
      sku: 'MED-GAS-001', 
      nombre: 'Gasas Estériles 10x10cm (Caja x 50)', 
      descripcion: 'Compresas de gasa tejida de algodón 100%, altamente absorbentes para curaciones.',
      category: 'Insumos Básicos',
      image: '/images/products/Gasas Esteriles 10x10cm (Caja x 50).png',
      especificaciones: {
        capas: '12 pliegues',
        hilos: '20x12',
        estéril: 'Sí',
        empaque: 'Individual'
      },
      precio: 5500, 
      companyPrice: 4675,
      stock_global: 150 
    },
    { 
      sku: 'MED-OX-001', 
      nombre: 'Oxímetro de Pulso Profesional', 
      descripcion: 'Medición rápida y precisa de SpO2 y frecuencia cardíaca con pantalla OLED.',
      category: 'Diagnóstico',
      image: '/images/products/Oximetro de Pulso Profesional.png',
      especificaciones: {
        rango_SpO2: '70% - 100%',
        rango_pulso: '30 - 250 bpm',
        bateria: 'AAA x 2',
        pantalla: 'OLED color'
      },
      precio: 22000, 
      companyPrice: 18700,
      stock_global: 0 
    },
    { 
      sku: 'MED-MAS-001', 
      nombre: 'Mascarillas KN95 (Caja x 20)', 
      descripcion: 'Mascarillas de alta filtración con 5 capas de protección, diseño ergonómico.',
      category: 'Protección',
      image: '/images/products/Mascarilla KN95 (Caja x 20).png',
      especificaciones: {
        filtracion: '>= 95%',
        capas: '5 capas',
        color: 'Blanco',
        ajuste: 'Clip nasal interno'
      },
      precio: 12500, 
      companyPrice: 10000,
      stock_global: 100 
    },
    { 
      sku: 'MED-TER-001', 
      nombre: 'Termómetro Infrarrojo Sin Contacto', 
      descripcion: 'Medición instantánea de temperatura corporal a distancia con alerta sonora.',
      category: 'Diagnóstico',
      image: '/images/products/Termometro Infrarrojo Frontal.png',
      especificaciones: {
        distancia: '3 - 5 cm',
        tiempo: '< 1 segundo',
        pantalla: 'LCD retroiluminada',
        memoria: '32 registros'
      },
      precio: 35000, 
      companyPrice: 29750,
      stock_global: 25 
    },
    { 
      sku: 'MED-CAM-001', 
      nombre: 'Cama Clínica Manual de 2 Manivelas', 
      descripcion: 'Catre clínico con sistema de manivelas para ajuste de respaldo y piernas.',
      category: 'Mobiliario',
      image: '/images/products/Catre Clinico Manual de 2 Manivelas.png',
      especificaciones: {
        manivelas: '2',
        material: 'Acero esmaltado',
        barandas: 'Aluminio plegable',
        carga_max: '180 kg'
      },
      precio: 450000, 
      companyPrice: 382500,
      stock_global: 8 
    },
    { 
      sku: 'MED-DES-001', 
      nombre: 'Desfibrilador Externo Automático (DEA)', 
      descripcion: 'Equipo de emergencia portátil para RCP con guía de voz y parches pediátricos/adultos.',
      category: 'Equipamiento',
      image: '/images/products/Desfibrilador Externo Automatico.png',
      especificaciones: {
        tipo: 'Automático',
        bateria: 'Larga duración (5 años)',
        certificaciones: 'FDA, CE',
        accesorios: 'Kit de rescate incluido'
      },
      precio: 1200000, 
      companyPrice: 1050000,
      stock_global: 4 
    },
    { 
      sku: 'MED-SUE-001', 
      nombre: 'Suero Fisiológico 0.9% (500ml)', 
      descripcion: 'Solución isotónica para irrigación, limpieza de heridas e hidratación.',
      category: 'Insumos Básicos',
      image: '/images/products/Suero Fisiologico 0.9 500ml.png',
      especificaciones: {
        concentracion: '0.9% NaCl',
        formato: 'Bolsa PVC free',
        volumen: '500ml',
        estéril: 'Sí'
      },
      precio: 2500, 
      companyPrice: 1900,
      stock_global: 120 
    },
    { 
      sku: 'MED-PEC-001', 
      nombre: 'Pecheras Desechables Manga Larga', 
      descripcion: 'Protección corporal impermeable de polietileno con lazo en cintura.',
      category: 'Vestuario',
      image: '/images/products/Pecheras Desechables Manga Larga.png',
      especificaciones: {
        material: 'CPE',
        espesor: '30 micrones',
        talla: 'Universal',
        puños: 'Elásticos'
      },
      precio: 8500, 
      companyPrice: 6800,
      stock_global: 50 
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    })
  }

  console.log(`Seed ejecutado correctamente: 1 usuario y ${products.length} productos creados/actualizados.`)
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
