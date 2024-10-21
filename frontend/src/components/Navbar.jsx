import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../images/Logout-Icon.svg";
import axios from "axios";

const inQLogo = require("../images/inQ-Logo.png");

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    axios
      .post(
        "http://localhost:4000/api/users/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((err) => {
        console.error("Error during logout", err);
      });
  };

  const handleSearchExpand = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-background px-4 z-50 flex justify-between items-center">
      {/* Logo and Search */}
      <button onClick={() => navigate("/home")} className="ml-4">
        <img src={inQLogo} alt="in-Q Logo" className="w-10 lg:w-12" />
      </button>
      <div>
        <form class="max-w-md mx-auto">
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              class="block w-full h-at p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-slate-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
          </div>
        </form>
      </div>
      {/* Logout Button */}
      <div className="mr-4 flex gap-4 items-center">
        <button onClick={handleLogout}>
          <img src={LogoutIcon} alt="Logout icon" className="w-6 lg:w-8" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
