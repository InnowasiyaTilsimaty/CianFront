'use client';

import { useState } from 'react';
import styles from './hero.module.scss';
import Image from 'next/image';
import Select from '@/components/UI/Select';
import Checkbox from '@/components/UI/Checkbox';
import Divider from '@/components/UI/Divider';

export default function Hero() {
    const [activeTab, setActiveTab] = useState('buy');

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
    );
}

