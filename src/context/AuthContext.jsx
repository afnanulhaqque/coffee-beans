import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.user && res.data.user.role === 'admin') {
            setAdminUser(res.data.user);
            localStorage.setItem('admin_user', JSON.stringify(res.data.user));
          } else {
            adminLogout();
          }
        } catch (err) {
          console.error('Failed to verify admin token', err);
          adminLogout();
        }
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    };

    verifyAdmin();
  }, [token]);

  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    if (newUser.role !== 'admin') {
      throw new Error('Access denied. Administrator privileges required.');
    }
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(newUser));
    setToken(newToken);
    setAdminUser(newUser);
    return newUser;
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdminUser(null);
  };

  const isAdmin = !!(adminUser && adminUser.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        user: adminUser,
        token,
        loading,
        adminLogin,
        login: adminLogin,
        adminLogout,
        logout: adminLogout,
        isAdmin,
        isAuthenticated: isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
