'use client';

import React, { useEffect, useState } from 'react';
import DestinationCard from '../destinationCard/DestinationCard';
import styles from './destinationList.module.css';

const DestinationList = ({
  destinations,
  itemsPerPage,
  currentPage,
  goToPage,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = destinations.slice(indexOfFirstItem, indexOfLastItem);

  const [bookingCode, setBookingCode] = useState('');
  useEffect(() => {
    const storedBookingCode = localStorage.getItem('bookingCode');
    if (storedBookingCode) {
      setBookingCode(storedBookingCode);
    }
  }, []);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(destinations.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.container}>
      {bookingCode && (
        <p className={styles.bookingCode}>Booking Code: {bookingCode}</p>
      )}
      <div className={styles.cardContainer}>
        {currentItems.map((item) => (
          <DestinationCard key={item.slug} destination={item} />
        ))}
      </div>
      <div className={styles.pagination}>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            className={currentPage === number ? styles.activePage : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DestinationList;
