import { hash, compare } from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "./db"

// Hash du mot de passe
export async function hashPassword(password: string) {
  return await hash(password, 10)  // 10 = salt rounds
}

// Vérification du mot de passe
export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return db.user.findUnique({
    where: { public_id: session.user.id },
    select: { id: true },
  });
}

export async function getSessionServer() {
  return await getServerSession(authOptions);
}
