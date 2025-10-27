"use client"

import { createContext, Dispatch, SetStateAction, useContext, useState, useEffect, useMemo } from "react";
import { Run, StatsRuns } from "@/types/run";
import { useComputeStats } from "@/hooks/useComputeStats";
// import { useFetchRuns } from "@/hooks/useFetchRuns";
import { defaultStatsRuns, isWithinLastXDays, isBetweenDates } from "@/lib/run";
import { useSession } from "next-auth/react";
import { addRun as addRunAction, updateRun as updateRunAction, deleteRun as deleteRunAction } from "@/lib/actions";


// 1. Create the context

    // Type
    type runResult =
        | { ok: true; run: Run }
        | { ok: false; field?: string; error?: string };


    interface RunsContextType {
        runs: Run[];
        setRuns: Dispatch<SetStateAction<Run[]>>;
        filteredRuns: Run[];
        periodFilter: string;
        setPeriodFilter: React.Dispatch<React.SetStateAction<string>>;
        countFilter: string;
        setCountFilter: React.Dispatch<React.SetStateAction<string>>;
        customPeriod: { start: Date; end: Date } | null;
        setCustomPeriod: React.Dispatch<React.SetStateAction<{ start: Date; end: Date } | null>>;
        customCount: number | null;
        setCustomCount: React.Dispatch<React.SetStateAction<number | null>>;
        statsRuns: StatsRuns;
        setStatsRuns: Dispatch<SetStateAction<StatsRuns>>;
        lastRun: Run | null;
        setLastRun: Dispatch<SetStateAction<Run | null>>;
        addRunCtx: (data: { name: string; distance: number; totalSeconds: number; date: string }) => Promise<runResult>;
        updateRunCtx: (data: { id: number; name: string; distance: number; totalSeconds: number; date: string }) => Promise<runResult>;
        deleteRunCtx: (id: number) => Promise<{ ok: boolean; field?: string; error?: string }>;
    }

    const defaultValues:  RunsContextType = {
        runs: [],
        setRuns: () => {},
        filteredRuns: [],
        periodFilter: "all",
        setPeriodFilter: () => {},
        countFilter: "all",
        setCountFilter: () => {},
        customPeriod: null,
        setCustomPeriod: () => {},
        customCount: null,
        setCustomCount: () => {},
        statsRuns: defaultStatsRuns,
        setStatsRuns: () => {},
        lastRun: null,
        setLastRun: () => {},
        addRunCtx: async () => ({ ok: false }),
        updateRunCtx: async () => ({ ok: false }),
        deleteRunCtx: async () => ({ ok: false }),
    }

    // createContext
    const RunsContext = createContext<RunsContextType>(defaultValues);

    // Normalisation helper
    function normalizeRun(run: any): Run {
        return {
            ...run,
            distance: Number(run.distance_km ?? run.distance ?? 0),
            totalSeconds: Number(run.duration_sec ?? run.totalSeconds ?? 0),
            date: run.run_date || run.date,
        };
    }


