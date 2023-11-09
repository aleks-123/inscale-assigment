import React from 'react';
import styles from './footer.module.css';

function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.companyInfo}>Destination app</div>
      <div className={styles.year}>2023</div>
      <div className={styles.me}>by: Aleksandar Milosheski</div>
    </div>
  );
}

export default Footer;
