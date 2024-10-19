"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Input from "@/components/Input";
import Link from "next/link";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from 'next/navigation';

function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function updateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function updatePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in");
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error logging in with Google:", error);
      alert("Error logging in with Google");
    }
  }

  return (
    <>
      <p className="font-semibold mb-2 text-lg tracking-widest uppercase text-blue-500">
        Sign In
      </p>
      <h1 className="text-5xl font-semibold tracking-wide">Welcome Back!</h1>
      <p className="text-zinc-400 dark:text-zinc-500 mt-2 mb-6 text-lg">
        Sign in to your account to continue forging your life.
      </p>
      <Input
        id="email"
        name="email"
        label="Email / Username"
        icon="tabler:user"
        type="email"
        placeholder="johndoe@gmail.com"
        value={username}
        onChange={updateUsername}
      />
      <Input
        id="password"
        name="password"
        label="Password"
        icon="uil:key-skeleton-alt"
        type="password"
        placeholder="●●●●●●●●●●"
        value={password}
        onChange={updatePassword}
      />
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" />
          <label
            htmlFor="remember"
            className="text-zinc-400 dark:text-zinc-500"
          >
            Remember me
          </label>
        </div>
        <a href="#" className="text-blue-500">
          Forgot Password?
        </a>
      </div>
      <button
        className="w-full bg-blue-500 font-semibold flex gap-2 transition-all hover:bg-blue-600 items-center justify-center shadow-md tracking-widest text-white py-4 rounded-md mt-8"
        onClick={handleLogin}
      >
        Sign In <Icon icon="uil:arrow-right" className="size-6" />
      </button>
      <div className="flex items-center justify-center mt-8 gap-4">
        <span className="block w-1/2 h-0.5 bg-zinc-300 dark:bg-zinc-600"></span>
        <span className="text-zinc-400 dark:text-zinc-500 font-medium whitespace-nowrap">
          Or sign in with
        </span>
        <span className="block w-1/2 h-0.5 bg-zinc-300 dark:bg-zinc-600"></span>
      </div>
      <div className="flex items-center justify-center flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
        <button
          className="bg-zinc-100 dark:bg-zinc-800 shadow-sm w-full py-4 rounded-md  dark:hover:bg-zinc-700 font-semibold tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <Icon icon="uil:google" className="size-6" />
          Google
        </button>
        <button className="bg-zinc-100 shadow-sm w-full py-4 rounded-md dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
          <Icon icon="uil:github" className="size-6" />
          Github
        </button>
      </div>
      <p className="text-zinc-400 dark:text-zinc-500 mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-blue-500 font-medium">
          Sign Up
        </Link>
      </p>
    </>
  );
}

export default Login;
