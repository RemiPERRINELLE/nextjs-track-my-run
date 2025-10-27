import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token manquant"),
  newPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const err = parsed.error.issues[0];
      return NextResponse.json({ field: err.path[0], error: err.message }, { status: 400 });
    }

    const { token, newPassword } = parsed.data;

    // Vérifier le token
    const user = await db.user.findFirst({
      where: {
        reset_password_token: token,
        reset_password_expires: { gte: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 400 });
    }

    // Hasher et mettre à jour le mot de passe
    const hashedPassword = await hashPassword(newPassword);

    await db.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (err) {
    console.error("Erreur dans reset-password :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
