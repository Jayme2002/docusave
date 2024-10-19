"use client";

import useAuth from "@/providers/useAuth";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <html lang="en" className="h-dvh w-full overflow-hidden">
        <body className="w-full h-dvh overflow-y-auto bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100">
          <main className="flex h-full items-center justify-center w-full">
            <span className="loader" />
          </main>
          <footer className="absolute bottom-4 left-4 text-zinc-300 dark:text-zinc-700 text-sm">
            <p>in-dev v.24w42</p>
          </footer>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="h-dvh w-full overflow-hidden">
      <body className="w-full h-dvh overflow-y-auto bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100">
        <main className="flex h-full w-full">{children}</main>
        <footer className="absolute bottom-4 left-4 text-zinc-300 dark:text-zinc-700 text-sm">
          <p>in-dev v.24w42</p>
        </footer>
      </body>
    </html>
  );
}
