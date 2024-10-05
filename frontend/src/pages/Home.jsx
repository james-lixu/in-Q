import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import Middlebar from '../components/Middlebar'
import RightSidebar from '../components/RightSidebar'
import PostList from '../components/PostList'


const Home = () => {
  return (
    <div className="flex flex-row justify-between">
        <LeftSidebar/>
        <Middlebar><PostList></PostList></Middlebar>
        <RightSidebar/>
    </div>
  )
}

export default Home