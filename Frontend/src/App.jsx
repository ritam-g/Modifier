import React from 'react'
import './styles/app.scss'
import FaceDetector from './components/FaceDetector'
import { RouterProvider } from 'react-router-dom'
import { router } from './AppRoute'
import AuthContext from './features/auth/context/AuthContext'

function App() {
  return (
    <main>
      {/* <FaceDetector/> */}
    <AuthContext>
      <RouterProvider router={router}/>
      </AuthContext>
    </main>
  )
}

export default App
