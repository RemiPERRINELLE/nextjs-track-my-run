import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import db from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    // Vérifie l’utilisateur connecté
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 400 }
      );

    await db.run.deleteMany({ where: { user_id: user.id } });
    await db.user.delete({ where: { id: user.id } });

    return NextResponse.json(
      { success: "Compte supprimé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur DELETE /api/user/delete :", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
