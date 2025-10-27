"use client"
import { useState } from "react";
import { updateUserPassword } from "@/lib/actions";
import { useModal } from "@/contexts/ModalContext";
import { Profile } from "./Profile";

export const UpdateUserPasswordForm = () => {
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; passwordsMatch?: string; form?: string }>({});
  const { openModal } = useModal();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatchMessage, setPasswordsMatchMessage] = useState<string | null>(null);


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

  function handlePasswordInput(value: string, isNewPasswordField: boolean) {
    if( isNewPasswordField ) {
      setNewPassword(value);
      checkPasswordsMatch(value, confirmPassword);
    } else {
      setConfirmPassword(value);
      checkPasswordsMatch(newPassword, value);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentPassword = (form.currentPassword as HTMLInputElement).value;
    const newPassword = (form.newPassword as HTMLInputElement).value;

    setErrors({});

    if(newPassword !== confirmPassword) {
      setErrors({ passwordsMatch: "Les mots de passe ne correspondent pas" });
      return;
    }

    const res = await updateUserPassword({ currentPassword, newPassword });
    let data;
    try { data = await res.json(); } catch { data = {}; }

    if (res.ok) {
      openModal(<Profile message={data.message} />);
    } else {
      if (data.field && data.error) setErrors({ [data.field]: data.error });
      else setErrors({ form: "Erreur inconnue" });
    }
  };

  return (
    <div className="flex flex-col justify-center px-6 py-8">
      <h2 className="text-center text-2xl font-bold text-white mb-6">Modifier mon mot de passe</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="currentPassword" className="block text-sm text-gray-100">Mot de passe actuel <span className="text-red-500">*</span></label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
          {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword}</p>}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm text-gray-100">Nouveau mot de passe <span className="text-red-500">*</span></label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordInput(e.target.value, true)}
            id="newPassword"
            name="newPassword"
            type="password"
            required
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm text-gray-100">Confirmation du mot de passe <span className="text-red-500">*</span></label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordInput(e.target.value, false)}
            id="confirm"
            name="confirm"
            type="password"
            required
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
          {errors.passwordsMatch && <p style={{ color: "red" }}>{errors.passwordsMatch}</p>}
          {passwordsMatchMessage && <p style={{ color: "green" }}>{passwordsMatchMessage}</p>}
        </div>
        <button type="submit" className="w-full rounded-md bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer">
          Mettre à jour le mot de passe
        </button>
      </form>
    </div>
  );
};
