import React from 'react'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {
  return (
    <div className='flex'>
        <button
          onClick={() => navigate("/home")}
          className="self-start ml-2 mt-6"
        >
          <img src={inQLogo} alt="in-Q Logo" className="w-12 lg:w-16" />
        </button>
    </div>
  )
}

export default Navbar