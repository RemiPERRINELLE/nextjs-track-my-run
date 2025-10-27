import { FaRunning } from "react-icons/fa";
import { formatDate, formatDistanceKm, formatDuration } from "@/lib/run";
import { useRuns } from "@/contexts/RunsContext";


export const StatsLastRunCard = () => {
    const { filteredRuns } = useRuns();
    const lastRun = filteredRuns[0] || null;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 border-l-4 border-orange-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaRunning className="text-orange-400 text-xl" />
          <h3 className="font-semibold text-xl">Dernière run</h3>
        </div>
      </div>

      {lastRun ? (
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">{formatDistanceKm(lastRun.distance)}</p>
          <p className="text-gray-300 text-sm">
            {formatDate(lastRun.date)} · {formatDuration(lastRun.totalSeconds)}
          </p>
          <p className="text-gray-400 text-sm italic">{lastRun.name}</p>
        </div>
      ) : (
        <p className="text-gray-400">Aucune run enregistrée</p>
      )}
    </div>
  );
}