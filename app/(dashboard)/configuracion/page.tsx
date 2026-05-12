import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ConfigurationForm from "@/components/ConfigurationForm"

export default async function ConfigurationPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
    }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Configuración de Cuenta</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Gestiona tu información personal y seguridad.</p>
      </div>

      <ConfigurationForm user={user} />
    </div>
  )
}
