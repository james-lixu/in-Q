import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import Middlebar from '../components/Middlebar'
import RightSidebar from '../components/RightSidebar'

const Messages = () => {
  return (
    <div className="flex flex-row justify-between">
        <LeftSidebar/>
        <Middlebar/>
        <RightSidebar/>
    </div>
  )
}

export default Messages;