import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import Middlebar from '../components/Middlebar'
import RightSidebar from '../components/RightSidebar'
import PostList from '../components/PostList'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="flex flex-row justify-between h-screen">
        <Navbar/>
      <div className="sticky top-0 h-screen overflow-y-auto">
        <LeftSidebar />
      </div>
      <div className="flex-1 h-screen ml-2 overflow-y-scroll hide-scrollbar">
        <Middlebar>
          <PostList />
        </Middlebar>
      </div>
      <div className="h-screen">
        <RightSidebar />
      </div>
    </div>
  )
}

export default Home
