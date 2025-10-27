"use client";

import { useRuns } from "@/contexts/RunsContext";
import { useState } from "react";

export const RunsFilters = () => {
  const {
    periodFilter,
    setPeriodFilter,
    countFilter,
    setCountFilter,
    customPeriod,
    setCustomPeriod,
    customCount,
    setCustomCount,
  } = useRuns();

  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showCustomCount, setShowCustomCount] = useState(false);

  // --- Handlers ---
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPeriodFilter(value);
    setShowCustomDate(value === "custom");
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCountFilter(value);
    setShowCustomCount(value === "custom");
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">

        {/* --- Filtre période --- */}
        <div className="flex flex-col">
            <label className="block text-sm font-medium text-slate-200 mb-1">
            Période
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select
                    className="bg-gray-800 text-slate-200 p-2 rounded cursor-pointer"
                    value={periodFilter}
                    onChange={handlePeriodChange}
                >
                    <option value="all">Toutes</option>
                    <option value="7">7 derniers jours</option>
                    <option value="30">30 derniers jours</option>
                    <option value="90">90 derniers jours</option>
                    <option value="custom">Personnalisé</option>
                </select>

                {showCustomDate && (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="date"
                            className="bg-gray-700 text-slate-200 p-1 rounded"
                            value={customPeriod?.start.toISOString().split("T")[0] || ""}
                            onChange={(e) =>
                            setCustomPeriod((prev) => ({
                                start: new Date(e.target.value),
                                end: prev?.end || new Date(),
                            }))
                            }
                        />
                        <input
                            type="date"
                            className="bg-gray-700 text-slate-200 p-1 rounded"
                            value={customPeriod?.end.toISOString().split("T")[0] || ""}
                            onChange={(e) =>
                            setCustomPeriod((prev) => ({
                                start: prev?.start || new Date(),
                                end: new Date(e.target.value),
                            }))
                            }
                        />
                    </div>
                )}
            </div>
        </div>

        {/* --- Filtre nombre de runs --- */}
        <div className="flex flex-col">
            <label className="block text-sm font-medium text-slate-200 mb-1">
            Nombre de courses
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select
                    className="bg-gray-800 text-slate-200 p-2 rounded cursor-pointer"
                    value={countFilter}
                    onChange={handleCountChange}
                >
                    <option value="all">Toutes</option>
                    <option value="5">5 dernières</option>
                    <option value="10">10 dernières</option>
                    <option value="20">20 dernières</option>
                    <option value="custom">Personnalisé</option>
                </select>

                {showCustomCount && (
                    <input
                    type="number"
                    min={1}
                    className="bg-gray-700 text-slate-200 p-1 rounded w-20"
                    value={customCount || ""}
                    onChange={(e) => setCustomCount(Number(e.target.value))}
                    />
                )}
            </div>
        </div>


    </div>

  );
};
