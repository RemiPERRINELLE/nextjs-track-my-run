"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { useIsDesktop } from "@/hooks/useIsDesktop";


// 1. Create the context

    // Type
    type ModalContextType = {
        openModal: (content: ReactNode) => void;
        closeModal: () => void;
    };

    // createContext
    const ModalContext = createContext<ModalContextType | undefined>(undefined);


    // 2. Provide it
    export function ModalProvider({ children }: { children: ReactNode }) {
        // useState
        const [modalContent, setModalContent] = useState<ReactNode | null>(null);
        const router = useRouter();
        const isDesktop = useIsDesktop();

        const openModal = (content: ReactNode) => {
            setModalContent(content);
        };

        const closeModal = () => setModalContent(null);

        // Return <Context.Provider value>
        return (
            <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modalContent && (
                <Modal onClose={closeModal}>{modalContent}</Modal>
            )}
            </ModalContext.Provider>
        );
    }


    // 3. Use it
    export function useModal() {
        const context = useContext(ModalContext);
        if (!context) {
            throw new Error("useModal doit être utilisé dans un ModalProvider");
        }
        return context;
    }