"use client"
import { useState } from "react"
import { registerUser } from "@/lib/actions";
import { useModal } from "@/contexts/ModalContext";
import { LoginForm } from "./LoginForm";


export const RegisterForm = () => {
  const [errors, setErrors] = useState<{ email?: string; pseudo?: string; password?: string; passwordsMatch?: string; form? : string }>({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatchMessage, setPasswordsMatchMessage] = useState<string | null>(null);
  const { openModal } = useModal();


  function checkPasswordsMatch(password: string, confirmPassword: string) {
    if( password && confirmPassword ) {
      if (password !== confirmPassword) {
        setPasswordsMatchMessage(null);
        setErrors({passwordsMatch: "Les mots de passe ne correspondent pas"});
      } else {
        setErrors({});
        setPasswordsMatchMessage("Les mots de passe correspondent");
      }
    }
  }

  function handlePasswordInput(value: string, isPasswordField: boolean) {
    if( isPasswordField ) {
      setPassword(value);
      checkPasswordsMatch(value, confirmPassword);
    } else {
      setConfirmPassword(value);
      checkPasswordsMatch(password, value);
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const pseudo = (form.pseudo as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form.confirm as HTMLInputElement).value;
    setErrors({});

    if(password !== confirmPassword) {
      setErrors({ passwordsMatch: "Les mots de passe ne correspondent pas" });
      return;
    }

    const res = await registerUser({ email, pseudo, password });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      console.log(data.message);
      sessionStorage.setItem("signupSuccess", "1");
      openModal(<LoginForm />)
    } else {
      if (data.field && data.error) {
        setErrors({ [data.field]: data.error });
        (form[data.field] as HTMLInputElement).value = "";
      } else {
        setErrors({ form: "Erreur inconnue" });
      }
    }
  }

  return (

    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Créez votre compte</h2>
        </div>

        {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-100">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="pseudo" className="block text-sm font-medium text-gray-100">
                Pseudo <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="pseudo"
                  name="pseudo"
                  type="text"
                  required
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>
              {errors.pseudo && <p style={{ color: "red" }}>{errors.pseudo}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
 
              </div>
              <div className="mt-2">
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordInput(e.target.value, true)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>
              {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-100">
                  Confirmation du mot de passe <span className="text-red-500">*</span>
                </label>

              </div>
              <div className="mt-2">
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordInput(e.target.value, false)}
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>
              {errors.passwordsMatch && <p style={{ color: "red" }}>{errors.passwordsMatch}</p>}
              {passwordsMatchMessage && <p style={{ color: "green" }}>{passwordsMatchMessage}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                S'enregistrer
              </button>
            </div>
          </form>


        </div>
      </div>
    </>

  )
}
