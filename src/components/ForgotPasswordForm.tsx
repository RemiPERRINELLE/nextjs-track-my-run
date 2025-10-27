"use client"
import { useState } from "react"
import { useModal } from "@/contexts/ModalContext";
import { forgotPassword } from "@/lib/actions";


export const ForgotPasswordForm = () => {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const { closeModal } = useModal();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const enteredEmail = (form.email as HTMLInputElement).value;
    setError("");
    
    try {
      const res = await forgotPassword(enteredEmail);
      
      if (!res.ok) throw new Error("Erreur lors de l’envoi de l’e-mail");
      setEmail(enteredEmail);
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };



  return (
   <div className="flex min-h-full flex-col justify-center px-4">
      {!sent ? (
          <div>
              <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                <h2 className="text-2xl font-bold text-white">
                  Réinitialisation du mot de passe
                </h2>
              </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-100">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    Envoyer le lien
                  </button>
                </div>
              </form>

            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
              <p className="text-green-400 font-medium">
                Un lien de réinitialisation a été envoyé à <span className="font-semibold">{email}</span> (si cet utilisateur existe).
              </p>
              <button
                onClick={closeModal}
                className="mt-4 w-full rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Fermer
              </button>
            </div>
      )}
    </div>

  )
}
