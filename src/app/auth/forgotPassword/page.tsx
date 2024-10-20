"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import Input from "@/components/Input";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  async function handlePasswordReset() {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Sent! Please make sure to check your "junk" folder.');
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        console.error("Error sending password reset email:", errorMessage);
        alert(`Error sending password reset email: ${errorMessage}`);
      } else {
        console.error("Unknown error sending password reset email");
        alert(
          "An unknown error occurred while sending the password reset email"
        );
      }
    }
  }

  return (
    <>
      <p className="font-semibold mb-2 text-lg tracking-widest uppercase text-blue-500 transform transition-transform duration-200 active:scale-95">
        Sign In
      </p>
      <h1 className="text-5xl font-semibold tracking-wide">Welcome Back!</h1>
      <p className="text-zinc-400 dark:text-zinc-500 mt-2 mb-6 text-lg">
        Sign in to your account to continue forging your life.
      </p>

      <Input
        id="email"
        name="email"
        label="Email"
        icon="tabler:user"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 font-semibold flex gap-2 transition-all duration-200 hover:bg-blue-600 items-center justify-center shadow-md tracking-widest text-white py-4 rounded-md mt-8 transform active:scale-95"
        onClick={handlePasswordReset}
      >
        Send Link <Icon icon="uil:arrow-right" className="size-6" />
      </button>
    </>
  );
}
