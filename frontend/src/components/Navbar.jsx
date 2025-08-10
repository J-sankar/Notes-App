import React from 'react'
import './Navbar.css'
import logo from '../assets/TestLogo.png'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate(); 
  return (
    <nav>
      <img src={logo} alt="Logo" onClick={()=>{navigate('/home')}} />
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className="nav-buttons">
        <button onClick={()=>navigate('/login')}>Login</button>
        <button>Create</button>
      </div>
    </nav>
  )
}

export default Navbar
