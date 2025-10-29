import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { z } from "zod"
import { getAuthenticatedUser } from "@/lib/auth"

    

const createRunSchema = z.object({
  name: z.string().max(100, "Max 100 caractères").optional().or(z.literal("")),
  distance_km: z.number().positive().multipleOf(0.1),
  duration_sec: z.number().positive(),
  run_date: z.coerce.date(),
})

const updateRunSchema = createRunSchema.extend({
  id: z.number(),
});

const deleteRunSchema = z.object({
  id: z.number(),
});


async function getRunOrFail(runId: number, userId: number) {
  // Récupération de la run dans la BDD
  const run = await db.run.findUnique({ where: { id: runId } });

  // Si elle n'existe pas, renvoyer une erreur
  if (!run) return { error: { field: "form", error: "Run introuvable" } };

  // Vérifier si l'utilisateur est bien celui lié à la run
  if (run.user_id !== userId) return { error: { field: "session", error: "Accès refusé" } };

  return { run };
}



export async function POST(req: NextRequest) {
  try {
    
    // Récupération des données du formulaire
    const body = await req.json()
    
    // Validation avec le schema Zod
    const parsed = createRunSchema.safeParse(body)
    if (!parsed.success) {
      const err = parsed.error.issues[0]
      return NextResponse.json({ field: err.path[0], error: err.message },{ status: 400 })
    }

    // Extraction des données
    const { name, distance_km, duration_sec, run_date } = parsed.data;

    // Vérifier si utilisateur connecté
    const user = await getAuthenticatedUser();

    // Si pas d'utilisateur alors modifier le state local
    if (!user) return NextResponse.json({ field: "session", error: "Utilisateur introuvable" }, { status: 400 });

    // Si utilisateur alors mettre à jour la BDD
    const runCreated = await db.run.create({
      data: {
        name,
        distance_km,
        duration_sec,
        run_date,
        user_id: user.id,
      },
    })

    return NextResponse.json({ message: "Run créée", run: runCreated }, { status: 201 })
  } catch(error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {

    // Récupération des données du formulaire
    const body = await req.json();

    // Validation avec le schema Zod
    const parsed = updateRunSchema.safeParse(body);
    if (!parsed.success) {
      const err = parsed.error.issues[0];
      return NextResponse.json({ field: err.path[0], error: err.message }, { status: 400 });
    }
    
    // Extraction des données
    const { id, name, distance_km, duration_sec, run_date } = parsed.data;

    // Vérifier si utilisateur connecté
    const user = await getAuthenticatedUser();

    // Si pas d'utilisateur alors modifier le state local
    if (!user) return NextResponse.json({ field: "session", error: "Utilisateur introuvable" }, { status: 400 });

    // Vérifier si run existante et si utilisateur est bien celui lié à elle
    const { error } = await getRunOrFail(id, user.id);
    if (error) return NextResponse.json(error, { status: 400 });

    // Si utilisateur alors mettre à jour la BDD
    const runUpdated = await db.run.update({
      where: { id },
      data: {
        name: name,
        distance_km: distance_km,
        duration_sec: duration_sec,
        run_date: run_date,
      },
    });

    return NextResponse.json({ message: "Run modifiée", run: runUpdated }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    
    // Récupération des données du formulaire
    const body = await req.json();

    // Validation avec le schema Zod
    const parsed = deleteRunSchema.safeParse(body);
    if (!parsed.success) {
      const err = parsed.error.issues[0];
      return NextResponse.json({ field: err.path[0], error: err.message }, { status: 400 });
    }
    
    // Extraction des données
    const { id } = parsed.data;

    // Vérifier si utilisateur connecté
    const user = await getAuthenticatedUser();

    // Si pas d'utilisateur alors modifier le state local
    if (!user) return NextResponse.json({ field: "session", error: "Utilisateur introuvable" }, { status: 400 });

    // Vérifier si run existante et si utilisateur est bien celui lié à elle
    const { error } = await getRunOrFail(id, user.id);
    if (error) return NextResponse.json(error, { status: 400 });

    // Si utilisateur alors mettre à jour la BDD
    await db.run.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Run supprimée" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { field: "session", error: "Utilisateur introuvable" },
        { status: 400 }
      );
    }

    const runs = await db.run.findMany({
      where: { user_id: user.id },
      orderBy: { run_date: "desc" },
      select: {
        id: true,
        name: true,
        distance_km: true,
        duration_sec: true,
        run_date: true,
      },
    });

    // Mapping pour correspondre au format front
    const runsData = runs.map(r => ({
      id: r.id,
      name: r.name,
      distance: r.distance_km,
      totalSeconds: r.duration_sec,
      date: r.run_date.toISOString().split("T")[0],
    }));

    // Dernière course
    const lastRun = runsData.length > 0 ? runsData[0] : null;

    // Stats globales
    const totalDistance = runsData.reduce((acc, r) => acc + Number(r.distance), 0);
    const totalTime = runsData.reduce((acc, r) => acc + r.totalSeconds, 0);
    const totalRuns = runsData.length;
    const averagePace = totalDistance > 0 ? totalTime / totalDistance : 0;
    const averageDistance = runsData.length > 0 ? totalDistance / runsData.length : 0;
    const averageTime = totalRuns > 0 ? totalTime / totalRuns : 0;


    const statsRuns = {
      totalRuns,
      totalDistance,
      totalTime,
      averagePace,
      averageDistance,
      averageTime,
    };


    return NextResponse.json({ runs: runsData, lastRun, statsRuns }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
