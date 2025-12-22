'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from './authModal.module.scss';
import { HiXMark } from 'react-icons/hi2';
import Checkbox from '@/components/UI/Checkbox';

const AuthModal = ({ open, onClose }) => {
  const [step, setStep] = useState('phone'); // 'phone', 'code', 'create'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [agreeNews, setAgreeNews] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (step === 'code' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  useEffect(() => {
    if (!open) {
      setStep('phone');
      setPhone('');
      setCode('');
      setTimer(0);
      setAgreeNews(false);
      setAgreeTerms(false);
    }
  }, [open]);

  const handleGetCode = () => {
    if (phone.length >= 10) {
      setStep('code');
      setTimer(60);
    }
  };

  const handleLogin = () => {
    if (code.length >= 4) {
      setStep('create');
    }
  };

  const handleCreateAccount = () => {
    if (agreeTerms) {
      // Логика создания аккаунта
      onClose();
    }
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(60);
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 1) return `+7 (${cleaned}`;
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const renderContent = () => {
    switch (step) {
      case 'phone':
        return (
          <>
            <div className={styles.modalIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Дом/крыша */}
                <path d="M32 12L12 24L32 36L52 24L32 12Z" fill="#4a9eff"/>
                {/* Локация сверху */}
                <circle cx="32" cy="8" r="4" fill="#4a9eff"/>
                <circle cx="32" cy="8" r="2" fill="white"/>
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Вход или регистрация</h2>
            <div className={styles.inputGroup}>
              <input
                type="tel"
                className={styles.input}
                placeholder="Телефон"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
              />
            </div>
            <button
              className={`${styles.primaryButton} ${phone.replace(/\D/g, '').replace(/^993/, '').length < 8 ? styles.disabled : ''}`}
              onClick={handleGetCode}
              disabled={phone.replace(/\D/g, '').replace(/^993/, '').length < 8}
            >
              Получить код
            </button>
            <button className={styles.secondaryButton} onClick={onClose}>
              Другой способ
            </button>
            <a href="#" className={styles.supportLink}>Служба поддержки</a>
          </>
        );

      case 'code':
        return (
          <>
            <div className={styles.modalIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Дом/крыша */}
                <path d="M32 12L12 24L32 36L52 24L32 12Z" fill="#4a9eff"/>
                {/* Локация сверху */}
                <circle cx="32" cy="8" r="4" fill="#4a9eff"/>
                <circle cx="32" cy="8" r="2" fill="white"/>
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Введите код из смс</h2>
            <p className={styles.modalSubtitle}>
              Отправили его на {phone}
            </p>
            <button className={styles.changeNumberLink} onClick={() => setStep('phone')}>
              Изменить номер
            </button>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.input}
                placeholder="Код"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>
            {timer > 0 ? (
              <p className={styles.timerText}>
                Отправить код повторно через {timer} сек.
              </p>
            ) : (
              <button className={styles.resendLink} onClick={handleResendCode}>
                Отправить код повторно
              </button>
            )}
            <button
              className={`${styles.primaryButton} ${code.length < 4 ? styles.disabled : ''}`}
              onClick={handleLogin}
              disabled={code.length < 4}
            >
              Войти
            </button>
            <a href="#" className={styles.supportLink}>Служба поддержки</a>
          </>
        );

      case 'create':
        return (
          <>
            <div className={styles.modalIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Дом/крыша */}
                <path d="M32 12L12 24L32 36L52 24L32 12Z" fill="#4a9eff"/>
                {/* Локация сверху */}
                <circle cx="32" cy="8" r="4" fill="#4a9eff"/>
                <circle cx="32" cy="8" r="2" fill="white"/>
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Создаём новый аккаунт на номер</h2>
            <p className={styles.phoneNumber}>{phone}</p>
            <div className={styles.checkboxes}>
              <Checkbox
                id="agree-news"
                checked={agreeNews}
                onChange={(e) => setAgreeNews(e.target.checked)}
                label={
                  <>
                    Соглашаюсь получать новости про скидки, советы по поездкам и другие интересные материалы —{' '}
                    <a href="#" className={styles.link}>подробнее</a>
                  </>
                }
              />
              <Checkbox
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                label={
                  <>
                    Принимаю условия{' '}
                    <a href="#" className={styles.link}>Пользовательского соглашения</a>,{' '}
                    <a href="#" className={styles.link}>Политики конфиденциальности</a> и{' '}
                    <a href="#" className={styles.link}>Обработки и распространения персональных данных</a>
                  </>
                }
              />
            </div>
            <button
              className={`${styles.primaryButton} ${!agreeTerms ? styles.disabled : ''}`}
              onClick={handleCreateAccount}
              disabled={!agreeTerms}
            >
              Создать аккаунт
            </button>
            <button className={styles.secondaryButton} onClick={() => setStep('code')}>
              Назад
            </button>
            <a href="#" className={styles.supportLink}>Служба поддержки</a>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      width={440}
      className={styles.authModal}
      styles={{
        content: {
          padding: 0,
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          <HiXMark />
        </button>
        {renderContent()}
      </div>
    </Modal>
  );
};

AuthModal.displayName = 'AuthModal';

export default AuthModal;

