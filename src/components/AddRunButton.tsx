"use client";

import { PlusCircle } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { RunForm } from "./RunForm";
import { useRuns } from "@/contexts/RunsContext";

export const AddRunButton = () => {
  const { runs } = useRuns();
  const { openModal } = useModal();

  return (
    <button
      onClick={() => openModal(<RunForm title="Ajouter une run" />)}
      className="group relative inline-flex items-center cursor-pointer"
      aria-label="Ajouter une run"
      title="Ajouter une run"
    >
      <PlusCircle
        size={22}
        className="text-green-400 group-hover:text-green-300 transition-colors"
      />
      <span className="pointer-events-none absolute bottom-full left-full mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow z-10 whitespace-nowrap">
        Ajouter une run
      </span>
    </button>
  );
};
