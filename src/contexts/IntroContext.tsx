"use client"


import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";


// 1. Create the context

    // Type
    interface IntroContextType {
        isIntroOpen: string;
        setIntroOpen: Dispatch<SetStateAction<string>>;
        isIntroAnimate: string;
        setIntroAnimate: Dispatch<SetStateAction<string>>;
    }

    const defaultValues:  IntroContextType = {
        isIntroOpen: "okOpen",
        setIntroOpen: () => {},
        isIntroAnimate: "okAnimate",
        setIntroAnimate: () => {},
    }

    // createContext
    export const IntroContext = createContext<IntroContextType>(defaultValues);


// 2. Provide it

    export default function IntroProvider ({children} : { children: React.ReactNode }) {

        // useState
        const [isIntroOpen, setIntroOpen] = useState("okOpen");
        const [isIntroAnimate, setIntroAnimate] = useState("okAnimate");
        
        // Values for Provider
        const introValues = {
            isIntroOpen,
            setIntroOpen,
            isIntroAnimate,
            setIntroAnimate,
        }

        // Return <Context.Provider value>
        return(
            <IntroContext.Provider value={introValues}>
                {children}
            </IntroContext.Provider>
        )
    }


// 3. Use it
    export const useIntro = () => useContext(IntroContext);