// 2. Provide it

    // Type
    interface RunsProviderProps {
        children?: React.ReactNode;
        initialRuns: Run[];
        // session: any;
    }

    export function RunsProvider ({ children, initialRuns }: RunsProviderProps) {
        // useState
        const [runs, setRuns] = useState<Run[]>(initialRuns.map(normalizeRun));
        const [periodFilter, setPeriodFilter] = useState("all");
        const [countFilter, setCountFilter] = useState("all");
        const [customPeriod, setCustomPeriod] = useState<{ start: Date; end: Date } | null>(null);
        const [customCount, setCustomCount] = useState<number | null>(null);
        const [statsRuns, setStatsRuns] = useState<StatsRuns>(defaultStatsRuns);       
        const [lastRun, setLastRun] = useState<Run | null>(initialRuns[0] ? normalizeRun(initialRuns[0]) : null);
            
        const { data: session } = useSession(); // hook côté client

        const isDemoMode = !session;

        // useFetchRuns(session);

        useEffect(() => {
            const fetchAndSetRuns = async () => {
                if (isDemoMode) return;
                try {
                    const res = await fetch("/api/runs");
                    if (!res.ok) throw new Error("Erreur récupération runs");
                    const data = await res.json();
                    const normalized = (data.runs || []).map(normalizeRun);
                    setRuns(normalized);
                    // setFilteredRuns(normalized);
                } catch (err) {
                    console.error(err);
                }
            };

            fetchAndSetRuns();
        }, [session]);

        const filteredRuns = useMemo(() => {
            let filtered = [...runs];

            // --- Filtre période ---
            const now = new Date();
            if (periodFilter === "7") {
                filtered = filtered.filter(run => isWithinLastXDays(run.date, 7));
            } else if (periodFilter === "30") {
                filtered = filtered.filter(run => isWithinLastXDays(run.date, 30));
            } else if (periodFilter === "90") {
                filtered = filtered.filter(run => isWithinLastXDays(run.date, 90));
            } else if (periodFilter === "custom" && customPeriod) {
                filtered = filtered.filter(run => isBetweenDates(run.date, customPeriod.start, customPeriod.end));
            }

            // --- Filtre nombre de runs ---
            if (countFilter !== "all") {
                const limit = countFilter === "custom" && customCount ? customCount : Number(countFilter);
                filtered = filtered.slice(0, limit);
            }

            return filtered;
        }, [runs, periodFilter, countFilter, customPeriod, customCount]);

        useComputeStats(filteredRuns, setStatsRuns);



        const addRunCtx: RunsContextType["addRunCtx"] = async (data) => {
            try {
                let newRun: Run;

                if (isDemoMode) {
                    newRun = normalizeRun({
                        ...data,
                        id: Date.now(),       // ID unique pour le mode démo
                    });
                } else {
                    const res = await addRunAction(data);
    
                    const json = await res.json();
    
                    if (!res.ok) {
                        return { ok: false, field: json.field, error: json.error || "Erreur inconnue" };
                    }
    
                    newRun = normalizeRun(json.run);
                }


                return { ok: true, run: newRun };
            } catch (e) {
                console.error(e);
                return { ok: false, error: "Erreur réseau" };
            }
        };

        const updateRunCtx: RunsContextType["updateRunCtx"] = async (data) => {
            try {
                let updatedRun: Run;

                if (isDemoMode) {
                    updatedRun = normalizeRun(data);
                } else {
                    const res = await updateRunAction(data);
                    const json = await res.json();
    
                    if (!res.ok) {
                        return { ok: false, field: json.field, error: json.error || "Erreur inconnue" };
                    }
    
                    updatedRun = normalizeRun(json.run);
                }
                

                return { ok: true, run: updatedRun };
            } catch (e) {
                console.error(e);
                return { ok: false, error: "Erreur réseau" };
            }
        };

        const deleteRunCtx: RunsContextType["deleteRunCtx"] = async (id) => {
            try {

                if (!isDemoMode) {
                    const res = await deleteRunAction(id);
                    const json = await res.json();
    
                    if (!res.ok) {
                        return { ok: false, error: json.error || "Impossible de supprimer la run." };
                    }
                }


                return { ok: true };
            } catch (e) {
                console.error(e);
                return { ok: false, error: "Erreur réseau" };
            }
        };


        
        // Values for Provider
        const RunsValues = {
            runs,
            setRuns,
            filteredRuns,
            periodFilter,
            setPeriodFilter,
            countFilter,
            setCountFilter,
            customPeriod,
            setCustomPeriod,
            customCount,
            setCustomCount,
            statsRuns,
            setStatsRuns,
            lastRun,
            setLastRun,
            addRunCtx,
            updateRunCtx,
            deleteRunCtx,
        }

        // Return <Context.Provider value>
        return(
            <RunsContext.Provider value={RunsValues}>
                {children}
            </RunsContext.Provider>
        )
    }


// 3. Use it
   export function useRuns() {
        const context = useContext(RunsContext);
        if (!context) {
            throw new Error("useRuns doit être utilisé dans un RunsProvider");
        }
        return context;
    }