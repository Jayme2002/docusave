"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "../globals.css";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import useAuth from "@/providers/useAuth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth/login");
    }
  }, [loading, user]);

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50">
      {/* Navbar */}
      <header className="h-16 bg-white border-b px-6 flex items-center fixed top-0 left-0 right-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Icon icon="mdi:document" className="shrink-0 size-6 text-blue-500" />
          <span className="font-semibold">DocuSave</span>
        </Link>
        
        {/* Centered Navigation */}
        <nav className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-zinc-50 text-zinc-600"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/pricing"
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard/pricing"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-zinc-50 text-zinc-600"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/dashboard/support"
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard/support"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-zinc-50 text-zinc-600"
            }`}
          >
            Support
          </Link>
        </nav>

        {/* Profile Menu */}
        <div className="ml-auto relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-2 hover:bg-zinc-50 rounded-full transition-colors relative"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
            )}
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
              <div className="px-4 py-2 border-b">
                <p className="font-medium truncate">{user?.displayName || user?.email}</p>
                <p className="text-sm text-zinc-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Icon icon="tabler:logout" className="size-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full min-h-screen pt-16">
        {children}
      </main>
    </div>
  );
}