import React from 'react'
import { useSong } from '../hooks/useSong'

function Checks() {
    const { getSongByMood, song, loading } = useSong()
    async function call() {
        const mood = 'happy'
        const song = await getSongByMood({ mood })
        console.log(song);

    }
    return (
        <main onClick={call}>
            onClick
        </main>
    )
}

export default Checks
