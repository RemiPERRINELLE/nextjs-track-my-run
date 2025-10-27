"use client";

import { useEffect } from "react";
import { useRuns } from "@/contexts/RunsContext";

export const useFetchRuns = (session: any) => {
  const { setRuns } = useRuns();

  const fetchAndSetRuns = async () => {
    try {
      const res = await fetch("/api/runs");
      if (!res.ok) throw new Error("Erreur récupération runs");
      const data = await res.json();
      setRuns(data.runs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!session) return;
    fetchAndSetRuns();
  }, [session]);

  return fetchAndSetRuns;
}
