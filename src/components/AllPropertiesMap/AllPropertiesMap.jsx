'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { aptmentApi } from '@/lib/api/aptment';
import styles from './allPropertiesMap.module.scss';
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

const AllPropertiesMap = () => {
  const router = useRouter();
  const { data: propertiesData, isLoading, error } = aptmentApi.useGetAptmentListQuery();
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

  // Фильтруем объекты с валидными координатами и вычисляем центр карты
  const { validProperties, center } = useMemo(() => {
    if (!propertiesData?.results) {
      return { validProperties: [], center: [37.9, 58.39] }; // Дефолтные координаты
    }

    const valid = propertiesData.results
      .map((property) => {
        const lat = parseFloat(property.latitude);
        const lon = parseFloat(property.longitude);
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
          return null;
        }
        return {
          ...property,
          latitude: lat,
          longitude: lon,
        };
      })
      .filter(Boolean);

    // Вычисляем центр карты как среднее значение координат
    if (valid.length > 0) {
      const avgLat = valid.reduce((sum, p) => sum + p.latitude, 0) / valid.length;
      const avgLon = valid.reduce((sum, p) => sum + p.longitude, 0) / valid.length;
      return { validProperties: valid, center: [avgLat, avgLon] };
    }

    return { validProperties: valid, center: [37.9, 58.39] };
  }, [propertiesData]);

  const formatPrice = (price) => {
    if (!price) return '';
    return parseFloat(price).toLocaleString('ru-RU', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>Загрузка карты...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <div>Ошибка загрузки данных</div>
      </div>
    );
  }

  if (validProperties.length === 0) {
    return (
      <div className={styles.error}>
        <div>Нет объектов с координатами для отображения</div>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Карта недвижимости</h1>
            <div className={styles.propertyInfo}>
              <span className={styles.infoItem}>
                <HiHome size={16} />
                Найдено объектов: {validProperties.length}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mapWrapper}>
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {homeIcon && validProperties.map((property) => {
            const position = [property.latitude, property.longitude];
            return (
              <Marker 
                key={property.id} 
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
                      <button
                        className={styles.viewButton}
                        onClick={() => router.push(`/property/${property.id}`)}
                      >
                        Посмотреть детали
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

AllPropertiesMap.displayName = 'AllPropertiesMap';

export default AllPropertiesMap;

