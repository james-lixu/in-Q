import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "../images/Logout-Icon.svg";
import axios from "axios";
import Spinner from "../components/Spinner"; 

const inQLogo = require("../images/inQ-Logo.png");

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const dropdownRef = useRef(null); 
  const inputRef = useRef(null); 
  const [showDropdown, setShowDropdown] = useState(false); 

  // Function to perform the search
  const performSearch = async (query) => {
    if (query.trim()) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:4000/api/users/search?q=${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(response.data);
        setLoading(false);
        setShowDropdown(true); 
      } catch (error) {
        console.error("Error fetching search results", error);
        setLoading(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false); 
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    setDebounceTimeout(
      setTimeout(() => {
        performSearch(query);
      }, 300)
    );
  };

  // Handle user logout
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

  // Close the dropdown when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, inputRef]);

  const handleFocus = () => {
    if (searchResults.length > 0 || loading) {
      setShowDropdown(true); 
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-background px-4 z-50 flex justify-between items-center">
      {/* Logo and Search */}
      <div className="inline-flex gap-8">
        <button onClick={() => navigate("/home")} className="ml-4">
          <img src={inQLogo} alt="in-Q Logo" className="w-10 lg:w-12" />
        </button>

        <form className="max-w-md mx-auto">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            {/* Search input */}
            <input
              type="search"
              id="default-search"
              ref={inputRef}
              className="block w-full h-10 p-1 pl-4 pr-10 text-sm text-text border border-slate-700 rounded-full bg-black focus:ring-text focus:border-text"
              placeholder="Search"
              onChange={handleSearch}
              onFocus={handleFocus} 
              value={searchQuery}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-text"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
        </form>
      </div>

      {/* Display search results or loading spinner */}
      {showDropdown && (loading || searchResults.length > 0) && (
        <div
          ref={dropdownRef} 
          className="absolute top-11 left-28 w-1/4 bg-gray-950 shadow-lg max-h-60 overflow-auto rounded-xl"
        >
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <Spinner /> 
            </div>
          ) : (
            <ul>
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="p-2 flex items-center cursor-pointer hover:bg-gray-800"
                  onClick={() => navigate(`/${user.username}`)}
                >
                  <img
                    src={
                      user.profilePicture
                        ? `http://localhost:4000${user.profilePicture}`
                        : "/default-profile.png"
                    }
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-bold text-text">{user.name}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
