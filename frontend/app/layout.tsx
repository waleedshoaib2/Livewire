"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Component to handle redirection and conditional rendering
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/login')
    }
  }, [user, loading, isLoginPage, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>

  // If on login page, don't show sidebar
  if (isLoginPage) {
    return <main className="flex-1 overflow-y-auto">{children}</main>
  }

  // If logged in, show sidebar
  if (user) {
    return (
      <>
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </>
    )
  }

  return null
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen overflow-hidden bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-300`}
      >
        <AuthProvider>
          <ThemeProvider>
            <ProtectedLayout>
              {children}
            </ProtectedLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

