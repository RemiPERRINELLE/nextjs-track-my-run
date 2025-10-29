export interface RawRun {
  id: number;
  name?: string | null;
  distance_km: string; // Decimal / string depuis la DB
  duration_sec: number;
  run_date: Date;
}

export interface Run {
  id: number;
  name?: string;
  distance: number;       // converti depuis distance_km
  totalSeconds: number;   // égal à duration_sec
  date: string;           // run_date formaté en ISO ou "YYYY-MM-DD"
}

export interface StatsRuns {
  totalRuns: number;
  totalDistance: number;
  totalTime: number;
  averageDistance: number;
  averagePace: number;
  averageTime: number;
  maxDistance: number;
  minDistance: number; 
  maxTime: number;
  minTime: number;
  maxPace: number;
  minPace: number;
};

export interface RunData {
  id: number,
  name: string,
  distance: string,
  hours: number,
  minutes: number,
  seconds: number,
  date: string,
}