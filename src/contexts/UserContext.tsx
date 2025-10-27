"use client";
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";

// 1. Create the context

    // Type
    interface UserContextType {
        user: User | null;
        setUser: Dispatch<SetStateAction<User | null>>;
    }

    // createContext
    const UserContext = createContext<UserContextType | undefined>(undefined);


// 2. Provide it
export function UserProvider({ children, initialUser }: { children: ReactNode; initialUser?: User | null }) {
    // useState
    const [user, setUser] = useState<User | null>(initialUser ?? null);

    // Mise à jour automatique du contexte si la session change côté client
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
        setUser(session.user);
        }
    }, [session]);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}


// 3. Use it
export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}
