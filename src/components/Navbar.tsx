"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav className="absolute z-20 top-0 right-0 items-center justify-between w-full p-6 flex">
        <Link href="/" className="flex items-center justify-center gap-3">
          <Icon icon="mdi:anvil" className="size-10 text-blue-500" />
          <h1 className="text-2xl font-semibold -mt-1">
            Lifeforge
            <span className="text-blue-500 text-3xl pl-0.5">.</span>
          </h1>
        </Link>
        <div className="static xl:absolute font-medium left-1/2 top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 hidden lg:flex items-center gap-12">
          <button className="flex items-center gap-2" >
            Features
            <Icon icon="tabler:chevron-down" className="size-4" />
          </button>
          
          <button className="flex items-center gap-2">
            Solutions
            <Icon icon="tabler:chevron-down" className="size-4" />
          </button>
          <button 
            onClick={() => router.push("pricing")}
          >
            Pricing
          </button>
          <button 
            onClick={() => router.push("blog")}
          >
            Blog
          </button>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="px-8 py-4 font-semibold rounded-full hover:bg-zinc-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-4 font-semibold rounded-full bg-blue-500 text-white flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            Get Started
            <Icon icon="tabler:arrow-right" className="size-5" />
          </Link>
        </div>
        <button 
          onClick={() => setNavOpen(!navOpen)} 
          className="md:hidden"
        >
          <Icon icon="tabler:menu" className="size-6" />
        </button>
      </nav>
      <div
        className={`fixed top-0 text-xl left-0 duration-500 flex transition-all items-center justify-center gap-12 flex-col w-full h-full bg-white dark:bg-zinc-900 z-10 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button 
          onClick={() => { router.push("/features"); setNavOpen(false); }}
        >
          Features
        </button>
        <button 
          onClick={() => { router.push("/solutions"); setNavOpen(false); }}
        >
          Solutions
        </button>
        <button 
          onClick={() => { router.push("/pricing"); setNavOpen(false); }}
        >
          Pricing
        </button>
        <button 
          onClick={() => { router.push("/blog"); setNavOpen(false); }}
        >
          Blog
        </button>
      </div>
    </>
  );
}

export default Navbar;
