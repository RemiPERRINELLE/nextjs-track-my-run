import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, verifyPassword, hashPassword } from "@/lib/auth";
import db from "@/lib/db";
import { z } from "zod";

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Mot de passe actuel requis"),
  newPassword: z.string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
});

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ field: "session", error: "Utilisateur introuvable" }, { status: 400 });

    const body = await req.json();
    const parsed = UpdatePasswordSchema.safeParse(body);
    if (!parsed.success) {
      const err = parsed.error.issues[0];
      return NextResponse.json({ field: err.path[0], error: err.message }, { status: 400 });
    }

    const { currentPassword, newPassword } = parsed.data;

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    const isValid = await verifyPassword(currentPassword, dbUser.password_hash);
    if (!isValid) {
      return NextResponse.json({ field: "currentPassword", error: "Mot de passe actuel incorrect" }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { password_hash: newHash },
    });

    return NextResponse.json({
      user: {
        name: dbUser.pseudo,
        email: dbUser.email
      },
      message: "Mot de passe mis à jour avec succès !"
    },{ status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
