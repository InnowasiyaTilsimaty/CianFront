'use client';

import React from 'react';
import { Carousel } from 'antd';
import styles from './propertyCard.module.scss';
import { HiHeart, HiMapPin, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

// Custom Arrow Component
const SlickArrow = ({ currentSlide, slideCount, type, onClick, className, style, ...props }) => {
  // We exclude `className` and `style` from props to prevent overriding our custom styles
  return (
    <button
      {...props}
      className={`${styles.arrowButton} ${type === 'prev' ? styles.prev : styles.next}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent card click
        onClick && onClick(e);
      }}
      aria-label={type === 'prev' ? 'Previous image' : 'Next image'}
      type="button"
    >
      {type === 'prev' ? <HiChevronLeft /> : <HiChevronRight />}
    </button>
  );
};

const PropertyCard = ({
  id,
  image = '/aptImage.jpg',
  images = [], 
  title,
  type,
  price,
  priceType = 'sale',
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

  // Ensure we have a valid list of images, filtering out any empty strings/nulls
  const validImages = Array.isArray(images) 
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '') 
    : [];
  const imageList = validImages.length > 0 ? validImages : (image ? [image] : ['/aptImage.jpg']);

  return (
    <div
      className={`${styles.propertyCard} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className={styles.imageContainer}>
        {imageList.length > 1 ? (
          <Carousel
            dots={true}
            arrows={true}
            infinite={true}
            adaptiveHeight={false}
            className={styles.carousel}
            prevArrow={<SlickArrow type="prev" />}
            nextArrow={<SlickArrow type="next" />}
          >
            {imageList.map((img, index) => (
              <div key={index} className={styles.carouselItem}>
                <img
                  src={img}
                  alt={title || address || 'Property'}
                  className={styles.image}
                  loading="lazy"
                  onError={(e) => { 
                    e.currentTarget.onerror = null; // Prevent infinite loop
                    e.currentTarget.src = '/aptImage.jpg'; 
                  }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className={styles.singleImageContainer}>
            <img
              src={imageList[0]}
              alt={title || address || 'Property'}
              className={styles.image}
              loading="lazy"
              onError={(e) => { 
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/aptImage.jpg'; 
              }}
            />
          </div>
        )}
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
        {title && <div className={styles.title}>{title}</div>}
        
        <div className={styles.price}>{formatPrice(price)}</div>

        <div className={styles.propertyInfo}>
          {rooms && (
            <span className={styles.infoItem}>
              {rooms}-комн. {type ? type.toLowerCase() : (priceType === 'rent' ? 'кв.' : 'апарт.')}
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
          {(address || district) && (
            <div className={styles.locationItem}>
              <HiMapPin className={styles.locationIcon} />
              <span className={styles.address}>{address || district}</span>
            </div>
          )}
        </div>

        {(transport || (district && address !== district)) && (
          <div className={styles.additionalInfo}>
            {transport && (
              <div className={styles.transport}>
                <span className={styles.busIcon}>🚌</span>
                <span>{transport}</span>
              </div>
            )}
            {district && address !== district && (
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