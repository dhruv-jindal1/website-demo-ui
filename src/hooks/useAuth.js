import { useEffect, useState } from 'react';
import { fakeUser } from '../utils/fakeData';

const STORAGE_KEY = 'chronotrack_auth_user';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const loggedInUser = {
      ...fakeUser,
      email,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setIsAuthenticated(true);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    const newUser = {
      ...fakeUser,
      name,
      email,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);

    return newUser;
  };

  const forgotPassword = async (email) => {
    if (!email) {
      throw new Error('Email is required');
    }

    return {
      success: true,
      message: 'If this email exists, a reset link has been sent.',
    };
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
  };
}