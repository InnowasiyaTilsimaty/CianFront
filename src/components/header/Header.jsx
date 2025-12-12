'use client';

import { useState } from 'react';
import styles from './header.module.scss';
import { HiHome } from 'react-icons/hi2';
import { HiCog6Tooth, HiBars3, HiChatBubbleLeft, HiHeart, HiBell } from 'react-icons/hi2';
import { HiBookOpen } from 'react-icons/hi2';
import { menuData } from './menuData';

export default function Header() {
  const [hoveredMenu, setHoveredMenu] = useState(null);



  const renderDropdown = (menuKey) => {
    const menu = menuData[menuKey];
    if (!menu) return null;

    return (
      <div className={styles.dropdown}>
        <div className={styles.dropdownContent}>
          {menu.columns.map((column, colIndex) => {
            // Пропускаем колонки без элементов и без заголовка
            if (!column.items.length && !column.title) return null;
            
            return (
              <div key={colIndex} className={styles.dropdownColumn}>
                {column.title && (
                  <div className={styles.dropdownTitle}>{column.title}</div>
                )}
                {column.items.length > 0 && (
                  <ul className={styles.dropdownList}>
                    {column.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <a href="#" className={styles.dropdownLink}>{item}</a>
                      </li>
                    ))}
                  </ul>
                )}
                {column.title && !column.items.length && (
                  <a href="#" className={styles.dropdownLink}>{column.title}</a>
                )}
              </div>
            );
          })}
          {menu.journal && (
            <div className={styles.dropdownColumn}>
              <div className={styles.journalHeader}>
                <HiBookOpen className={styles.journalIcon} />
                <span>{menu.journal.title}</span>
              </div>
              <ul className={styles.dropdownList}>
                {menu.journal.articles.map((article, index) => (
                  <li key={index}>
                    <a href="#" className={styles.dropdownLink}>{article}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <header className={styles.header}>
      {/* Top bar with logo and utility buttons */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <HiHome className={styles.logoIcon} />
            <span className={styles.logoText}>ЦИАН</span>
          </div>

          {/* Utility buttons */}
          <div className={styles.utilityButtons}>
            <button className={styles.utilityBtn}>
              <HiCog6Tooth />
              <span>Умный помощник</span>
            </button>
            <button className={styles.utilityBtn}>
              <HiBars3 />
            </button>
            <button className={styles.utilityBtn}>
              <HiChatBubbleLeft />
            </button>
            <button className={styles.utilityBtn}>
              <HiHeart />
            </button>
            <button className={styles.utilityBtn}>
              <HiBell />
            </button>
            <button className={`${styles.actionBtn} ${styles.postBtn}`}>
              + Разместить за 0 Р
            </button>
            <button className={`${styles.actionBtn} ${styles.loginBtn}`}>
              Войти
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className={styles.navBar}>
        <div className={styles.navContent}>
          <div 
            className={styles.navItem}
            onMouseEnter={() => setHoveredMenu('arenda')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <a href="#" className={styles.navLink}>Аренда</a>
            {hoveredMenu === 'arenda' && renderDropdown('arenda')}
          </div>
          <div 
            className={styles.navItem}
            onMouseEnter={() => setHoveredMenu('prodazha')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <a href="#" className={styles.navLink}>Продажа</a>
            {hoveredMenu === 'prodazha' && renderDropdown('prodazha')}
          </div>
          <div 
            className={styles.navItem}
            onMouseEnter={() => setHoveredMenu('novostroyki')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <a href="#" className={styles.navLink}>Новостройки</a>
            {hoveredMenu === 'novostroyki' && renderDropdown('novostroyki')}
          </div>
          <div 
            className={styles.navItem}
            onMouseEnter={() => setHoveredMenu('doma')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <a href="#" className={styles.navLink}>Дома и участки</a>
            {hoveredMenu === 'doma' && renderDropdown('doma')}
          </div>
          <div 
            className={styles.navItem}
            onMouseEnter={() => setHoveredMenu('kommercheskaya')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <a href="#" className={styles.navLink}>Коммерческая</a>
            {hoveredMenu === 'kommercheskaya' && renderDropdown('kommercheskaya')}
          </div>
          <div 
            className={styles.navItem}
            onMouseEnter={() => setHoveredMenu('ipoteka')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <a href="#" className={styles.navLink}>Ипотека</a>
            {hoveredMenu === 'ipoteka' && renderDropdown('ipoteka')}
          </div>
          <a href="#" className={styles.navLink}>Мой дом</a>
          <a href="#" className={styles.navLink}>
            Сделка
            <span className={styles.redDot}></span>
          </a>
          <a href="#" className={styles.navLink}>Сервисы</a>
          <a href="#" className={styles.navLink}>Приложение Циан</a>
          <a href="#" className={`${styles.navLink} ${styles.pikLink}`}>ПИК</a>
        </div>
      </nav>
    </header>
  );
}