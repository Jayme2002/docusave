"use client";

import useAuth from "@/providers/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../globals.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading, user } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <html lang="en" className="h-full w-full">
        <body className="w-full h-screen bg-zinc-100 text-zinc-700 dark:text-zinc-100">
          <main className="flex h-full items-center justify-center w-full">
            <span className="loader" />
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="h-full w-full">
      <body className="w-full h-screen bg-zinc-100 text-zinc-700 dark:text-zinc-100">
        <main className="flex h-full w-full">
          <div className="w-64 h-full flex flex-col border-r border-zinc-200 flex-shrink-0">
            <div className="p-4 flex-1 flex flex-col">
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
                    src={user?.photoURL || ""}
                    alt="avatar"
                    width={128}
                    height={128}
                    className="w-9 h-9 rounded-md"
                  />
                  <div>
                    <h1 className="text-lg font-semibold">{user?.displayName}</h1>
                    <p className="text-zinc-400 text-sm dark:text-zinc-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2">
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
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 shadow-sm tracking-wide p-3 text-zinc-700 font-medium hover:bg-zinc-200/50 transition-all rounded-md ${
                    pathname === "/dashboard" ? "bg-zinc-200/70" : ""
                  }`}
                >
                  <Icon icon="tabler:dashboard" className="size-6" />
                  Dashboard
                </Link>
                <h3 className="mt-4 mb-2 text-zinc-400/70 font-medium tracking-wide">
                  Productivity
                </h3>
                <Link
                  href="/dashboard/productivity/projects"
                  className={`flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md ${
                    pathname === "/dashboard/productivity/projects" ? "bg-zinc-200/70" : ""
                  }`}
                >
                  <Icon icon="tabler:clipboard" className="size-6" />
                  Projects
                </Link>
                <Link
                  href="/dashboard/productivity/calendar"
                  className={`flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md ${
                    pathname === "/dashboard/productivity/calendar" ? "bg-zinc-200/70" : ""
                  }`}
                >
                  <Icon icon="tabler:calendar" className="size-6" />
                  Calendar
                </Link>
                <Link
                  href="/dashboard/productivity/pinboard"
                  className={`flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md ${
                    pathname === "/dashboard/productivity/pinboard" ? "bg-zinc-200/70" : ""
                  }`}
                >
                  <Icon icon="tabler:pin" className="size-6" />
                  Pinboard
                </Link>
                <Link
                  href="/dashboard/productivity/tasks"
                  className={`flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md ${
                    pathname === "/dashboard/productivity/tasks" ? "bg-zinc-200/70" : ""
                  }`}
                >
                  <Icon icon="tabler:list" className="size-6" />
                  Tasks
                </Link>
                <Link
                  href="/dashboard/productivity/time-tracker"
                  className={`flex items-center gap-3 tracking-wide p-3 text-zinc-500 hover:bg-zinc-200/50 transition-all rounded-md ${
                    pathname === "/dashboard/productivity/time-tracker" ? "bg-zinc-200/70" : ""
                  }`}
                >
                  <Icon icon="tabler:clock" className="size-6" />
                  Time Tracker
                </Link>
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
            <footer className="p-4 text-zinc-400 text-sm">
              <p>in-dev v.24w43</p>
            </footer>
          </div>
          <div className="flex-1 h-full overflow-hidden p-2 pt-2 pb-1 pl-0">
            <div className="h-full w-full overflow-y-auto bg-white rounded-tr-lg rounded-br-lg shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}