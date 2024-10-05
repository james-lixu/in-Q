import React from 'react';

const Middlebar = ({ children }) => {
  return (
    <div className="middlebar flex-grow p-4">  
      {children} 
    </div>
  );
};

export default Middlebar;
