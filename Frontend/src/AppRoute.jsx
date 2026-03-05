import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Protected from './features/auth/components/Protected'
import UploadGuard from './features/auth/components/UploadGuard'
import Home from './features/home/pages/Home'
import Landing from './features/landing/pages/Landing'
import Upload from './features/upload/pages/Upload'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/app',
        element: <Protected><Home /></Protected>,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/upload',
        element: <UploadGuard><Upload /></UploadGuard>,
    },
])
