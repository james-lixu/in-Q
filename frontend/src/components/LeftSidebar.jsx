import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "../images/Home-Icon.svg";
import SearchIcon from "../images/Search-Icon.svg";
import ExploreIcon from "../images/Explore-Icon.svg";
import MessagesIcon from "../images/Messages-Icon.svg";
import GamesIcon from "../images/Games-Icon.svg";

const inQLogo = require("../images/inQ-Logo.png");
const defaultProfileIcon = require("../images/Default-Profile-Icon.png")

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Example user data
  const user = {
    name: "James",
    username: "james_lixu",
  };

  return (
    <div className="flex flex-col justify-between h-screen p-8">
      <div className="flex flex-col">
        {/* Display Name and username */}
        <div className="flex flex-col mb-4 items-start ml-1">
          <div className="flex flex-col items-center">
            <img src={defaultProfileIcon} alt="Default profile icon" className="w-12 lg:w-20 rounded-full cursor-pointer" onClick={() => navigate("/profile")}/>
            <h2 className="text-slate-100 text-xl font-bold">{user.name}</h2>
            <span className="text-slate-400 hover:cursor-pointer" onClick={() => navigate("/profile")}>@{user.username} </span>
          </div>
        </div>

        {/* Home Button */}
        <button
          className={`flex mt-4 p-2 gap-3 focus:font-bold ${
            isActive("/home") ? "text-slate-100 font-bold underline underline-offset-8" : "text-slate-400"
          }`}
          onClick={() => navigate("/home")}
        >
          <img src={HomeIcon} alt="Home icon" className="w-7" />
          <span className="hidden lg:block">Home</span>
        </button>

        {/* Search Button */}
        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/search") ? "text-slate-100 font-bold  underline underline-offset-8" : "text-slate-400"
          }`}
          onClick={() => navigate("/search")}
        >
          <img src={SearchIcon} alt="Search icon" className="w-7 h-3/4 fill-white" />
          <span className="hidden lg:block ">Search</span>
        </button>

        {/* Explore Button */}
        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/explore") ? "text-slate-100 font-bold  underline underline-offset-8" : "text-slate-400"
          }`}
          onClick={() => navigate("/explore")}
        >
          <img src={ExploreIcon} alt="Explore icon" className="w-7" />
          <span className="hidden lg:block">Explore</span>
        </button>

        {/* Messages Button */}
        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/messages") ? "text-slate-100 font-bold  underline underline-offset-8" : "text-slate-400"
          }`}
          onClick={() => navigate("/messages")}
        >
          <img src={MessagesIcon} alt="Messages icon" className="w-7" />
          <span className="hidden lg:block">Messages</span>
        </button>

        {/* Games Button */}
        <button
          className={`flex mt-6 p-2 gap-3 focus:font-bold ${
            isActive("/games") ? "text-slate-100 font-bold  underline underline-offset-8" : "text-slate-400"
          }`}
          onClick={() => navigate("/games")}
        >
          <img src={GamesIcon} alt="Games icon" className="w-7" />
          <span className="hidden lg:block">Games</span>
        </button>
      </div>

      {/* Logo */}
      <button onClick={() => navigate("/home")} className="self-start ml-2 mt-6">
        <img src={inQLogo} alt="in-Q Logo" className="w-12 lg:w-16" />
      </button>
    </div>
  );
};

export default LeftSidebar;
