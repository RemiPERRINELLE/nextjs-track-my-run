import { FaStopwatch } from "react-icons/fa";
import { formatPaceFromSecondsPerKm, verifyTotalRuns } from "@/lib/run";
import { useRuns } from "@/contexts/RunsContext";


export const StatsPaceCard = () => {
    const { statsRuns } = useRuns();

    const totalRunsStatus = verifyTotalRuns(statsRuns.totalRuns);

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 border-l-4 border-blue-400">
            <div className="flex items-center gap-2">
                <FaStopwatch className="text-blue-400 text-xl" />
                <h3 className="font-semibold text-xl">Rythme</h3>
            </div>
            <p className="text-2xl font-bold">Moyenne : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatPaceFromSecondsPerKm(statsRuns.averagePace)}</p>
            <div className="space-y-1">
                <p className="text-gray-300">Max : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatPaceFromSecondsPerKm(statsRuns.maxPace)}</p>
                <p className="text-gray-300">Min : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatPaceFromSecondsPerKm(statsRuns.minPace)}</p>
            </div>
        </div>
    );
}