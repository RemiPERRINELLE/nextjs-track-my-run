import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "@/lib/auth"
import db from "@/lib/db"
import { z } from "zod"

const CredentialsSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"),
  password: z.string().min(1),
});


export const authOptions : AuthOptions = ({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {

        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        
        // Récupérer l’utilisateur en BDD
        const user = await db.user.findUnique({
          where: { email },
        })        
        
        if (!user) {
          // utilisateur non trouvé
          throw new Error("Email non trouvé.")
        }
        
        // Vérifier le mot de passe
        const isValid = await verifyPassword(password, user.password_hash)
        if (!isValid) {
          throw new Error("Mot de passe invalide.")
        }

        return {
          id: user.public_id,
          email: user.email,
          name: user.pseudo,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 12,   // rafraîchit toutes les 12h
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,  // token expire au bout de 7 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export default NextAuth(authOptions);


