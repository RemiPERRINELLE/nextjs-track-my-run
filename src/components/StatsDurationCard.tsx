import { FaClock } from "react-icons/fa";
import { formatDuration, verifyTotalRuns } from "@/lib/run";
import { useRuns } from "@/contexts/RunsContext";

export const StatsDurationCard = () => {
    const { statsRuns } = useRuns();

    const totalRunsStatus = verifyTotalRuns(statsRuns.totalRuns);


    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 border-l-4 border-pink-400">
            <div className="flex items-center gap-2">
                <FaClock className="text-pink-400 text-xl" />
                <h3 className="font-semibold text-xl">Durée - <span className="text-base text-gray-300">Total : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDuration(statsRuns.totalTime, true)}</span></h3>
            </div>
            <p className="text-2xl font-bold">Moyenne : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDuration(statsRuns.averageTime, true)}</p>
            <div className="space-y-1">
                <p className="text-gray-300">Max : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDuration(statsRuns.maxTime, true)}</p>
                <p className="text-gray-300">Min : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDuration(statsRuns.minTime, true)}</p>
            </div>
        </div>
    );
}