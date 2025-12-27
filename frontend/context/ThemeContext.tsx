"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
    darkMode: true,
    toggleTheme: () => { }
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(true)

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
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
