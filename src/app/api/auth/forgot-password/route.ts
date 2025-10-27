import { NextResponse } from "next/server";
import db from "@/lib/db";
import crypto from "crypto";
import { z } from "zod";
import { sendMail } from "@/lib/email";

const ForgotPasswordSchema = z.object({
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email invalide"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const err = parsed.error.issues[0]
      return NextResponse.json({ field: err.path[0], error: err.message },{ status: 400 })
    }

    const { email } = parsed.data;

    // Cherche l'utilisateur
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'utilisateur existe ou pas
      return NextResponse.json({ message: "Si ce compte existe, un email a été envoyé." });
    }

    // Génère un token sécurisé
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // valable 1h

    // Sauvegarde du token dans la BDD
    await db.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: token,
        reset_password_expires: expires,
      },
    });

    // Construire le lien de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    // Envoi du mail
    const result = await sendMail({
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien :</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Ce lien expirera dans 1 heure.</p>`,
    });

     if (!result.success) {
      return Response.json({ error: 'Erreur lors de l’envoi du mail' }, { status: 500 });
    }

    return NextResponse.json({ message: "Email envoyé" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
