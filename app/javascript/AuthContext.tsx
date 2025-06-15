import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
  otpEnabled: boolean;
  setOtpEnabled: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [otpEnabled, setOtpEnabled] = useState(false);

  useEffect(() => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('/check');
        setOtpEnabled(res.data.user.otp_enabled);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false)
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await axios.post('/login', { email_address: email, password });
      setIsAuthenticated(true);
    } catch {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.delete('/logout');
      setIsAuthenticated(false);
    } catch {
      throw new Error('Logout failed');
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await axios.post('/signup', { email_address: email, password });
      setIsAuthenticated(true);
    } catch {
      throw new Error('Sign up failed');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, signup, otpEnabled, setOtpEnabled }}>
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