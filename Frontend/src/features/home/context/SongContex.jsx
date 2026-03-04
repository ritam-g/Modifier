import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'
export const context = createContext()
function SongContex({ children }) {
    const [song, setsong] = useState(null)
    const [loading, setloading] = useState(false)
    return (
        <context.Provider value={{ song, setsong, loading, setloading }}>
            {children}
        </context.Provider>
    )
}

export default SongContex
