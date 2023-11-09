'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext(null);

const useAuth = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(isLoggedIn);

    const unblockTime = parseInt(localStorage.getItem('unblockTime'), 10);
    if (unblockTime > Date.now()) {
      setIsBlocked(true);
      setNotification(
        'Too many failed login attempts. Please wait 30 seconds before trying again.'
      );
      const timer = setTimeout(() => {
        setIsBlocked(false);
        setNotification('');
        localStorage.removeItem('blocked');
        localStorage.removeItem('unblockTime');
      }, unblockTime - Date.now());
      return () => clearTimeout(timer);
    }
  }, []);

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    if (newAttempts >= 3) {
      const unblockTime = Date.now() + 30000;
      setIsBlocked(true);
      setNotification(
        'Too many failed login attempts. Please wait 30 seconds before trying again.'
      );
      localStorage.setItem('unblockTime', unblockTime.toString());
    } else {
      setNotification('Invalid username or password. Please try again.');
    }
  };

  const login = async (username, password) => {
    if (isBlocked) {
      setNotification(
        'You are currently blocked from logging in. Please wait.'
      );
      return;
    }
    try {
      const response = await fetch(
        'https://tripx-test-functions.azurewebsites.net/api/login',
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        setLoggedIn(true);
        localStorage.setItem('loggedIn', 'true');
        setLoginAttempts(0);
      } else if (response.status === 400) {
        setNotification('Invalid username or password. Please try again.');
      } else if (response.status === 500) {
        setNotification('A server error occurred. Please try again later.');
      } else {
        const errorText = await response.text();
        setNotification(`Error logging in: ${errorText}`);
      }
    } catch (err) {
      setNotification(`Login failed: ${err.message}`);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setLoginAttempts(0);
    setIsBlocked(false);
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('bookingCode');
    router.push('/login');
  };

  return { loggedIn, login, logout, isBlocked, notification };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
