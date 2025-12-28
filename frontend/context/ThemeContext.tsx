"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
    darkMode: true,
    toggleTheme: () => { }
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(true)

    useEffect(() => {
        // Load from local storage on mount
        const saved = localStorage.getItem('livewire_theme')
        if (saved) {
            setDarkMode(saved === 'dark')
        }
    }, [])

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('livewire_theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('livewire_theme', 'light')
        }
    }, [darkMode])

    const toggleTheme = () => setDarkMode(!darkMode)

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
