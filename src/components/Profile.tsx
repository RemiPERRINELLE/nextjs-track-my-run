import { UserRound, KeyRound, PersonStanding, Trash2 } from "lucide-react"
import { useModal } from "@/contexts/ModalContext";
import { UpdateUserInfoForm } from "./UpdateUserInfoForm";
import { UpdateUserPasswordForm } from "./UpdateUserPasswordForm";
import { signOut } from "next-auth/react";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { deleteUser } from "@/lib/actions";

export const Profile = ( { message }: { message?: string } ) => {
  const { user } = useUser();
  const { openModal } = useModal();
  const [ messageDelete, setMessageDelete] = useState<{ success?: string; error?: string }>({});


   async function handleDeleteUser() {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer votre compte ?\nCette action est irréversible."
    );
    if (!confirmed) return;

    try {
      const res = await deleteUser();
      const data = await res.json();
      if (res.ok) {
        setMessageDelete({ success: data.success });
        setTimeout(() => signOut({ callbackUrl: "/" }), 1500);
      } else {
        setMessageDelete({ error: data.error ?? "Impossible de supprimer le compte." });
      }
    } catch (err) {
      console.error(err);
      setMessageDelete({ error: "Une erreur inattendue est survenue." });
    }
  }


  return (
    <div className="flex min-h-full flex-col justify-center items-center px-4">

      {messageDelete.success ? (
        <div className="text-green-400 px-4 py-2 rounded-md text-sm font-medium">
          {messageDelete.success}
        </div>
      
      ) : (
        <>
          {/* Success message */}
          {message && (
            <div className="text-green-400 px-4 py-2 rounded-md mb-4 text-sm font-medium">
              {message}
            </div>
          )}

          {/* Error message */}
          {messageDelete.error && (
            <div className="text-red-400 px-4 py-2 rounded-md mb-4 text-sm font-medium">
              {messageDelete.error}
            </div>
          )}

          {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center">
              <PersonStanding size={36} className="text-gray-900" />
            </div>

          {/* User info */}
          <h2 className="text-2xl font-semibold mt-2">{user?.name ?? "Utilisateur"}</h2>
          <p className="text-slate-400 text-lg mt-3">{user?.email ?? "Email non défini"}</p>

          {/* Buttons */}
          <button
            onClick={() => openModal(<UpdateUserInfoForm />)}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer mt-8"
          >
            <UserRound size={18} />
            Modifier mes infos
          </button>

          <button
            onClick={() => openModal(<UpdateUserPasswordForm />)}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer mt-4"
          >
            <KeyRound size={18} />
            Modifier mon mot de passe
          </button>

          <button
            onClick={() => handleDeleteUser()}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer mt-8"
          >
            <Trash2 size={18} />
            Supprimer mon compte
          </button>


          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-6 text-red-500 hover:text-red-400 text-sm font-semibold focus:outline-none cursor-pointer hover:underline"
          >
            Se déconnecter
          </button>
        </>
      )}

    </div>
  )
}
