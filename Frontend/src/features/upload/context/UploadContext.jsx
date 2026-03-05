import React, { createContext, useMemo, useState } from 'react'

export const UploadContext = createContext()

function UploadProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)

    const value = useMemo(() => ({
        loading,
        setLoading,
        error,
        setError,
        result,
        setResult,
    }), [error, loading, result])

    return (
        <UploadContext.Provider value={value}>
            {children}
        </UploadContext.Provider>
    )
}

export default UploadProvider
