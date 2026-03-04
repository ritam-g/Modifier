import React from 'react'
import './styles/app.scss'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './AppRoute'
import AuthContext from './features/auth/context/AuthContext'
import SongContex from './features/home/context/SongContex'

function App() {
  return (
    <main>
      <AuthContext>
        <SongContex>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            gutter={10}
            toastOptions={{
              duration: 3000,
              style: {
                border: '1px solid rgba(17, 68, 84, 0.18)',
                borderRadius: '14px',
                background: '#f6fffb',
                color: '#113540',
                boxShadow: '0 14px 28px rgba(9, 45, 55, 0.18)',
                fontFamily: '"Sora", "Segoe UI", sans-serif',
                fontSize: '0.92rem',
              },
              success: {
                iconTheme: {
                  primary: '#0e9d79',
                  secondary: '#f6fffb',
                },
              },
              error: {
                iconTheme: {
                  primary: '#d04747',
                  secondary: '#f6fffb',
                },
              },
            }}
          />
        </SongContex>
      </AuthContext>
    </main>
  )
}

export default App
