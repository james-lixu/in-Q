import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "../images/Home-Icon.svg";
import SearchIcon from "../images/Search-Icon.svg";
import ExploreIcon from "../images/Explore-Icon.svg";
import MessagesIcon from "../images/Messages-Icon.svg";
import GamesIcon from "../images/Games-Icon.svg";

const inQLogo = require("../images/inQ-Logo.png");

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col flex-shrink p-8">
      {/* Logo */}
      <button onClick={() => navigate("/home")}>
        <img src={inQLogo} alt="in-Q Logo" className="w-24" />
      </button>

      {/* Home Button */}
      <button
        className={`flex ml-6 mt-8 p-2 gap-3 focus:font-bold ${
          isActive("/home") ? "text-slate-100 font-bold" : "text-slate-400"
        }`}
        onClick={() => navigate("/home")}
      >
        <img src={HomeIcon} alt="Home icon" className="w-7" />
        <span className="hidden lg:block">Home</span>
      </button>

      {/* Search Button */}
      <button
        className={`flex ml-6 mt-8 p-2 gap-3 focus:font-bold ${
          isActive("/search") ? "text-slate-100 font-bold" : "text-slate-400"
        }`}
        onClick={() => navigate("/search")}
      >
        <img src={SearchIcon} alt="Search icon" className="w-7 h-3/4 fill-white" />
        <span className="hidden lg:block">Search</span>
      </button>

      {/* Explore Button */}
      <button
        className={`flex ml-6 mt-8 p-2 gap-3 focus:font-bold ${
          isActive("/explore") ? "text-slate-100 font-bold" : "text-slate-400"
        }`}
        onClick={() => navigate("/explore")}
      >
        <img src={ExploreIcon} alt="Explore icon" className="w-7" />
        <span className="hidden lg:block">Explore</span>
      </button>

      {/* Messages Button */}
      <button
        className={`flex ml-6 mt-8 p-2 gap-3 focus:font-bold ${
          isActive("/messages") ? "text-slate-100 font-bold" : "text-slate-400"
        }`}
        onClick={() => navigate("/messages")}
      >
        <img src={MessagesIcon} alt="Messages icon" className="w-7" />
        <span className="hidden lg:block">Messages</span>
      </button>

      {/* Games Button */}
      <button
        className={`flex ml-6 mt-8 p-2 gap-3 focus:font-bold ${
          isActive("/games") ? "text-slate-100 font-bold" : "text-slate-400"
        }`}
        onClick={() => navigate("/games")}
      >
        <img src={GamesIcon} alt="Games icon" className="w-7" />
        <span className="hidden lg:block">Games</span>
      </button>
    </div>
  );
};

export default LeftSidebar;
