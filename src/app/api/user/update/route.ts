import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import db from "@/lib/db";
import { z } from "zod";

const UpdateUserSchema = z.object({
  pseudo: z.string().min(3, "Le pseudo doit faire au moins 3 caractères"),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"),
});

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ field: "session", error: "Utilisateur introuvable" }, { status: 400 });

    const body = await req.json();
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) {
      const err = parsed.error.issues[0];
      return NextResponse.json({ field: err.path[0], error: err.message }, { status: 400 });
    }

    const { email, pseudo } = parsed.data;

    // Vérifier si un autre utilisateur utilise déjà ces infos
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== user.id)
      return NextResponse.json({ field: "email", error: "Email déjà utilisé" }, { status: 400 });

    const existingPseudo = await db.user.findUnique({ where: { pseudo } });
    if (existingPseudo && existingPseudo.id !== user.id)
      return NextResponse.json({ field: "pseudo", error: "Pseudo déjà utilisé" }, { status: 400 });

    // Mise à jour
    await db.user.update({
      where: { id: user.id },
      data: { email, pseudo },
    });


    return NextResponse.json({
      user: {
        id: user.id,
        email,
        name: pseudo
      },
      message: "Informations mises à jour avec succès !"
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
