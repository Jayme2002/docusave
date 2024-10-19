import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import cover from "./cover.jpg";
import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex dark">
      <div className="w-1/2 h-full flex flex-col bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100">
        <header className="w-full p-8 flex items-center justify-between">
          <h1 className="text-xl flex items-center gap-2 font-semibold tracking-wider">
            <Icon icon="mdi:anvil" className="size-8 text-blue-500" />
            <span className="-mt-2">
              LifeForge<span className="text-blue-500 text-3xl">.</span>
            </span>
          </h1>
        </header>
        <div className="flex-1 w-full flex justify-center flex-col px-32">
          {children}
        </div>
      </div>
      <div className="bg-blue-500 dark:bg-blue-900 w-1/2 h-full flex items-center justify-center">
        <Image
          src={cover}
          alt="cover"
          className="w-full h-full object-cover opacity-70 dark:opacity-50"
        />
      </div>
    </div>
  );
}

export default AuthLayout;
