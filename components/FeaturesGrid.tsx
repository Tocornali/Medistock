import { ShoppingBag, Building2, Code, Truck } from "lucide-react"

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Venta Directa a Profesionales",
    description: "Insumos médicos de alta calidad accesibles para el sector salud con pagos web y despachos rápidos."
  },
  {
    icon: Building2,
    title: "Portal Institucional B2B",
    description: "Flujo especializado para clínicas con validación de OC, cotizaciones y facturación automatizada."
  },
  {
    icon: Code,
    title: "API REST para Terceros",
    description: "Integra nuestro catálogo y stock en tiempo real directamente en tu propia plataforma de e-commerce o ERP."
  },
  {
    icon: Truck,
    title: "Logística Garantizada",
    description: "Control exacto de inventario y seguimiento de envíos tanto para compras minoristas como volúmenes mayoristas."
  }
]

export default function FeaturesGrid() {
  return (
    <section className="w-full bg-slate-100 dark:bg-brand-dark py-24 px-6 border-t border-slate-200 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 transition-colors">
            Ecosistema Integral de Abastecimiento
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors">
            Nuestra arquitectura está diseñada para escalar: desde compras minoristas B2C, hasta soluciones corporativas B2B e integraciones vía API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div 
                key={idx} 
                className="group p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-brand-primary dark:hover:border-brand-primary/50 hover:bg-slate-50 dark:hover:bg-white/[0.07] shadow-sm dark:shadow-none transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
