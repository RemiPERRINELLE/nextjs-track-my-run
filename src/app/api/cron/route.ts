import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await db.$queryRaw`SELECT 1;`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Ping error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

}
