import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
      <NavBar/>
      <div className='bg-orange-100 min-h-[91.5vh]'>
        <Outlet />
      </div>

      </>
  )
}

export default App
