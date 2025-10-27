"use client";

import { User, PersonStanding } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { LoginForm } from "./LoginForm";
import { Profile } from "./Profile";
import { useUser } from "@/contexts/UserContext";

export const UserButton = () => {
    const { user } = useUser();
    const { openModal } = useModal();

    return (
         <div className="fixed right-3 top-3">
            {user ? (
                <button
                    onClick={() => openModal(<Profile />)}
                    className="bg-sky-400 rounded-full p-1 inline-block cursor-pointer"
                >
                <PersonStanding color="#141212ff" size={24} />
                </button>
            ) : (
                <button
                    onClick={() => openModal(<LoginForm />)}
                    className="bg-sky-400 rounded-full p-1 inline-block cursor-pointer"
                    >
                    <User color="#000000" size={24} />
                </button>
            )}
        </div>
    );
}