import React from 'react';
import styles from './destinationCard.module.css';
import Image from 'next/image';

function DestinationCard({ destination }) {
  return (
    <div className={styles.card}>
      <p>{destination.name}</p>
      <Image
        className={styles.thumbnailImage}
        src={destination.thumbnail}
        width={330}
        height={200}
      />
    </div>
  );
}

export default DestinationCard;
