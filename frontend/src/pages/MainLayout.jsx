import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Navbar from "../components/Navbar"; 

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main content area - Adjust for navbar height */}
      <div className="flex flex-row flex-1 pt-12 min-h-0">
        {/* Left Sidebar */}
        <div className="w-64 h-full overflow-hidden">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col p-4 overflow-y-auto hide-scrollbar">
          {children}
        </div>

        {/* Right Sidebar */}
        <div className="w-64 hidden lg:flex h-full overflow-y-auto">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
