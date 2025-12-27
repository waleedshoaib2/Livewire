"use client"

import PostTable from '../components/PostTable'
import { Activity, Bell, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <Bell className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
            U
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Monitors</p>
            <h3 className="text-2xl font-bold">Running</h3>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Leads Found</p>
            <h3 className="text-2xl font-bold">--</h3>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-lg">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Alerts Sent</p>
            <h3 className="text-2xl font-bold">--</h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold">Recent Leads</h3>
          </div>
          <PostTable />
        </div>
      </div>
    </div>
  )
}
