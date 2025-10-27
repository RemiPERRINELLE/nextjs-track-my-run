"use client";

import { FaRoad } from "react-icons/fa";
import { formatDistanceKm, verifyTotalRuns } from "@/lib/run";
import { useRuns } from "@/contexts/RunsContext";


export const StatsDistanceCard = () => {
    const { statsRuns } = useRuns();

    const totalRunsStatus = verifyTotalRuns(statsRuns.totalRuns);


    return (
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 border-l-4 border-green-400">
                <div className="flex items-center gap-2">
                    <FaRoad className="text-green-400 text-xl" />
                    <h3 className="font-semibold text-xl">Distance - <span className="text-base text-gray-300">Total : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDistanceKm(statsRuns.totalDistance)}</span></h3>
                </div>
                <p className="text-2xl font-bold">Moyenne : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDistanceKm(statsRuns.averageDistance)}</p>
                <div className="space-y-1">
                    <p className="text-gray-300">Max : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDistanceKm(statsRuns.maxDistance)}</p>
                    <p className="text-gray-300">Min : {totalRunsStatus.noRuns ? totalRunsStatus.value : formatDistanceKm(statsRuns.minDistance)}</p>
                </div>
            </div>
    );
}