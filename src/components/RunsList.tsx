"use client";

import { formatDate, formatPace, formatDistanceKm, formatDuration } from "@/lib/run";
import { AddRunButton } from "./AddRunButton";
import { useRuns } from "@/contexts/RunsContext";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useModal } from "@/contexts/ModalContext";
import { RunForm } from "./RunForm";
import { Run, RunData } from "@/types/run";
import { motion } from "framer-motion";

export const RunsList = () => {
  const { filteredRuns, setRuns, deleteRunCtx } = useRuns();
  const [message, setMessage] = useState<{ error?: string; success?: string; }>({});
  const { openModal } = useModal();
  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selectedRuns, setSelectedRuns] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // On limite l'affichage aux 10 dernières par simplicité ici
  const pageSize = 10; // nombre de runs par page
  const pageCount = Math.ceil(filteredRuns.length / pageSize);

  const displayed = [...filteredRuns]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(page * pageSize, page * pageSize + pageSize);

  const displayedRuns = showAll ? filteredRuns : displayed;

  const nextPage = () => {
    if (page < pageCount - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const toggleSelectRun = (id: number) => {
    setSelectedRuns(prev =>
      prev.includes(id) ? prev.filter(runId => runId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRuns([]);
    } else {
      setSelectedRuns(filteredRuns.map(r => r.id));
    }
    setSelectAll(!selectAll);
  };

  

  async function handleDelete(id: number) {
      const confirmed = window.confirm("Voulez-vous vraiment supprimer cette run ?");
      if (!confirmed) return;
      
      try {
          const result  = await deleteRunCtx(id);
          if (result.ok) {
            setRuns(prev => prev.filter(r => r.id !== id));
            setMessage({ success: "La run a été supprimée." });
          } else {
            setMessage({ error: result.error });
          }
      } catch (err) {
          console.error(err);
          setMessage({ error: "Une erreur inattendue est survenue." });
      }
  }

  async function handleDeleteSelected() {
    if (selectedRuns.length === 0) return;
    const confirmed = window.confirm(`Supprimer ${selectedRuns.length} run(s) ?`);
    if (!confirmed) return;

    try {

      const res = await Promise.all(
        selectedRuns.map(runId => deleteRunCtx(runId))
      );

      const failed = res.filter(r => !r.ok);
      if (failed.length > 0) {
        console.error(failed);
        alert("Certaines runs n'ont pas pu être supprimées");
      }

      setRuns(prev => prev.filter(r => !selectedRuns.includes(r.id)));
      setSelectedRuns([]);
      setSelectAll(false);
      setMessage({ success: `${selectedRuns.length} Runs supprimées avec succès.` });
    } catch (err) {
      console.error(err);
      setMessage({ error: "Une erreur est survenue pendant la suppression." });
    }
  }


  function getRunData(run: Run): RunData {
    // Reformatage de la durée
    const hours = Math.floor(run.totalSeconds / 3600);
    const minutes = Math.floor((run.totalSeconds % 3600) / 60);
    const seconds = run.totalSeconds % 60;

    // Reformatage de la date
    const date = new Date(run.date).toISOString().slice(0, 10);

    const runData = {
        id: run.id,
        name: run.name ?? '',
        distance: Number(run.distance).toFixed(1),
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        date: date,
    }

    return runData;
  }

  useEffect(() => {
    if (selectedRuns.length === filteredRuns.length && filteredRuns.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRuns, filteredRuns]);

  useEffect(() => {
    if (message.success || message.error) {
      const timer = setTimeout(() => setMessage({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  if (!filteredRuns || filteredRuns.length === 0) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-6">
          <h3 className="font-semibold text-xl">Liste des runs</h3>
          <AddRunButton />
        </div>
        <p className="text-slate-400">Aucune run pour le moment.</p>
      </div>
    );
  }


  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between md:mb-4 mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <h3 className="font-semibold text-xl">Liste des runs</h3>
          <AddRunButton />
          {filteredRuns.length > 1 &&
            <button
              onClick={toggleSelectAll}
              className="text-sm text-slate-300 hover:text-slate-100 bg-gray-800 px-3 py-1 rounded cursor-pointer"
            >
              {selectAll ? "Tout désélectionner" : "Tout sélectionner"}
            </button>
          }
          {selectedRuns.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="text-sm text-red-400 hover:text-red-300 bg-gray-800 px-3 py-1 rounded cursor-pointer"
            >
              Supprimer la sélection ({selectedRuns.length})
            </button>
          )}
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          {pageCount > 1 &&
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              {showAll ? "Afficher par pages" : "Afficher toutes les runs"}
            </button>
          }
          <span className="text-xs text-slate-400">{filteredRuns.length} au total</span>
        </div>
              
      </div>

        {message.success && (
          <div className="mb-4 text-sm text-green-400 bg-green-900/30 p-2 rounded">
            {message.success}
          </div>
        )}

        {message.error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 p-2 rounded">
            {message.error}
          </div>
        )}

      <motion.ul
        key={"desktop-" + displayedRuns.map((r) => r.id).join("-")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="hidden md:block divide-y divide-gray-800 overflow-hidden"
      >
        {displayedRuns.map((run, i) => (
          <li
            key={run.id}
            className="py-5"
          >
            <div className="flex items-center gap-6">
              <input
                type="checkbox"
                checked={selectedRuns.includes(run.id)}
                onChange={() => toggleSelectRun(run.id)}
                className="accent-cyan-500 cursor-pointer"
              />
              <span className="font-medium">
                {formatDate(run.date)}
              </span>
              {run.name && (
                <span className="text-ms text-slate-400 truncate">{run.name}</span>
              )}
              <span className="inline-flex items-center">
                <span className="text-cyan-400">{formatDistanceKm(run.distance)}</span>
              </span>
              <span className="inline-flex items-center">
                <span className="text-slate-200">{formatDuration(run.totalSeconds, true)}</span>
              </span>
              <span className="inline-flex items-center">
                <span className="text-purple-400">{formatPace(run.totalSeconds, run.distance)}</span>
              </span>
              <button onClick={() => openModal(<RunForm run={getRunData(run)} title="Modifier la run" />)} className="group relative p-2 rounded-lg text-yellow-500 hover:bg-gray-800 cursor-pointer" aria-label="Modifier la run" title="Modifier la run">
                <Pencil size={18} />
                <span className="pointer-events-none absolute bottom-full left-full mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                  Modifier la run
                </span>
              </button>
              <button onClick={() => handleDelete(run.id)} className="group relative p-2 rounded-lg hover:bg-gray-800 text-red-400 cursor-pointer" aria-label="Supprimer la run" title="Supprimer la run">
                <Trash2 size={18} />
                <span className="pointer-events-none absolute bottom-full left-full mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                  Supprimer la run
                </span>
              </button>
            </div>
          </li>
        ))}
      </motion.ul>

      <motion.ul 
        key={"mobile-" + displayedRuns.map((r) => r.id).join("-")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="md:hidden divide-y divide-gray-800 overflow-hidden"
      >
        {displayedRuns.map((run, i) => (
          <li
              key={run.id}
              className="py-3 flex items-center gap-4"
            >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRuns.includes(run.id)}
                  onChange={() => toggleSelectRun(run.id)}
                  className="accent-cyan-500 cursor-pointer"
                />
                <span className="font-medium">
                  {formatDate(run.date)}
                </span>
                {run.name && (
                  <span className="text-xs text-slate-400 truncate">{run.name}</span>
                )}
              </div>
              <div className="mt-1 text-sm text-slate-300 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1">
                  <span className="text-cyan-400">{formatDistanceKm(run.distance)}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="text-slate-200">{formatDuration(run.totalSeconds, true)}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="text-purple-400">{formatPace(run.totalSeconds, run.distance)}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button onClick={() => openModal(<RunForm run={getRunData(run)} />)} className="group relative p-2 rounded-lg text-yellow-500 hover:bg-gray-800 cursor-pointer" aria-label="Modifier la run" title="Modifier la run">
                <Pencil size={18} />
                <span className="pointer-events-none absolute bottom-full left-full mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                  Modifier la run
                </span>
              </button>
              <button onClick={() => handleDelete(run.id)} className="group relative p-2 rounded-lg hover:bg-gray-800 text-red-400 cursor-pointer" aria-label="Supprimer la run" title="Supprimer la run">
                <Trash2 size={18} />
                <span className="pointer-events-none absolute bottom-full left-full mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow z-10 whitespace-nowrap">
                  Supprimer la run
                </span>
              </button>
            </div>
          </li>
        ))}
      </motion.ul>

      {/* Pagination */}
      {!showAll && pageCount > 1 && (
        <div className="mt-3 flex justify-center items-center gap-4">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className="px-2 py-1 rounded bg-gray-800 enabled:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            ←
          </button>
          <span className="text-sm text-slate-400">
            {page + 1} / {pageCount}
          </span>
          <button
            onClick={nextPage}
            disabled={page === pageCount - 1}
            className="px-2 py-1 rounded bg-gray-800 enabled:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            →
          </button>
        </div>
      )}


    </div>
  );
};
