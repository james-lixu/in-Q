import React from 'react'
import { useNavigate } from 'react-router-dom'

const inQLogo = require("../images/inQ-Logo.png");

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <div className='flex justify-between border p-2'>
        <button
          onClick={() => navigate("/home")}
          className="self-start ml-16"
        >
          <img src={inQLogo} alt="in-Q Logo" className="w-12 lg:w-16" />
        </button>

        Search button
    </div>
  )
}

export default Navbar