import { Run, StatsRuns } from "@/types/run";

export const formatDate = (isoLike: string): string => {
  try {
    const d = new Date(isoLike);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return isoLike;
  }
};


export const formatDuration = (totalSeconds: number, showSeconds = true): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  if(showSeconds) {
    if (hours > 0) return `${hours}h ${mm}min ${ss}s`;
    if (minutes > 0) return `${mm}min ${ss}s`;
    return `${ss}s`;
  } else {
    if (hours > 0) {
      if(minutes > 0) {
        return `${hours}h ${mm}min`;
      }
      return `${hours}h `;
    }
    if (minutes > 0) return `${mm}min`;
    return `0min`;
  }
};


export const formatPaceFromSecondsPerKm = (secondsPerKm: number): string => {
  if (!secondsPerKm || !isFinite(secondsPerKm) || secondsPerKm <= 0) return "-";
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  const ss = String(seconds).padStart(2, "0");
  return `${minutes}:${ss} /km`;
};

export const formatPace = (totalSeconds: number, distanceKm: number): string => {
  if (!distanceKm || !isFinite(distanceKm) || distanceKm <= 0) return "-";
  const secondsPerKm = totalSeconds / distanceKm;
  return formatPaceFromSecondsPerKm(secondsPerKm);
};


export const formatDistanceKm = (km: number): string => {
  if (km == null || !isFinite(km)) return "-";
  const nf = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return `${nf.format(km)} km`;
};


export const reverseRuns = ( runs: Run[] ): Run[] => {
    return [...runs].reverse();
};


export const defaultStatsRuns: StatsRuns = {
  totalRuns: 0,
  totalDistance: 0,
  totalTime: 0,
  averageDistance: 0,
  averagePace: 0,
  averageTime: 0,
  maxDistance: 0,
  minDistance: 0,
  maxTime: 0,
  minTime: 0,
  maxPace: 0,
  minPace: 0,
};

export const computeStatsRuns = (runs: Run[]): StatsRuns => {
  if (runs.length === 0) return defaultStatsRuns

  const stats = runs.reduce(
    (acc, r) => {
      const distance = Number(r.distance);
      const time = Number(r.totalSeconds);
      const pace = time / distance;

      acc.totalRuns += 1;
      acc.totalDistance += distance;
      acc.totalTime += time;
      acc.maxDistance = Math.max(acc.maxDistance, distance);
      acc.minDistance = Math.min(acc.minDistance, distance);
      acc.maxTime = Math.max(acc.maxTime, time);
      acc.minTime = Math.min(acc.minTime, time);
      acc.maxPace = Math.max(acc.maxPace, pace);
      acc.minPace = Math.min(acc.minPace, pace);

      return acc;
    },
    {
      totalRuns: 0,
      totalDistance: 0,
      totalTime: 0,
      averageDistance: 0,
      averagePace: 0,
      averageTime: 0,
      maxDistance: Number.NEGATIVE_INFINITY,
      minDistance: Number.POSITIVE_INFINITY,
      maxTime: Number.NEGATIVE_INFINITY,
      minTime: Number.POSITIVE_INFINITY,
      maxPace: Number.NEGATIVE_INFINITY,
      minPace: Number.POSITIVE_INFINITY,
    }
  ) as StatsRuns;

  stats.averageDistance = stats.totalDistance / stats.totalRuns;
  stats.averagePace = stats.totalDistance > 0 ? stats.totalTime / stats.totalDistance : 0;
  stats.averageTime = stats.totalTime / stats.totalRuns;

  return stats;
}

export const verifyTotalRuns = (totalRuns: number): {noRuns: boolean, value: string} => ({
  noRuns: totalRuns === 0,
  value: totalRuns === 0 ? "-" : "",
})


export const isWithinLastXDays = (dateStr: string | Date, days: number): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}


export const isBetweenDates = (dateStr: string | Date, start: Date, end: Date): boolean => {
  const date = new Date(dateStr);
  return date >= start && date <= end;
}