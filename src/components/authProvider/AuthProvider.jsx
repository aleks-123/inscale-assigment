'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [notification, setNotification] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(isLoggedIn);

    const unblockTime = parseInt(localStorage.getItem('unblockTime'), 10);
    if (unblockTime && Date.now() < unblockTime) {
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

  const login = async (username, password) => {
    if (isBlocked) {
      setNotification(
        'You are currently blocked from logging in. Please wait.'
      );
      return;
    }

    try {
      const res = await fetch(
        'https://tripx-test-functions.azurewebsites.net/api/login',
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(res);
      if (res.ok) {
        setLoggedIn(true);
        localStorage.setItem('loggedIn', 'true');
        console.log(loggedIn);

        setLoginAttempts(0);
      } else {
        handleFailedLogin();
      }
    } catch (err) {
      handleFailedLogin();
    }
  };

  const handleFailedLogin = () => {
    setLoginAttempts((prev) => {
      const newAttempts = prev + 1;
      if (newAttempts >= 3) {
        const unblockTime = Date.now() + 30000; // 30 seconds block
        setIsBlocked(true);
        setNotification(
          'Too many failed login attempts. Please wait 30 seconds before trying again.'
        );
        localStorage.setItem('blocked', 'true');
        localStorage.setItem('unblockTime', unblockTime.toString());
      } else {
        setNotification('Invalid username or password. Please try again.');
      }
      return newAttempts;
    });
  };

  const logout = () => {
    setLoggedIn(false);
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('token');
    setLoginAttempts(0);
    setIsBlocked(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        isBlocked,
        notification,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
