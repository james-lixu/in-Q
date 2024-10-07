import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-row justify-between h-screen">
      {/* Left Sidebar */}
      <div className="sticky top-0 h-screen overflow-y-auto">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen ml-2 overflow-y-scroll hide-scrollbar">{children}</div>

      {/* Right Sidebar */}
      <div className="h-screen">
        <RightSidebar />
      </div>
    </div>
  );
};

export default MainLayout;
