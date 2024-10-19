"use client";

import { auth } from "@/firebase/config";
import useAuth from "@/providers/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import { signOut } from "firebase/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      redirect("/auth/login");
    }
  }, [user, loading]);

  return (
    <main className="flex items-center flex-col justify-center w-full">
      <div className="flex items-center justify-center gap-3">
        <Icon icon="mdi:anvil" className="size-12 text-blue-500" />
        <h1 className="text-3xl font-semibold -mt-3">
          Lifeforge Dashboard
          <span className="text-blue-500 text-5xl pl-1">.</span>
        </h1>
      </div>
      <p className="text-zinc-400 dark:text-zinc-500 mt-2 mb-6 text-lg">
        An all-in-one platform for managing your life.
      </p>
      <button
        onClick={() => signOut(auth)}
        className="px-6 bg-red-500 font-semibold flex gap-2 transition-all hover:bg-red-600 items-center justify-center shadow-md tracking-widest text-white py-4 rounded-md mt-8"
      >
        Logout <Icon icon="tabler:logout" className="size-6" />
      </button>
    </main>
  );
}
