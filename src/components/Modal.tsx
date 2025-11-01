"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}


export const Modal = ({ children, onClose }: ModalProps) => {
  // fermer la modale avec Échape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      <div
        className="bg-gray-800 p-6 py-12 md:rounded-2xl md:shadow-lg md:max-w-lg w-full relative h-full md:h-auto"
        onClick={(e) => e.stopPropagation()} // empêcher la fermeture en cliquant sur le contenu
      >
        {/* bouton close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 cursor-pointer text-2xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* contenu */}
        {children}
        
      </div>
    </div>
  );
}
