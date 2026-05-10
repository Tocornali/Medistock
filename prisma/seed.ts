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

  // 2. Crear productos médicos profesionales
  const products = [
    { 
      sku: 'MED-JER-001', 
      nombre: 'Jeringas 5ml (Caja x 100)', 
      descripcion: 'Jeringas hipodérmicas estériles de tres partes, diseñadas para una administración precisa de medicamentos.',
      category: 'Insumos Básicos',
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
      nombre: 'Cama Clínica Eléctrica Pro', 
      descripcion: 'Cama de hospitalización con 3 funciones eléctricas: respaldo, pies y altura.',
      category: 'Mobiliario',
      especificaciones: {
        motores: '3 motores silenciosos',
        material: 'Acero esmaltado',
        barandas: 'Aluminio plegable',
        carga_max: '250 kg'
      },
      precio: 850000, 
      companyPrice: 722500,
      stock_global: 3 
    },
    { 
      sku: 'MED-BAT-001', 
      nombre: 'Bata Quirúrgica Estéril (Unidad)', 
      descripcion: 'Bata de alta protección contra fluidos, diseño reforzado en pecho y mangas.',
      category: 'Vestuario',
      especificaciones: {
        material: 'SMS 45g',
        estéril: 'Sí',
        talla: 'L (Universal)',
        puños: 'Algodón elástico'
      },
      precio: 4500, 
      companyPrice: 3825,
      stock_global: 300 
    },
    { 
      sku: 'MED-ALC-001', 
      nombre: 'Alcohol Gel 70% (Envase 1L)', 
      descripcion: 'Gel sanitizante para manos con glicerina para mayor cuidado de la piel.',
      category: 'Insumos Críticos',
      especificaciones: {
        concentracion: '70% Etanol',
        formato: 'Botella con dosificador',
        ph: 'Neutro',
        registro: 'ISP 1234/26'
      },
      precio: 6800, 
      companyPrice: 5440,
      stock_global: 80 
    },
    { 
      sku: 'MED-CUB-001', 
      nombre: 'Cubrecalzado Desechable (Bolsa x 100)', 
      descripcion: 'Fundas protectoras antideslizantes para calzado, ideales para áreas limpias.',
      category: 'Vestuario',
      especificaciones: {
        material: 'CPE (Polietileno Clorado)',
        talla: 'Estándar (Universal)',
        espesor: '40 micrones',
        color: 'Celeste'
      },
      precio: 6500, 
      companyPrice: 4900,
      stock_global: 45 
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
