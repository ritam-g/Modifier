import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'
export const context = createContext()
function SongContex({ children }) {
    const [song, setsong] = useState(null)
    const [songs, setsongs] = useState([])
    const [loading, setloading] = useState(false)
    return (
        <context.Provider value={{ song, setsong, songs, setsongs, loading, setloading }}>
            {children}
        </context.Provider>
    )
}

export default SongContex
