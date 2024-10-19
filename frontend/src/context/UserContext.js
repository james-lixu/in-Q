import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:4000/api/users/getUserInfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); 
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null); 
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); 

  const refetchUser = async () => {
    await fetchUserData();
  };

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
