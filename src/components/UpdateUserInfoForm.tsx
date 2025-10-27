"use client"
import { useState } from "react";
import { updateUserInfo } from "@/lib/actions";
import { useModal } from "@/contexts/ModalContext";
import { Profile } from "./Profile";
import { useUser } from "@/contexts/UserContext";

export const UpdateUserInfoForm = () => {
  const { user, setUser } = useUser();
  const [errors, setErrors] = useState<{ email?: string; pseudo?: string; form?: string }>({});
  const { openModal } = useModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const pseudo = (form.pseudo as HTMLInputElement).value;
    setErrors({});

    const res = await updateUserInfo({ email, pseudo });
    let data;
    try { data = await res.json(); } catch { data = {}; }

    if (res.ok) {
      setUser(data.user);
      openModal(<Profile message={data.message} />);
    } else {
      if (data.field && data.error) setErrors({ [data.field]: data.error });
      else setErrors({ form: "Erreur inconnue" });
    }
  };

  return (
    <div className="flex flex-col justify-center px-6 py-8">
      <h2 className="text-center text-2xl font-bold text-white mb-6">Modifier mes informations</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="pseudo" className="block text-sm text-gray-100">Pseudo <span className="text-red-500">*</span></label>
          <input
            id="pseudo"
            name="pseudo"
            type="text"
            defaultValue={user?.name}
            required
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
          {errors.pseudo && <p className="text-red-500 text-sm">{errors.pseudo}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-100">Email <span className="text-red-500">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email}
            required
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <button type="submit" className="w-full rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};
