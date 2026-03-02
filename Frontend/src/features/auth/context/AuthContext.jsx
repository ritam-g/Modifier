import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'
export const Context=createContext()
function AuthContext({children}) {
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
  return (
    <Context.Provider value={{user,setuser,loading,setloading}}>
      {children}
    </Context.Provider>
  )
}

export default AuthContext
