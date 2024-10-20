"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import useAuth from "@/providers/useAuth";

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { loading, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setDropdownOpen(false);
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/login");
    }
  }, [loading, user, router]);

  return (
    <main className="flex items-center flex-col justify-center w-full relative">
      <div className="absolute top-4 right-4">
        <button
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Icon icon="mdi:account" className="text-xl" />
          <span>Profile</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
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
      <p className="mt-20 text-3xl uppercase tracking-widest">Coming Soon!</p>
    </main>
  );
}
