import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  
  const fetchUserData = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:4000/api/users/getUserInfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refetchUser = async () => {
    await fetchUserData();
  };

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
