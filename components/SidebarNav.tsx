"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users 
} from "lucide-react"

export default function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname()

  const links = [
    {
      href: "/dashboard/admin",
      label: "Resumen",
      icon: LayoutDashboard,
      roles: ['ADMIN', 'FINANCE']
    },
    {
      href: "/dashboard/inventory",
      label: "Gestión de Inventario",
      icon: Package,
      roles: ['ADMIN', 'LOGISTICS', 'FINANCE', 'SALES']
    },
    {
      href: "/dashboard/orders",
      label: "Órdenes y Ventas",
      icon: ShoppingCart,
      roles: ['ADMIN', 'SALES', 'FINANCE']
    },
    {
      href: "/dashboard/admin/empleados",
      label: "Gestión de Empleados",
      icon: Users,
      roles: ['ADMIN']
    },
    {
      href: "/dashboard/admin/usuarios",
      label: "Gestión de Clientes",
      icon: Users,
      roles: ['ADMIN']
    },
    {
      href: "/mis-ordenes",
      label: "Mis Órdenes",
      icon: ShoppingCart,
      roles: ['USER', 'COMPANY']
    }
  ]

  return (
    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
      {links.map((link) => {
        if (!link.roles.includes(role)) return null;
        
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
        const Icon = link.icon;

        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? 'bg-brand-primary/10 text-brand-primary font-medium' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
