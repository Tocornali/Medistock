import type { NextAuthConfig } from "next-auth"

// Esta configuración es compatible con el Edge Runtime
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 horas de TTL estricto
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Los proveedores se definen en auth.ts para evitar importar Prisma/bcrypt en el Edge
} satisfies NextAuthConfig;
