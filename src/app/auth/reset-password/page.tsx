"use client"
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/actions";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token"); // récupère le token dans l'URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatchMessage, setPasswordsMatchMessage] = useState<string | null>(null);
  const [passwordsDismatchMessage, setPasswordsDismatchMessage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Lien invalide ou expiré.");
    }
  }, [token]);

  function checkPasswordsMatch(pw: string, confirmPw: string) {
    if (pw && confirmPw) {
      if (pw !== confirmPw) {
        setPasswordsMatchMessage(null);
        setPasswordsDismatchMessage("Les mots de passe ne correspondent pas.");
      } else {
        setPasswordsDismatchMessage("");
        setPasswordsMatchMessage("Les mots de passe correspondent.");
      }
    }
  }

  const handlePasswordInput = (value: string, isPasswordField: boolean) => {
    if (isPasswordField) {
      setPassword(value);
      checkPasswordsMatch(value, confirmPassword);
    } else {
      setConfirmPassword(value);
      checkPasswordsMatch(password, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setPasswordsDismatchMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await resetPassword(token, password);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Erreur lors de la réinitialisation du mot de passe.");
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Suspense>
      <div className="flex min-h-screen md:items-center bg-gray-800 md:bg-neutral-950 justify-center md:px-6 md:py-12">
        <div className="w-full md:max-w-lg bg-gray-800 p-8 md:rounded-lg md:shadow-md h-full md:h-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Réinitialisation du mot de passe
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                  Nouveau mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  onChange={(e) => handlePasswordInput(e.target.value, true)}
                  className="mt-2 w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-100">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirm"
                  name="confirm"
                  required
                  onChange={(e) => handlePasswordInput(e.target.value, false)}
                  className="mt-2 w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {passwordsDismatchMessage && <p className="text-red-400 text-center">{passwordsDismatchMessage}</p>}
              {passwordsMatchMessage && <p className="text-green-400 text-center">{passwordsMatchMessage}</p>}

              <button
                type="submit"
                className="w-full rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer mt-2"
              >
                Réinitialiser le mot de passe
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-400 font-medium">
                Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.
              </p>
            <button
                  onClick={() => {
                      router.push("/?showLogin=1");
                  }}
                  className="mt-4 w-full rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                  Aller à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}