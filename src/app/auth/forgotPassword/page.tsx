"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
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
      router.push('/auth/login');
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        console.error("Error sending password reset email:", errorMessage);
        alert(`Error sending password reset email: ${errorMessage}`);
      } else {
        console.error("Unknown error sending password reset email");
        alert("An unknown error occurred while sending the password reset email");
      }
    }
  }

  return (
    <main className="flex items-center flex-col justify-center w-full">
      <div className="flex items-center justify-center gap-3">
        <Icon icon="mdi:anvil" className="size-12 text-blue-500" />
        <h1 className="text-3xl font-semibold -mt-3">
          Password Reset
          <span className="text-blue-500 text-5xl pl-1"></span>
        </h1>
      </div>
      
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
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded transform transition-transform duration-200 active:scale-95"
        onClick={handlePasswordReset}
      >
        Send Link
      </button>
    </main>
  );
}
