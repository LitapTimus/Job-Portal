import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          fetchUser();
        } else {
          localStorage.removeItem('token');
          setLoading(false);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/users/me');
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  // OAuth login - for when user comes back from OAuth flow
  const oauthLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const signup = async (userData) => {
    const { data } = await api.post('/auth/signup', userData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, oauthLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
