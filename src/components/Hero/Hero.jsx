'use client';

import { useState } from 'react';
import styles from './hero.module.scss';
import Image from 'next/image';
import Select from '@/components/UI/Select';
import Checkbox from '@/components/UI/Checkbox';
import Divider from '@/components/UI/Divider';
import PropertyCard from '@/components/PropertyCard';
import { aptmentApi } from '@/lib/api/aptment';

export default function Hero() {
    const { data: aptmentList } = aptmentApi.useGetAptmentListQuery();
    console.log(aptmentList);
    const [activeTab, setActiveTab] = useState('buy');
    const [favorites, setFavorites] = useState(new Set());

    const properties = [
        {
            id: 1,
            price: 13449500,
            priceType: 'sale',
            rooms: '2',
            area: '50.40',
            floor: 3,
            totalFloors: 14,
            metro: 'Говорово',
            metroDistance: '23',
            address: 'Солнцевский просп., 19К2',
        },
        {
            id: 2,
            price: 19500000,
            priceType: 'sale',
            rooms: '2',
            area: '52',
            floor: 13,
            totalFloors: 17,
            metro: 'Солнцево',
            metroDistance: '17',
            address: 'ул. Главмосстроя, 5',
        },
        {
            id: 3,
            price: 80000,
            priceType: 'rent',
            rooms: '2',
            area: '65',
            floor: 8,
            totalFloors: 14,
            metro: 'Солнцево',
            metroDistance: '19',
            address: 'ул. Авиаторов, 30',
        },
        {
            id: 4,
            price: 24490000,
            priceType: 'sale',
            rooms: '2',
            area: '54',
            floor: 18,
            totalFloors: 33,
            metro: 'Озёрная',
            metroDistance: '14',
            address: 'ул. Малая Очаковская, 4Ак1',
        },
        {
            id: 5,
            price: 80000,
            priceType: 'rent',
            rooms: '2',
            area: '60',
            floor: 15,
            totalFloors: 21,
            metro: 'Озёрная',
            metroDistance: '16',
            address: 'Востряковское ш., 7с2',
        },
        {
            id: 6,
            price: 24452000,
            priceType: 'sale',
            rooms: '3',
            area: '62.30',
            floor: 27,
            totalFloors: 28,
            metro: 'Озёрная',
            metroDistance: '5',
            address: 'Озерная ул., вл42',
        },
        {
            id: 7,
            price: 75000,
            priceType: 'rent',
            rooms: '2',
            area: '64',
            floor: 5,
            totalFloors: 17,
            metro: 'Солнцево',
            metroDistance: '6',
            address: 'ул. Богданова, 14К1',
        },
        {
            id: 8,
            price: 29000000,
            priceType: 'sale',
            rooms: '3',
            area: '85.50',
            floor: 12,
            totalFloors: 17,
            metro: 'Саларьево',
            metroDistance: '5',
            address: 'Родниковая ул., 30к1',
        },
        {
            id: 9,
            price: 15200000,
            priceType: 'sale',
            rooms: '2',
            area: '48',
            floor: 7,
            totalFloors: 16,
            metro: 'Говорово',
            metroDistance: '12',
            address: 'Солнцевский просп., 21',
        },
        {
            id: 10,
            price: 90000,
            priceType: 'rent',
            rooms: '3',
            area: '75',
            floor: 10,
            totalFloors: 20,
            metro: 'Солнцево',
            metroDistance: '8',
            address: 'ул. Авиаторов, 25',
        },
        {
            id: 11,
            price: 18900000,
            priceType: 'sale',
            rooms: '2',
            area: '55',
            floor: 4,
            totalFloors: 12,
            metro: 'Озёрная',
            metroDistance: '11',
            address: 'Озерная ул., 15',
        },
        {
            id: 12,
            price: 70000,
            priceType: 'rent',
            rooms: '1',
            area: '35',
            floor: 9,
            totalFloors: 18,
            metro: 'Саларьево',
            metroDistance: '7',
            address: 'Родниковая ул., 12',
        },
    ];

    const handleFavoriteClick = (id, isFavorite) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (isFavorite) {
                newFavorites.add(id);
            } else {
                newFavorites.delete(id);
            }
            return newFavorites;
        });
    };

    const tabs = [
        { id: 'buy', label: 'Купить' },
        { id: 'rent', label: 'Снять' },
        { id: 'daily', label: 'Посуточно' },
        { id: 'build', label: 'Построить' },
        { id: 'evaluate', label: 'Оценить' },
        { id: 'mortgage', label: 'Ипотека' },
        { id: 'realtor', label: 'Подбор риелтора' },
        { id: 'post', label: 'Подать за 0 Р' },
    ];

    return (
        <>
        
        <section className={styles.hero}>
            <div className={styles.backgroundImage}>
                <Image
                    src="/mainImg.webp"
                    alt="Modern buildings"
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.overlay}></div>
            </div>

            <div className={styles.content}>
                <h1 className={styles.title}>
                    Подберём и поможем купить новостройку
                </h1>

                <div className={styles.tabsContainer}>
                    <div className={styles.tabs}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.searchForm}>
                        <div className={styles.searchFields}>
                            <div className={styles.searchField}>
                                <Select
                                    placeholder="Квартиру в новостройке и вторичке"
                                    multiple={true}
                                >
                                    <option><Checkbox checked={true} /> Квартиру в новостройке</option>
                                    <option><Checkbox /> Квартиру в вторичке</option>
                                    <Divider />
                                    <option><Checkbox /> Комната</option>
                                    <Divider />
                                    <option><Checkbox /> Дом, дача</option>
                                    <option><Checkbox /> Участок</option>
                                    <option><Checkbox /> Земельный участок</option>
                                </Select>
                            </div>
                            <div className={styles.searchField}>
                                <Select placeholder="Комнат" multiple={true} buttonLayout={true}>
                                    <option>1 </option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6+</option>
                                    <Divider />
                                    <option><Checkbox /> Студия</option>
                                    <option><Checkbox /> Свободная планировка</option>
                                </Select>
                            </div>
                            <div className={styles.searchField}>
                                <Select placeholder="Цена">
                                    <option>Цена</option>
                                </Select>
                            </div>
                            <div className={styles.searchField}>
                                <input
                                    type="text"
                                    placeholder="Город, адрес, метро, район, ж/д, шоссе или ЖК"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.searchActions}>
                            <button className={styles.mapButton}>
                                Показать на карте
                            </button>
                            <button className={styles.searchButton}>
                                Найти
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </section>
        <section>
                            <div className={styles.propertiesGrid}>
                    {properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            {...property}
                            isFavorite={favorites.has(property.id)}
                            onFavoriteClick={handleFavoriteClick}
                            onClick={() => console.log('Property clicked:', property.id)}
                        />
                    ))}
                </div>
        </section>
        </>
    );
}

