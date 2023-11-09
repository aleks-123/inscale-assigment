'use client';

import React, { useContext } from 'react';
import styles from './navbar.module.css';
import Link from 'next/link';
import { AuthContext } from '../authProvider/AuthProvider';

function Navbar() {
  const { logout, loggedIn } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link href='/'> Inscale</Link>
      </div>
      <div className={styles.links}>
        <Link href='/'>Destination</Link>

        {loggedIn ? (
          <button className={styles.button} onClick={logout}>
            Logout
          </button>
        ) : (
          <Link href='/login'>Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
