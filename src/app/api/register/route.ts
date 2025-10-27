import { NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import db from "@/lib/db"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"),
  pseudo: z.string().min(3, "Le pseudo doit faire au moins 3 caractères"),
  password: z.string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validation avec le schema Zod
    const parsed = registerSchema.safeParse(body)
      if (!parsed.success) {
        const err = parsed.error.issues[0]
        return NextResponse.json({ field: err.path[0], error: err.message },{ status: 400 })
      }

    const { email, pseudo, password } = parsed.data


    // Vérification si email existe déjà
    const existingEmail = await db.user.findUnique({ where: { email } })
    if (existingEmail) return NextResponse.json({ field: "email", error: "Email déjà utilisé" }, { status: 400 });
    // Vérification si pseudo existe déjà
    const existingPseudo = await db.user.findUnique({ where: { pseudo } })
    if (existingPseudo) return NextResponse.json({ field: "pseudo", error: "Pseudo déjà utilisé" }, { status: 400 });
    

    const password_hash = await hashPassword(password);


    await db.user.create({
      data: {
        public_id: crypto.randomUUID(),
        email,
        pseudo,
        password_hash,
      },
    })

    return NextResponse.json({ message: "Utilisateur créé" }, { status: 201 })
  } catch(error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
