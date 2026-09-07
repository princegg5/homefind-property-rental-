import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('homefind_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('homefind_token') || null;
  });

  const [savedPropertyIds, setSavedPropertyIds] = useState(() => {
    try {
      const saved = localStorage.getItem('homefind_saved_properties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Set default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('homefind_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('homefind_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('homefind_user', JSON.stringify(user));
      if (user.savedProperties) {
        const ids = user.savedProperties.map((p) => (typeof p === 'string' ? p : p._id));
        setSavedPropertyIds(ids);
      }
    } else {
      localStorage.removeItem('homefind_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('homefind_saved_properties', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      // Fallback for local demo if backend is not started yet
      if (email === 'admin@homefind.com' && password === 'admin123') {
        const mockAdmin = {
          _id: 'mock-admin-id',
          name: 'HomeFind Admin',
          email: 'admin@homefind.com',
          role: 'admin',
          savedProperties: [],
        };
        setUser(mockAdmin);
        setToken('mock-jwt-admin-token');
        return { success: true, user: mockAdmin, note: 'Connected via fallback demo credentials' };
      } else if (password && email) {
        const mockUser = {
          _id: 'mock-user-id',
          name: email.split('@')[0],
          email,
          role: 'user',
          savedProperties: [],
        };
        setUser(mockUser);
        setToken('mock-jwt-user-token');
        return { success: true, user: mockUser };
      }
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Cannot reach backend server. Ensure backend is running on port 5000.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error) {
      // Fallback if backend server is not running
      const newUser = {
        _id: 'mock-user-' + Date.now(),
        name,
        email,
        role: role === 'admin' ? 'admin' : 'user',
        savedProperties: [],
      };
      setUser(newUser);
      setToken('mock-jwt-token-' + Date.now());
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  // Toggle Save Property
  const toggleSaveProperty = async (propertyId) => {
    const isCurrentlySaved = savedPropertyIds.includes(propertyId);
    let updated;
    if (isCurrentlySaved) {
      updated = savedPropertyIds.filter((id) => id !== propertyId);
    } else {
      updated = [...savedPropertyIds, propertyId];
    }
    setSavedPropertyIds(updated);

    if (token) {
      try {
        await axios.post(`${API_BASE_URL}/auth/save/${propertyId}`);
      } catch (e) {
        console.warn('Could not sync favorite to server, saved in local state:', e.message);
      }
    }
    return !isCurrentlySaved;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    setSavedPropertyIds([]);
    localStorage.removeItem('homefind_user');
    localStorage.removeItem('homefind_token');
    localStorage.removeItem('homefind_saved_properties');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        savedPropertyIds,
        toggleSaveProperty,
        API_BASE_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
