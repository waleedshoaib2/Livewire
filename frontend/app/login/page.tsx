"use client"

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Zap } from 'lucide-react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const success = login(username, password)
        if (!success) {
            setError('Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-black dark:text-white">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-800">
                <div className="flex justify-center mb-6">
                    <span className="text-4xl">⚡</span>
                </div>
                <h1 className="text-2xl font-bold text-center mb-2">Livewire Login</h1>
                <p className="text-center text-gray-500 mb-6">Enter your credentials to access the console</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full p-2 border rounded bg-transparent dark:border-gray-700"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border rounded bg-transparent dark:border-gray-700"
                            placeholder="Enter password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded transition-colors">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}
