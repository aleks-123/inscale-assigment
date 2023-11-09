'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/components/authProvider/AuthProvider';
import DestinationCard from '@/components/destinationCard/DestinationCard';
import DestinationList from '@/components/destinationList/DestinationList';

export default function Home() {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);

  const { loggedIn } = useContext(AuthContext);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      setLoading(true);
      setError(null);
      const fetchDestinations = async () => {
        try {
          const response = await fetch(
            'https://book.tripx.se/wp-json/tripx/v1/destinations'
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);
          setDestinations(data);
        } catch (error) {
          setError('Could not fetch destinations: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDestinations();
    }
  }, [loggedIn]);

  // Determine the slice of data to show

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.component}>
      {!loggedIn && (
        <>
          <h2>If you want to see our destination you must be logged in</h2>
          <div>
            <span className={styles.loginLink}>
              <Link href='/login'>Login page</Link>
            </span>
          </div>
        </>
      )}
      {loggedIn && (
        <>
          <DestinationList
            destinations={destinations}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            goToPage={goToPage}
          />
        </>
      )}
    </div>
  );
}
