import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from "../images/Logout-Icon.svg";
import axios from 'axios'

const inQLogo = require("../images/inQ-Logo.png");

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('http://localhost:4000/api/users/logout', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      localStorage.removeItem('token');
      navigate("/");
    }).catch((err) => {
      console.error('Error during logout', err);
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-gray-950 px-4 z-50 flex justify-between items-center">
      {/* Logo */}
      <button onClick={() => navigate("/home")} className="ml-4">
        <img src={inQLogo} alt="in-Q Logo" className="w-10 lg:w-12" />
      </button>

      {/* Search Button or Section */}
      <div className="mr-4 flex gap-4">
        <button className="text-white text-sm lg:text-base transition duration-300 hover:text-red-500">
          Search
        </button>
        <button
          onClick={handleLogout}
        >
          <img src={LogoutIcon} alt="Logout icon" className="w-6 lg:w-8" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
