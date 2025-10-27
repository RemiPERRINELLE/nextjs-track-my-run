"use client";

import { GraphRuns } from "./GraphRuns";
import { StatsGrid } from "./StatsGrid";
import { RunsList } from "./RunsList";
import { AddRunButton } from "./AddRunButton";
import { useRuns } from "@/contexts/RunsContext";
import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { useModal } from "@/contexts/ModalContext";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { RunsFilters } from "./RunsFilters";


export const DashboardBlocks = () => {
  const { filteredRuns } = useRuns();
  const searchParams = useSearchParams();
  const showLogin = searchParams?.get("showLogin");
  const { openModal } = useModal();
  const { user } = useUser();

    useEffect(() => {
      if (showLogin) {
        openModal(<LoginForm />);
      }
    }, [showLogin]);
 

  return (
    <div className="sm:p-10 space-y-10">

      {/* Titres */}
      <div>
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          { !user && <h2 className="text-3xl font-bold text-slate-100">Version Démo :</h2> }
          <h1 className="text-3xl font-bold text-slate-100">TrackMyRun</h1>
          <h2 className="text-3xl font-bold text-slate-100">
            <span> - </span><span className="text-cyan-400">Total : {filteredRuns.length} runs</span>
          </h2>
          <span className="pt-3 ml-4">
            <AddRunButton />
          </span>
        </div>
        {
          user?.name ?
            <p className="text-slate-400 mt-1">Bienvenue {user.name} 👋</p> :
            <p className="text-slate-400 mt-1">Bienvenue 👋 · Vous êtes en version Démo (sans compte).
              <span>
                <button
                  onClick={() => openModal(<LoginForm />)}
                  className="text-sky-400 cursor-pointer hover:underline ml-2">Se connecter
                </button>
              </span>
            </p>
        }
      </div>

      <RunsFilters />

      <GraphRuns />

      <StatsGrid />

      <RunsList />

    </div>
  );

  
}



