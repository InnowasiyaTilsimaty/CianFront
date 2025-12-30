'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { aptmentApi } from '@/lib/api/aptment';
import styles from './propertyDetail.module.scss';
import { 
  HiMapPin, 
  HiShare, 
  HiPencil, 
  HiArrowDownTray, 
  HiPrinter,
  HiEyeSlash,
  HiHeart,
  HiChartBar,
  HiClock
} from 'react-icons/hi2';

const PropertyDetail = ({ id }) => {
  // Все хуки должны быть в начале компонента, до любых условных возвратов
  const router = useRouter();
  const { data: property, isLoading, error } = aptmentApi.useGetAptmentByIdQuery(id);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>Загрузка объявления...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className={styles.error}>
        <div>Объявление не найдено или удалено</div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return '';
    return parseFloat(price).toLocaleString('ru-RU', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  const images = property.property_images || [];
  const hasImages = images.length > 0;

  return (
    <div className={styles.propertyDetail}>
      
      {/* 1. Top Header with Address and Actions */}
      <div className={styles.topHeader}>
        <div className={styles.addressRow}>
          <div className={styles.address}>
            <HiMapPin size={18} />
            <span>{property.region_data?.title || 'Адрес не указан'}</span>
          </div>
          <a 
            href="#" 
            className={styles.mapLink}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/property/${id}/map`);
            }}
          >
            На карте
          </a>
        </div>
        <div className={styles.actionIcons}>
          <button className={styles.actionIcon} title="Сравнить">
            <HiChartBar size={20} />
          </button>
          <button className={styles.actionIcon} title="Поделиться">
            <HiShare size={20} />
          </button>
          <button className={styles.actionIcon} title="Редактировать">
            <HiPencil size={20} />
          </button>
          <button className={styles.actionIcon} title="Скачать">
            <HiArrowDownTray size={20} />
          </button>
          <button className={styles.actionIcon} title="Печать">
            <HiPrinter size={20} />
          </button>
          <button className={styles.actionIcon} title="Скрыть">
            <HiEyeSlash size={20} />
          </button>
          <button className={styles.actionIcon} title="Пожаловаться">
            Пожаловаться
          </button>
        </div>
      </div>

      {/* 2. Title */}
      <h1 className={styles.title}>{property.title}</h1>

      {/* 3. Gallery Section with Main Swiper and Thumbnails */}
      <div className={styles.galleryWrapper}>
        {hasImages ? (
          <>
            <div className={styles.mainGallery}>
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                navigation={true}
                pagination={false}
                loop={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className={styles.mainSwiper}
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={img}
                        alt={`${property.title} - фото ${index + 1}`}
                        className={styles.image}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/aptImage.jpg';
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={styles.galleryButtons}>
                <button className={styles.galleryButton}>
                  <span>Планировка</span>
                </button>
                <button className={styles.galleryButton}>
                  <span>{images.length} фото</span>
                </button>
              </div>
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnailsGallery}>
                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView="auto"
                  freeMode={true}
                  watchSlidesProgress={true}
                  className={styles.thumbnailsSwiper}
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index} className={styles.thumbnailSlide}>
                      <div className={styles.thumbnailWrapper}>
                        <img
                          src={img}
                          alt={`Миниатюра ${index + 1}`}
                          className={styles.thumbnail}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/aptImage.jpg';
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImageContainer}>
             <img src="/aptImage.jpg" alt="Нет фото" className={styles.image} />
          </div>
        )}
      </div>

      {/* 3. Main Content & Sidebar */}
      <div className={styles.contentWrapper}>
        
        {/* Left Column: Info & Description */}
        <div className={styles.mainColumn}>
          
          {/* Characteristics */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Общая информация</h2>
            <div className={styles.specsGrid}>
              <SpecRow label="Площадь" value={`${property.square_footage} м²`} />
              <SpecRow label="Этаж" value={`${property.floor_number} из ${property.floors_total}`} />
              <SpecRow label="Комнат" value={property.count_rooms} />
              <SpecRow label="Тип жилья" value={property.type_data?.title} />
              <SpecRow label="Тип сделки" value={property.service_type_data?.title} />
              <SpecRow label="Район" value={property.region_data?.title} />
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Описание</h2>
              <div className={styles.descriptionText}>{property.description}</div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Price Card */}
        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <div className={styles.priceHeader}>
              <div className={styles.priceBlock}>
                <div className={styles.priceValue}>
                  {formatPrice(property.price)} ₽
                  {property.service_type_data?.title === 'Аренда' && <span className={styles.priceType}>/мес.</span>}
                </div>
                <div className={styles.priceIcons}>
                  <button 
                    className={styles.priceIcon}
                    title="График цены"
                  >
                    <HiChartBar size={16} />
                  </button>
                  <button 
                    className={`${styles.priceIcon} ${isFavorite ? styles.favorite : ''}`}
                    onClick={() => setIsFavorite(!isFavorite)}
                    title="В избранное"
                  >
                    <HiHeart size={18} />
                  </button>
                </div>
              </div>
              <a href="#" className={styles.priceTrackLink}>Следить за изменением цены</a>
            </div>

            <div className={styles.priceOffer}>
              <div className={styles.priceOfferLabel}>Предложите свою цену</div>
              <div className={styles.priceOfferInput}>
                <input 
                  type="text" 
                  placeholder="Например, 14 549 000 р"
                  className={styles.offerInput}
                />
                <button className={styles.offerButton}>
                  <span>→</span>
                </button>
              </div>
            </div>

            <div className={styles.mortgageSection}>
              <div className={styles.mortgageItem}>
                <span>Ипотека</span>
                <span>→</span>
              </div>
            </div>

            <div className={styles.priceDetails}>
              <div className={styles.priceDetailItem}>
                <span className={styles.priceDetailLabel}>Цена за метр</span>
                <span className={styles.priceDetailValue}>
                  {property.service_type_data?.title === 'Продажа' 
                    ? `${formatPrice(property.price / property.square_footage)} ₽/м²`
                    : '-'
                  }
                </span>
              </div>
              <div className={styles.priceDetailItem}>
                <span className={styles.priceDetailLabel}>Условия сделки</span>
                <span className={styles.priceDetailValue}>альтернатива</span>
              </div>
              <div className={styles.priceDetailItem}>
                <span className={styles.priceDetailLabel}>Ипотека</span>
                <span className={styles.priceDetailValue}>возможна</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              {property.user_phone && (
                <a href={`tel:${property.user_phone}`} className={styles.phoneButton}>
                  Показать телефон
                </a>
              )}
              <button className={styles.messageButton}>
                Написать
              </button>
            </div>

            <div className={styles.quickResponse}>
              <HiClock size={16} />
              <span>Быстро отвечает на сообщения</span>
            </div>

            <div className={styles.agencyInfo}>
              <div className={styles.agencyHeader}>
                <div className={styles.agencyLogo}>🏠</div>
                <div className={styles.agencyName}>
                  <div className={styles.agencyLabel}>АГЕНТСТВО НЕДВИЖИМОСТИ</div>
                  <div className={styles.agencyTitle}>Владис</div>
                </div>
              </div>
              <div className={styles.agencyVerified}>
                <span>✓</span>
                <span>Документы проверены</span>
              </div>
              <div className={styles.agencyStats}>
                <div className={styles.agencyStat}>
                  <span>На Циан</span>
                  <span>3 года</span>
                </div>
                <div className={styles.agencyStat}>
                  <span>Объектов в работе</span>
                  <span>459</span>
                </div>
              </div>
            </div>

            <div className={styles.realtorInfo}>
              <div className={styles.realtorAvatar}>👤</div>
              <div className={styles.realtorDetails}>
                <span className={styles.realtorLabel}>РИЕЛТОР</span>
                <span className={styles.realtorName}>Николай Голубев</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

// Helper component for dotted rows
const SpecRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className={styles.specItem}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specDots}></span>
      <span className={styles.specValue}>{value}</span>
    </div>
  );
};

PropertyDetail.displayName = 'PropertyDetail';

export default PropertyDetail;