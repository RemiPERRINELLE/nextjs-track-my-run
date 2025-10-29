"use client"
import { useState } from "react"
import { useModal } from "@/contexts/ModalContext";
import { useRuns } from "@/contexts/RunsContext";
import { CalendarIcon } from "lucide-react";
import { useRef } from "react";

interface RunData {
  id: number,
  name: string,
  distance: string,
  hours: number,
  minutes: number,
  seconds: number,
  date: string,
}

interface RunFormProps {
  run?: RunData;
  title?: string;
}


export const RunForm = ({ run, title }: RunFormProps) => {

  const { addRunCtx, updateRunCtx, runs, setRuns } = useRuns();

  const { closeModal } = useModal();
  const [errors, setErrors] = useState<{ nom?: string; distance?: string; duree?: string; date?: string, form? : string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.runName as HTMLInputElement).value;
    const distance = parseFloat((form.distance as HTMLInputElement).value);
    const totalSeconds =
      (parseInt((form.hours as HTMLInputElement).value || "0", 10) * 3600) +
      (parseInt((form.minutes as HTMLInputElement).value || "0", 10) * 60) +
      parseInt((form.seconds as HTMLInputElement).value || "0", 10);
    const dateInput = (form.date as HTMLInputElement).value;
    const date = new Date(dateInput).toISOString();
    setErrors({});
    
    if (distance < 0) {
      setErrors({ distance: "Distance invalide" });
      return;
    }
    
    if (totalSeconds <= 0) {
      setErrors({ duree: "Durée invalide" });
      return;
    }

    let result;
    if (run) {
      result = await updateRunCtx({ id: run.id, name, distance, totalSeconds, date });
    } else {
      result = await addRunCtx({ name, distance, totalSeconds, date });
    }


    if (result.ok) {
      if (run) {
        setRuns(prev =>
          prev
            .map(r => r.id === result.run.id ? result.run : r)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
      } else {
        setRuns(prev => [...prev, result.run].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      closeModal();
    } else {
      if (result.field && result.error) {
        setErrors({ [result.field]: result.error });
        (form[result.field] as HTMLInputElement).value = "";
      } else {
        setErrors({ form: "Erreur inconnue" });
      }
    }
  }

  const dateRef = useRef<HTMLInputElement>(null);

  const openCalendar = () => {
    if (dateRef.current) {
      dateRef.current.showPicker?.(); // méthode native Chrome/Edge
      dateRef.current.focus(); // fallback Firefox
    }
  };

  return (
  <div className="flex min-h-full flex-col justify-center px-4">
    <h2 className="text-center text-2xl font-bold tracking-tight text-white">
      {run ? "Modifier la run" : "Enregistrer sa run"}
    </h2>

    {errors.form && <p className="text-red-500 text-center mt-2">{errors.form}</p>}

    <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Nom */}
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-100">
            Nom
          </label>
          <div className="mt-2">
            <input
              id="nom"
              name="runName"
              type="text"
              className="block w-full rounded-md bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={run?.name}
            />
          </div>
          {errors.nom && <p className="text-red-500 mt-1 text-sm">{errors.nom}</p>}
        </div>

        {/* Distance */}
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-gray-100">
            Distance en km <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              id="distance"
              type="number"
              name="distance"
              min={0}
              step={0.1}
              placeholder="Distance (km)"
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={run?.distance}
            />
          </div>
          {errors.distance && <p className="text-red-500 mt-1 tewxt-sm">{errors.distance}</p>}
        </div>

        {/* Durée */}
        <div>
          <label htmlFor="duree" className="block text-sm font-medium text-gray-100">
            Durée <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2 mt-2">
            <input
              type="number"
              min={0}
              placeholder="hh"
              name="hours"
              className="w-16 px-2 py-1 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={run?.hours}
            />
            <input
              type="number"
              min={0}
              max={59}
              placeholder="mm"
              name="minutes"
              className="w-16 px-2 py-1 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={run?.minutes}
            />
            <input
              type="number"
              min={0}
              max={59}
              placeholder="ss"
              name="seconds"
              className="w-16 px-2 py-1 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={run?.seconds}
            />
          </div>
          {errors.duree && <p className="text-red-500 mt-1 text-sm">{errors.duree}</p>}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-100">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={dateRef}
              id="date"
              type="date"
              name="date"
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 cursor-pointer accent-blue-500 appearance-none"
              defaultValue={run?.date}
            />
            {/* Icône custom, cliquable */}
            <button
              type="button"
              onClick={openCalendar}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 focus:outline-none mt-1 cursor-pointer"
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
          </div>

          {errors.date && <p className="text-red-500 mt-1 text-sm">{errors.date}</p>}

          <style jsx>{`
            /* Cache toutes les icônes natives */
            input[type="date"]::-webkit-calendar-picker-indicator {
              display: none;
              -webkit-appearance: none;
            }
            input[type="date"]::-moz-calendar-picker-indicator {
              display: none;
            }
            input[type="date"] {
              position: relative;
              z-index: 0;
            }
          `}</style>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {run ? "Modifier la run" : "Enregistrer la run"}
          </button>
        </div>
      </form>
    </div>
  </div>



  )
}
