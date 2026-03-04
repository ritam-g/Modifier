import { useContext, useRef, useState } from "react";
import { getSong } from "../services/song.api";
import { context } from "../context/SongContex";

function getSongErrorMessage(err) {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return "Unable to fetch song for this mood.";
}

export function useSong() {
    const { song, setsong, loading, setloading } = useContext(context)
    const cacheRef = useRef({});
    const [error, setError] = useState(null);

    async function getSongByMood({ mood, forceRefresh = false }) {
        if (!mood) return null;

        if (!forceRefresh && cacheRef.current[mood]) {
            const cachedSong = cacheRef.current[mood];
            setsong(cachedSong);
            setError(null);
            return cachedSong;
        }

        try {
            setloading(true)
            setError(null);
            const data = await getSong({ mood })
            const fetchedSong = data?.song || null;

            if (fetchedSong) {
                cacheRef.current[mood] = fetchedSong;
            }

            setsong(fetchedSong)
            return fetchedSong
        } catch (err) {
            setError(getSongErrorMessage(err));
            throw err
        } finally {
            setloading(false)
        }
    }

    return { getSongByMood, song, loading, error }

}
