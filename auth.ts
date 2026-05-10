import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        rut: { label: "RUT", type: "text" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" }
      },
      async authorize(credentials) {
        const portal = credentials?.portal as string;
        
        if (portal === 'STAFF') {
          if (!credentials?.rut || !credentials?.password) return null;
          const rut = credentials.rut as string;
          const user = await prisma.user.findFirst({ where: { rut } });
          
          if (!user) return null;
          if (user.role === 'USER' || user.role === 'COMPANY') {
            throw new Error("USE_CLIENT_PORTAL");
          }
          if (!user.isActive) {
            throw new Error("INACTIVE_ACCOUNT:" + user.rut);
          }
          if (!user.password) return null;
          
          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          if (!isValid) return null;
          
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        } 
        
        // Default to CLIENT
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const user = await prisma.user.findFirst({ where: { email } });
        
        if (!user) return null;
        if (user.role !== 'USER' && user.role !== 'COMPANY') {
          throw new Error("USE_STAFF_PORTAL");
        }
        if (!user.password) return null;
        
        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;
        
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    }
  }
})
