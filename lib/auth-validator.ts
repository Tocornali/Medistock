import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

/**
 * Validador estricto de sesión (Híbrido JWT + BD).
 * Verifica el JWT de NextAuth y además realiza una comprobación física en la 
 * Base de Datos para asegurar revocación instantánea de sesiones.
 * 
 * @param allowedRoles Array de roles permitidos. Si está vacío, permite todos los autenticados.
 * @returns El usuario validado desde la base de datos.
 */
export async function requireStrictAuth(allowedRoles?: Role[]) {
  // 1. Verificamos la existencia de la sesión JWT (con su TTL de 12 horas ya configurado)
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?reason=missing');
  }

  // 2. Consulta física a la Base de Datos para asegurar consistencia e integridad.
  // Esto soluciona la debilidad del JWT: si el admin desactiva la cuenta, el JWT 
  // seguiría siendo válido. Al consultar la BD, lo invalidamos al instante.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    // El usuario fue borrado de la base de datos
    redirect('/login?reason=invalid');
  }

  // 3. Verificamos si la cuenta fue suspendida/inactivada por un administrador
  if (!user.isActive) {
    redirect('/login?reason=suspended');
  }

  // 4. Verificación de Permisos (RBAC)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    redirect('/dashboard?error=unauthorized');
  }

  // 5. La sesión es 100% válida. Retornamos el estado de usuario actualizado desde BD.
  return user;
}
