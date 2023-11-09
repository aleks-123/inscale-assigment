'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/components/authProvider/AuthProvider';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';

function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowPassword(e.target.checked);
  };

  const [data, setData] = useState({
    username: '',
    password: '',
    bookingCode: '',
  });

  const [errors, setErrors] = useState({});

  const {
    loggedIn,
    isBlocked,
    notification,
    login: contextLogin,
  } = useContext(AuthContext);

  const dataChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!data.username) {
      newErrors.username = 'Username cannot be empty.';
      valid = false;
    } else if (data.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
      valid = false;
    }

    if (!data.password) {
      newErrors.password = 'Password cannot be empty.';
      valid = false;
    } else if (data.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters long.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('bookingCode', data.bookingCode);
      await contextLogin(data.username, data.password);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      router.push('/');
    }
  }, [loggedIn, router]);

  return (
    <div className={styles.component}>
      <h2 className={styles.title}>Login</h2>
      <div className={styles.error}>{notification}</div>
      <form onSubmit={handleSubmit} className={styles.formInput}>
        <label className={styles.label}>Username:</label>
        <input
          className={styles.input}
          type='text'
          name='username'
          value={data.username}
          onChange={dataChange}
        />
        {errors.username && (
          <div className={styles.error}>{errors.username}</div>
        )}
        <label className={styles.label}>Password:</label>
        <input
          className={styles.input}
          type={showPassword ? 'text' : 'password'}
          name='password'
          value={data.password}
          onChange={dataChange}
        />

        {errors.password && (
          <div className={styles.error}>{errors.password}</div>
        )}
        <label className={styles.checkboxLabel}>
          <input
            type='checkbox'
            checked={showPassword}
            onChange={handleCheckboxChange}
          />
          <span className={styles.checkbox}>Show Password</span>
        </label>
        <label className={styles.label}>Booking Code:</label>
        <input
          className={styles.input}
          type='text'
          name='bookingCode'
          value={data.bookingCode}
          onChange={dataChange}
        />

        <button disabled={isBlocked} className={styles.button} type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
