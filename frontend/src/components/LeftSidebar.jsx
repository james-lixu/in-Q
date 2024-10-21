import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import HomeIcon from "../images/Home-Icon.svg";
import SearchIcon from "../images/Search-Icon.svg";
import ExploreIcon from "../images/Explore-Icon.svg";
import MessagesIcon from "../images/Messages-Icon.svg";
import GamesIcon from "../images/Games-Icon.svg";
import Spinner from "./Spinner"; 

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useUser(); 
  const defaultProfileIcon = require("../images/Default-Profile-Icon.png");

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col justify-between h-screen pt-8 pb-8 pl-12 pr-12">
      <div className="flex flex-col">
        {/* Display Name, Username, and Profile Picture */}
        <div className="flex flex-col mb-4 items-center">
          <div className="flex flex-col items-center">
            {loading ? (
              <div className="w-20 h-20 lg:w-28 lg:h-28 flex justify-center items-center">
                <Spinner /> 
              </div>
            ) : (
              <img
                src={
                  user && user.profilePicture
                    ? `http://localhost:4000${user.profilePicture}`
                    : defaultProfileIcon
                }
                alt="Profile icon"
                className="w-12 h-12 lg:w-28 lg:h-28 rounded-full cursor-pointer"
                onClick={() => navigate(`/${user.username}`)}
              />
            )}
            
            {user ? (
              <>
                <h2 className="text-text text-md lg:text-xl font-bold">{user.name}</h2>
                <span
                  className="text-slate-400 text-sm lg:text-md hover:cursor-pointer"
                  onClick={() => navigate(`/${user.username}`)}
                >
                  @{user.username}
                </span>
              </>
            ) : (
              <>
              </>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          className={`flex mt-4 p-2 gap-3 focus:font-bold transition-all duration-200 transform hover:text-text hover:scale-105 hover:bg-slate-800 rounded-lg ${
            isActive("/home")
              ? "text-text font-bold underline underline-offset-8"
              : "text-text"
          }`}
          onClick={() => navigate("/home")}
        >
          <img src={HomeIcon} alt="Home icon" className="w-7" />
          <span className="hidden lg:block">Home</span>
        </button>

                  <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold transition-all duration-200 transform hover:text-text hover:scale-105 hover:bg-slate-800 rounded-lg ${
            isActive("/games")
              ? "text-text font-bold underline underline-offset-8"
              : "text-text"
          }`}
          onClick={() => navigate("/games")}
        >
          <img src={GamesIcon} alt="Games icon" className="w-7" />
          <span className="hidden lg:block">Games</span>
        </button>

        {/* <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold transition-all duration-200 transform hover:text-text hover:scale-105 hover:bg-slate-800 rounded-lg ${
            isActive("/search")
              ? "text-text font-bold underline underline-offset-8"
              : "text-text"
          }`}
          onClick={() => navigate("/search")}
        >
          <img
            src={SearchIcon}
            alt="Search icon"
            className="w-7 h-3/4 fill-white"
          />
          <span className="hidden lg:block">Search</span>
        </button> */}

        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold transition-all duration-200 transform hover:text-text hover:scale-105 hover:bg-slate-800 rounded-lg ${
            isActive("/explore")
              ? "text-text font-bold underline underline-offset-8"
              : "text-text"
          }`}
          onClick={() => navigate("/explore")}
        >
          <img src={ExploreIcon} alt="Explore icon" className="w-7" />
          <span className="hidden lg:block">Explore</span>
        </button>

        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold transition-all duration-200 transform hover:text-text hover:scale-105 hover:bg-slate-800 rounded-lg ${
            isActive("/messages")
              ? "text-text font-bold underline underline-offset-8"
              : "text-text"
          }`}
          onClick={() => navigate("/messages")}
        >
          <img src={MessagesIcon} alt="Messages icon" className="w-7" />
          <span className="hidden lg:block">Messages</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
