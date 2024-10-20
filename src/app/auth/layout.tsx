"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import cover from "@/assets/cover.jpg";
import React from "react";
import useAuth from "@/providers/useAuth";
import { redirect } from "next/navigation";
import Link from "next/link";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (user && !loading) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="w-full xl:w-1/2 flex flex-col">
        <header className="w-full p-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl flex items-center gap-2 font-semibold tracking-wider"
          >
            <Icon icon="mdi:anvil" className="size-8 text-blue-500" />
            <span className="-mt-2">
              LifeForge<span className="text-blue-500 text-3xl">.</span>
            </span>
          </Link>
        </header>
        <div className="flex-1 w-full flex justify-center flex-col px-12 pb-8 sm:px-20 md:px-32">
          {children}
        </div>
      </div>
      <div className="bg-blue-500 xl:block hidden dark:bg-blue-900 w-1/2 h-full">
        <Image
          src={cover}
          alt="cover"
          className="w-full h-full object-cover opacity-70 dark:opacity-50"
        />
      </div>
    </>
  );
}

export default AuthLayout;
