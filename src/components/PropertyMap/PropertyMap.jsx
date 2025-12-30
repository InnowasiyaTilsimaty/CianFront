'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { aptmentApi } from '@/lib/api/aptment';
import styles from './propertyMap.module.scss';
import { HiHome } from 'react-icons/hi2';

// Динамический импорт MapContainer для избежания проблем с SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const PropertyMap = ({ id }) => {
  const { data: property, isLoading, error } = aptmentApi.useGetAptmentByIdQuery(id);
  const [homeIcon, setHomeIcon] = useState(null);

  useEffect(() => {
    // Импортируем стили Leaflet
    import('leaflet/dist/leaflet.css');
    
    // Создаем кастомную иконку дома
    import('leaflet').then((L) => {
      const icon = L.divIcon({
        className: styles.customMarker,
        html: `
          <div class="${styles.markerIcon}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
      setHomeIcon(icon);
    });
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>Загрузка карты...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.error}>
        <div>Объявление не найдено</div>
      </div>
    );
  }

  const latitude = parseFloat(property.latitude);
  const longitude = parseFloat(property.longitude);

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className={styles.error}>
        <div>Координаты не указаны</div>
      </div>
    );
  }

  const position = [latitude, longitude];

  const formatPrice = (price) => {
    if (!price) return '';
    return parseFloat(price).toLocaleString('ru-RU', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.propertyInfo}>
              <span className={styles.infoItem}>
                <HiHome size={16} />
                {property.type_data?.title || 'Недвижимость'}
              </span>
              <span className={styles.infoItem}>
                {property.square_footage} м²
              </span>
              <span className={styles.infoItem}>
                {property.count_rooms} комн.
              </span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.price}>
              {formatPrice(property.price)} ₽
              {property.service_type_data?.title === 'Аренда' && (
                <span className={styles.priceType}>/мес.</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mapWrapper}>
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {homeIcon && (
            <Marker 
              position={position}
              icon={homeIcon}
            >
            <Popup className={styles.popup}>
              <div className={styles.popupContent}>
                <h3 className={styles.popupTitle}>{property.title}</h3>
                <div className={styles.popupInfo}>
                  <p className={styles.popupAddress}>
                    <span>📍</span>
                    {property.region_data?.title || 'Адрес не указан'}
                  </p>
                  <p className={styles.popupPrice}>
                    <span>💰</span>
                    {formatPrice(property.price)} ₽
                    {property.service_type_data?.title === 'Аренда' && ' /мес.'}
                  </p>
                  <p className={styles.popupDetails}>
                    <span>📐</span>
                    {property.square_footage} м² · {property.count_rooms} комн.
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

PropertyMap.displayName = 'PropertyMap';

export default PropertyMap;

