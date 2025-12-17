'use client';

import React from 'react';
import Image from 'next/image';
import styles from './propertyCard.module.scss';
import { HiHeart, HiMapPin } from 'react-icons/hi2';

const PropertyCard = ({
  id,
  image = '/aptImage.jpg',
  price,
  priceType = 'sale', // 'sale' or 'rent'
  rooms,
  area,
  floor,
  totalFloors,
  metro,
  address,
  transport,
  district,
  metroDistance,
  isFavorite = false,
  onFavoriteClick,
  onClick,
  className = '',
  ...props
}) => {
  const formatPrice = (price) => {
    if (!price) return '';
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return priceType === 'rent' ? `${formatted} Р/мес.` : `${formatted} Р`;
  };

  const formatFloor = () => {
    if (!floor) return '';
    if (totalFloors) {
      return `${floor}/${totalFloors} этаж`;
    }
    return `${floor} этаж`;
  };

  return (
    <div
      className={`${styles.propertyCard} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={address || 'Property'}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onFavoriteClick) {
              onFavoriteClick(id, !isFavorite);
            }
          }}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <HiHeart />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.price}>{formatPrice(price)}</div>

        <div className={styles.propertyInfo}>
          {rooms && (
            <span className={styles.infoItem}>
              {rooms}-комн. {priceType === 'rent' ? 'кв.' : 'апарт.'}
            </span>
          )}
          {area && (
            <span className={styles.infoItem}>
              {area} м²
            </span>
          )}
          {floor && (
            <span className={styles.infoItem}>
              {formatFloor()}
            </span>
          )}
        </div>

        <div className={styles.location}>
          {metro && (
            <div className={styles.locationItem}>
              <span className={styles.metro}>М {metro}</span>
              {metroDistance && (
                <span className={styles.metroDistance}>{metroDistance}</span>
              )}
            </div>
          )}
          {address && (
            <div className={styles.locationItem}>
              <HiMapPin className={styles.locationIcon} />
              <span className={styles.address}>{address}</span>
            </div>
          )}
        </div>

        {(transport || district) && (
          <div className={styles.additionalInfo}>
            {transport && (
              <div className={styles.transport}>
                <span className={styles.busIcon}>🚌</span>
                <span>{transport}</span>
              </div>
            )}
            {district && (
              <div className={styles.district}>{district}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;

