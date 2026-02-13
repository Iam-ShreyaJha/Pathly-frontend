import { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    console.log("RAW DATA FROM SERVER:", data); // Check if role is here!
    
    const { user: serverUser, token } = data;

    if (!serverUser) {
      console.error("No user data received from server!");
      return;
    }
    
    // Explicitly define what to save with safety fallbacks
    const userToSave = {
      id: serverUser.id || serverUser._id,
      name: serverUser.name,
      email: serverUser.email,
      // Forcefully check if role exists, otherwise check if email is yours
      role: serverUser.role || (serverUser.email === 'jhashreya0205@gmail.com' ? 'admin' : 'student'), 
      college: serverUser.college || '',
      branch: serverUser.branch || '',
      graduationYear: serverUser.graduationYear || '2026',
      profilePic: serverUser.profilePic || ''
    };
    
    console.log("SAVING TO STORAGE:", userToSave); // Should show role: 'admin'

    setUser(userToSave);
    localStorage.setItem('userInfo', JSON.stringify(userToSave));
    localStorage.setItem('token', token);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.clear(); 
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};