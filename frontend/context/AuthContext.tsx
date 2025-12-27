"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('livewire_user')
        if (storedUser) {
            setUser(storedUser)
        }
        setLoading(false)
    }, [])

    const login = (u: string, p: string) => {
        if (u === 'Nexoria' && p === 'livewirebynexoria') {
            setUser(u)
            localStorage.setItem('livewire_user', u)
            router.push('/')
            return true
        }
        return false
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('livewire_user')
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
