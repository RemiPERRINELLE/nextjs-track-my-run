
import { Run } from "@/types/run";
import fakeRuns from "@/app/data/fakeRuns.json";
import { getSessionServer } from "@/lib/auth";
import db from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import { RunsProvider } from "@/contexts/RunsContext";
import { DashboardBlocks } from "@/components/DashboardBlocks";
import { UserButton } from "@/components/UserButton";
import { ModalProvider } from "@/contexts/ModalContext";
import { UserProvider } from "@/contexts/UserContext";

export default async function Page() {
  const session = await getSessionServer();
  const user = await getAuthenticatedUser();

  const runs: Run[] = session
    ? await db.run.findMany({
        where: { user_id: user?.id },
        orderBy: { run_date: "desc" },
        select: {
          id: true,
          name: true,
          distance_km: true,
          duration_sec: true,
          run_date: true,
        },
      }).then(runs =>
        runs.map(r => ({
          id: r.id,
          name: r.name ?? '',
          distance: Number(r.distance_km),
          totalSeconds: Number(r.duration_sec),
          date: r.run_date.toISOString().split("T")[0],
        }))
      )
    : [...fakeRuns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <UserProvider initialUser={session?.user ?? null}>
      <RunsProvider initialRuns={runs}>
        <ModalProvider>
            <UserButton />
            <main className="p-6">
                <DashboardBlocks />
            </main>
        </ModalProvider>
      </RunsProvider>
    </UserProvider>
  );
}
