"use client";

import Navbar from "@/components/Navbar";
import useAuth from "@/providers/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      redirect("/dashboard");
    }
  }, [loading, user]);

  return (
    <main className="flex items-center flex-col justify-center w-full">
      <Navbar />
      <h2 className="text-5xl md:text-6xl font-semibold px-16 md:px-32 text-center">
        Forge your life, one step at a time.
      </h2>
      <p className="text-zinc-400 dark:text-zinc-500 mt-10 mb-6 text-center px-16 text-xl">
        An all-in-one platform for managing your life.
      </p>
      <div className="flex items-center sm:flex-row flex-col-reverse gap-4 mt-12">
        <button
          className="px-8 py-4 sm:w-auto w-full font-semibold rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-100 transition-colors"
          onClick={() => router.push("auth/login")}
        >
          Learn More
        </button>
        <button
          className="px-8 py-4 sm:w-auto w-full font-semibold rounded-full bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 transition-colors"
          onClick={() => router.push("auth/login")}
        >
          Get Started
          <Icon icon="tabler:arrow-right" className="size-5" />
        </button>
      </div>
    </main>
  );
}
