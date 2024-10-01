import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import HomeIcon from "../images/Home-Icon.svg"
import SearchIcon from "../images/Search-Icon.svg"
import ExploreIcon from "../images/Explore-Icon.svg"
import MessagesIcon from "../images/Messages-Icon.svg"
import GamesIcon from "../images/Games-Icon.svg"

const inQLogo = require("../images/inQ-Logo.png");

const LeftSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-shrink border">
      <button onClick={() => navigate('/home')}>
        <img src={inQLogo} alt="in-Q Logo" className="w-24 ml-8 mt-8" />
      </button>
      <button className="flex ml-6 mt-8 p-2 gap-3 focus:font-bold "> <img src={HomeIcon} alt="Home icon" className="w-7"/> Home</button>
      <button className="flex ml-6 mt-8 p-2 gap-3 focus:font-bold"> <img src={SearchIcon} alt="Search icon" className="w-7 h-3/4 fill-white"/> Search</button>
      <button className="flex ml-6 mt-8 p-2 gap-3 focus:font-bold"> <img src={ExploreIcon} alt="Explore icon" className="w-7"/> Explore</button>
      <button className="flex ml-6 mt-8 p-2 gap-3 focus:font-bold"> <img src={MessagesIcon} alt="Messages icon" className="w-7"/>Messages</button>
      <button className="flex ml-6 mt-8 p-2 gap-3 focus:font-bold"> <img src={GamesIcon} alt="Games icon" className="w-7"/>Games</button>
    </div>
  );
};

export default LeftSidebar;
