"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import Link from "next/link";
import { auth } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { redirect } from "next/navigation";
import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import useAuth from "@/providers/useAuth";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/login");
    }
  }, [loading, user]);

  function updateFirstName(e: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(e.target.value);
  }

  function updateLastName(e: React.ChangeEvent<HTMLInputElement>) {
    setLastName(e.target.value);
  }

  function updateEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function updatePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function updateConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(e.target.value);
  }

  async function handleSignup() {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        createdAt: new Date(),
      });

      redirect("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error signing up");
    }
  }

  async function handleGoogleSignup() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
        },
        { merge: true }
      );

      redirect("/dashboard");
    } catch (error) {
      console.error("Error signing up with Google:", error);
      alert("Error signing up with Google");
    }
  }

  return (
    <>
      <p className="font-semibold mb-2 text-lg tracking-widest uppercase text-blue-500 transform transition-all duration-200 active:scale-95">
        Sign Up
      </p>
      <h1 className="text-5xl font-semibold tracking-wide">Create Account</h1>
      <p className="text-zinc-400 dark:text-zinc-500 mt-2 mb-6 text-lg">
        Sign up to start forging your life.
      </p>
      <div className="flex items-center flex-col sm:flex-row sm:gap-4">
        <Input
          id="first_name"
          name="first_name"
          label="First Name"
          type="text"
          placeholder="John"
          icon="tabler:user"
          value={firstName}
          onChange={updateFirstName}
        />
        <Input
          id="last_name"
          name="last_name"
          label="Last Name"
          type="text"
          placeholder="Doe"
          icon="tabler:user"
          value={lastName}
          onChange={updateLastName}
        />
      </div>
      <Input
        id="email"
        name="email"
        label="Email Address"
        icon="tabler:mail"
        type="email"
        placeholder="johndoe@gmail.com"
        value={email}
        onChange={updateEmail}
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
      <Input
        id="confirm_password"
        name="confirm_password"
        label="Confirm Password"
        icon="uil:key-skeleton"
        type="password"
        placeholder="●●●●●●●●●●"
        value={confirmPassword}
        onChange={updateConfirmPassword}
      />

      <button
        className="w-full bg-blue-500 font-semibold flex gap-2 transition-all hover:bg-blue-600 items-center justify-center shadow-md tracking-widest text-white py-4 rounded-md mt-8"
        onClick={handleSignup}
      >
        Sign Up <Icon icon="uil:arrow-right" className="size-6" />
      </button>
      <div className="flex items-center justify-center mt-8 gap-4">
        <span className="block w-1/2 h-0.5 bg-zinc-300 dark:bg-zinc-600"></span>
        <span className="text-zinc-400 dark:text-zinc-500 font-medium whitespace-nowrap">
          Or sign up with
        </span>
        <span className="block w-1/2 h-0.5 bg-zinc-300 dark:bg-zinc-600"></span>
      </div>
      <div className="flex items-center justify-center flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
        <button
          className="bg-zinc-100 dark:bg-zinc-800 shadow-sm w-full py-4 rounded-md  dark:hover:bg-zinc-700 font-semibold tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          onClick={handleGoogleSignup}
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
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 font-medium">
          Sign In
        </Link>
      </p>
    </>
  );
}

export default Signup;
