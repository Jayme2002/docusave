"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import useAuth from "@/providers/useAuth";
import Image from "next/image";

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

  if (!user) {
    return null;
  }

  return (
    <main className="flex bg-zinc-100 items-center p-4 justify-center w-full relative">
      <div className="w-1/5 pr-4 flex h-full flex-col">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:anvil" className="size-8 text-blue-500" />
            <h1 className="text-xl font-semibold">
              Lifeforge
              <span className="text-blue-500 text-xl pl-0.5">.</span>
            </h1>
          </div>
          <button>
            <Icon
              icon="tabler:layout-sidebar-left-collapse"
              className="size-6 text-zinc-400"
            />
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 p-2 px-4 bg-zinc-50 rounded-md shadow-sm">
          <div className="flex items-center gap-3">
            <Image
              src={user.photoURL || ""}
              alt="avatar"
              width={128}
              height={128}
              className="w-9 h-9 rounded-md"
            />
            <div>
              <h1 className="text-lg font-semibold">{user.displayName}</h1>
              <p className="text-zinc-400 text-sm dark:text-zinc-500">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            <Icon
              icon="heroicons:chevron-up-down-20-solid"
              className="size-5 text-zinc-400"
            />
          </button>
        </div>
        <search className="mt-3 p-3 rounded-md bg-zinc-200/70 shadow-sm flex items-center gap-2">
          <Icon icon="tabler:search" className="size-6 text-zinc-400" />
          <input
            type="text"
            placeholder="Search modules..."
            className="w-full bg-transparent tracking-wide focus:outline-none"
          />
          <span className="flex items-center gap-1 text-zinc-400">
            <Icon icon="ic:baseline-keyboard-command-key" className="w-4 h-4" />
            <span>F</span>
          </span>
        </search>
        <div className="mt-6 flex flex-col gap-1">
          <div className="flex items-center bg-zinc-200/70 gap-3 shadow-sm tracking-wide p-3 text-zinc-700 font-medium hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:dashboard" className="size-6" />
            Dashboard
          </div>
          <h3 className="mt-4 mb-2 text-zinc-400/70 font-medium tracking-wide">
            Productivity
          </h3>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:clipboard" className="size-6" />
            Projects
          </div>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:calendar" className="size-6" />
            Calendar
          </div>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:pin" className="size-6" />
            Pinboard
          </div>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:list" className="size-6" />
            Tasks
          </div>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:clock" className="size-6" />
            Time Tracker
          </div>
          <h3 className="mt-4 mb-2 text-zinc-400/70 font-medium tracking-wide">
            Storage
          </h3>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:file" className="size-6" />
            Files
          </div>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:photo" className="size-6" />
            Photos
          </div>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:video" className="size-6" />
            Videos
          </div>
          <div className="flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md">
            <Icon icon="tabler:music" className="size-6" />
            Audio
          </div>
        </div>
      </div>
      <div className="w-full flex-1 shadow-lg h-full p-16 bg-zinc-50 rounded-xl"></div>
    </main>
  );
}
