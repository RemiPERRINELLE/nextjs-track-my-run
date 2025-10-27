"use client";

import { useEffect } from "react";
import { Run, StatsRuns } from "@/types/run";
import { computeStatsRuns, defaultStatsRuns } from "@/lib/run";

export const useComputeStats = ( runs: Run[], setStatsRuns: (stats: StatsRuns) => void) => {

  useEffect(() => {
    if (runs.length === 0) {
      setStatsRuns(defaultStatsRuns);
      return;
    }
    setStatsRuns(computeStatsRuns(runs));
  }, [runs]);
}
