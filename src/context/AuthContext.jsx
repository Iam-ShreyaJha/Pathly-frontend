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
    // Backend response structure: data.user aur data.token
    const { user: serverUser, token } = data;
    
    // Explicitly define what to save to ensure 'role' is included
    const userToSave = {
      id: serverUser.id || serverUser._id,
      name: serverUser.name,
      email: serverUser.email,
      role: serverUser.role, // YE LINE ADMIN PANEL KE LIYE SABSE ZAROORI HAI
      college: serverUser.college || '',
      branch: serverUser.branch || '',
      graduationYear: serverUser.graduationYear || '2026',
      profilePic: serverUser.profilePic || ''
    };
    
    setUser(userToSave);
    localStorage.setItem('userInfo', JSON.stringify(userToSave));
    localStorage.setItem('token', token);
    
    // Set default headers for future requests
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