"use client"

import {
    Home,
    Settings,
    BarChart3,
    MessageSquare,
    Layers,
    LogOut,
    Sun,
    Moon
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext' // Corrected path

export default function Sidebar() {
    const { logout, user } = useAuth()
    const { darkMode, toggleTheme } = useTheme()

    return (
        <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-yellow-500">⚡</span> Livewire
                </h1>
                <p className="text-xs text-gray-500 mt-1">Hello, {user || 'User'}</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white text-gray-500 transition-colors">
                    <Home className="w-5 h-5" />
                    Dashboard
                </Link>
                <Link href="/subreddits" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white text-gray-500 transition-colors">
                    <Layers className="w-5 h-5" />
                    Subreddits
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors text-left">
                    <BarChart3 className="w-5 h-5" />
                    Analytics
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
