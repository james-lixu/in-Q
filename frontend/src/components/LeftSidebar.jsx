import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import HomeIcon from "../images/Home-Icon.svg";
import SearchIcon from "../images/Search-Icon.svg";
import FriendsIcon from "../images/Friends-Icon.svg";
import ExploreIcon from "../images/Explore-Icon.svg";
import MessagesIcon from "../images/Messages-Icon.svg";
import GamesIcon from "../images/Games-Icon.svg";
import LogoutIcon from "../images/Logout-Icon.svg";
import axios from 'axios';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const defaultProfileIcon = require("../images/Default-Profile-Icon.png");

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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col justify-between h-screen pt-8 pb-8 pl-16 pr-16">
      <div className="flex flex-col">
        {/* Display Name, Username, and Profile Picture */}
        <div className="flex flex-col mb-4 items-center">
          <div className="flex flex-col items-center">
            <img
              src={user && user.profilePicture ? `http://localhost:4000${user.profilePicture}` : defaultProfileIcon} 
              alt="Profile icon"
              className="w-20 h-20 lg:w-28 lg:h-28 rounded-full cursor-pointer"
              onClick={() => navigate(`/${user.username}`)}
            />
            {user ? (
              <>
                <h2 className="text-slate-100 text-xl font-bold">
                  {user.name}
                </h2>
                <span
                  className="text-slate-400 hover:cursor-pointer"
                  onClick={() => navigate(`/${user.username}`)}
                >
                  @{user.username}
                </span>
              </>
            ) : (
              <>
                <h2 className="text-slate-100 text-xl font-bold">Guest</h2>
                <span className="text-slate-400 hover:cursor-pointer">
                  @guest
                </span>
              </>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          className={`flex mt-4 p-2 gap-3 focus:font-bold ${
            isActive("/home")
              ? "text-slate-100 font-bold underline underline-offset-8"
              : "text-slate-400"
          }`}
          onClick={() => navigate("/home")}
        >
          <img src={HomeIcon} alt="Home icon" className="w-7" />
          <span className="hidden lg:block">Home</span>
        </button>

        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/search")
              ? "text-slate-100 font-bold underline underline-offset-8"
              : "text-slate-400"
          }`}
          onClick={() => navigate("/search")}
        >
          <img
            src={SearchIcon}
            alt="Search icon"
            className="w-7 h-3/4 fill-white"
          />
          <span className="hidden lg:block">Search</span>
        </button>

        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/explore")
              ? "text-slate-100 font-bold underline underline-offset-8"
              : "text-slate-400"
          }`}
          onClick={() => navigate("/explore")}
        >
          <img src={ExploreIcon} alt="Explore icon" className="w-7" />
          <span className="hidden lg:block">Explore</span>
        </button>

        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/messages")
              ? "text-slate-100 font-bold underline underline-offset-8"
              : "text-slate-400"
          }`}
          onClick={() => navigate("/messages")}
        >
          <img src={MessagesIcon} alt="Messages icon" className="w-7" />
          <span className="hidden lg:block">Messages</span>
        </button>

        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/games")
              ? "text-slate-100 font-bold underline underline-offset-8"
              : "text-slate-400"
          }`}
          onClick={() => navigate("/games")}
        >
          <img src={GamesIcon} alt="Games icon" className="w-7" />
          <span className="hidden lg:block">Games</span>
        </button>
      </div>

      {/* Logout */}
      <div className="flex flex-row space-x-12 self-end">
        <button
          onClick={handleLogout}
        >
          <img src={LogoutIcon} alt="Logout icon" className="w-6 lg:w-8" />
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
