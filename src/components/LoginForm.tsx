"use client"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useModal } from "@/contexts/ModalContext";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";


export const LoginForm = () => {
  const router = useRouter();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [error, setError] = useState("");
  const { closeModal, openModal } = useModal();



  useEffect(() => {
    const success = sessionStorage.getItem("signupSuccess");
    if (success) {
      setSignupSuccess(true);
      sessionStorage.removeItem("signupSuccess");
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    setError("");
    
    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

      if (res?.ok) {
        router.replace("/", { scroll: false });
        closeModal();
      } else {
        setError(res?.error ?? "Erreur inconnue");
      }
    };


  return (
   <div className="flex min-h-full flex-col justify-center px-4">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
    <h2 className="text-2xl font-bold text-white">
      Se connecter à votre compte
    </h2>
  </div>

  <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
    {signupSuccess && <p className="text-green-500 text-center mb-4">Inscription réussie ! Connectez-vous.</p>}

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

      {/* Password */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-100">
            Mot de passe <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
            onClick={() => openModal(<ForgotPasswordForm />)}
          >
            Mot de passe oublié ?
          </button>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          Se connecter
        </button>
      </div>
    </form>

    <p className="mt-6 text-center text-sm text-gray-400">
      Pas de compte ?{' '}
      <button
        className="font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
        onClick={() => openModal(<RegisterForm />)}
      >
        Créez-en un
      </button>
    </p>
  </div>
</div>

  )
}
