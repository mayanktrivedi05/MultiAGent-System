import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import Home from './pages/Home'
import { useEffect } from 'react'
import getCurrentUser from './features/getCurrentuser.js'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice.js'
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser()
      dispatch(setUserData(data))
    }
    getUser()
  }, [])
  return (

    <>
      <Home />
    </>
  )
}

export default App