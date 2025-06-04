import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className='h-14 bg-slate-900 text-white flex items-center justify-between px-8 '>
        <div className='h-full flex items-center cursor-pointer font-bold text-xl'>
            <Link to={"/Home"}>
            <div>
                LOGO
            </div>
            </Link>
        </div>

        <ul className='flex gap-10 items-center justify-center h-full font-bold'>
            <li>
                <NavLink style={({isActive})=>{return isActive?{color:"red"}:{}}} to={"/Home"} >Home</NavLink>
            </li>
            <li>
                <NavLink style={({isActive})=>{return isActive?{color:"red"}:{}}} to={"/Trip"}>Trip</NavLink>
            </li>
            <li>
                <NavLink style={({isActive})=>{return isActive?{color:"red"}:{}}} to={"/About"}>About</NavLink>
            </li>
        </ul>

    </nav>
  )
}

export default NavBar