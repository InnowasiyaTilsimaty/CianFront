"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import styles from "./authModal.module.scss";
import { HiXMark, HiHome } from "react-icons/hi2";
import Checkbox from "@/components/UI/Checkbox";

const AuthModal = ({ open, onClose }) => {
  const [step, setStep] = useState("phone"); 
  const [phone, setPhone] = useState("+993 ");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [agreeNews, setAgreeNews] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (step === "code" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
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
      setStep("phone");
      setPhone("+993 ");
      setCode("");
      setTimer(0);
      setAgreeNews(false);
      setAgreeTerms(false);
    }
  }, [open]);

  const handleGetCode = () => {
    const digits = phone.replace(/\D/g, '').replace(/^993/, '');
    if (digits.length >= 8) {
      setStep("create");
    }
  };

  const handleCreateAccount = () => {
    if (agreeTerms) {
      setStep("code");
      setTimer(60);
    }
  };

  const handleLogin = () => {
    if (code.length >= 4) {
      onClose();
    }
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(60);
    }
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "");
    

    let digits = cleaned.startsWith('993') ? cleaned.slice(3) : cleaned;
    

    digits = digits.slice(0, 8);
    
    if (digits.length === 0) return "+993 ";
    if (digits.length <= 2) return `+993 ${digits}`;
    return `+993 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const renderContent = () => {
    switch (step) {
      case "phone":
        return (
          <>
            <div className={styles.logo}>
              <HiHome className={styles.logoIcon} />
              <span className={styles.logoText}>ЦИАН</span>
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
              className={`${styles.primaryButton} ${
                phone.replace(/\D/g, '').replace(/^993/, '').length < 8 ? styles.disabled : ""
              }`}
              onClick={handleGetCode}
              disabled={phone.replace(/\D/g, '').replace(/^993/, '').length < 8}
            >
              Продолжить
            </button>
          </>
        );

      case "code":
        return (
          <>
            <div className={styles.logo}>
              <HiHome className={styles.logoIcon} />
              <span className={styles.logoText}>ЦИАН</span>
            </div>
            <h2 className={styles.modalTitle}>Введите код из смс</h2>
            <p className={styles.modalSubtitle}>Отправили его на {phone}</p>
            <button
              className={styles.changeNumberLink}
              onClick={() => setStep("phone")}
            >
              Изменить номер
            </button>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.input}
                placeholder="Код"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
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
              className={`${styles.primaryButton} ${
                code.length < 4 ? styles.disabled : ""
              }`}
              onClick={handleLogin}
              disabled={code.length < 4}
            >
              Войти
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => setStep("create")}
            >
              Назад
            </button>
          </>
        );

      case "create":
        return (
          <>
            <div className={styles.logo}>
              <HiHome className={styles.logoIcon} />
              <span className={styles.logoText}>ЦИАН</span>
            </div>
            <h2 className={styles.modalTitle}>
              Создаём новый аккаунт на номер
            </h2>
            <p className={styles.phoneNumber}>{phone}</p>
            <div className={styles.checkboxes}>
              <Checkbox
                id="agree-news"
                checked={agreeNews}
                onChange={(e) => setAgreeNews(e.target.checked)}
                label={
                  <>
                    Соглашаюсь получать новости про скидки, советы по поездкам и
                    другие интересные материалы —{" "}
                    <a href="#" className={styles.link}>
                      подробнее
                    </a>
                  </>
                }
              />
              <Checkbox
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                label={
                  <>
                    Принимаю условия{" "}
                    <a href="#" className={styles.link}>
                      Пользовательского соглашения
                    </a>
                    ,{" "}
                    <a href="#" className={styles.link}>
                      Политики конфиденциальности
                    </a>{" "}
                    и{" "}
                    <a href="#" className={styles.link}>
                      Обработки и распространения персональных данных
                    </a>
                  </>
                }
              />
            </div>
            <button
              className={`${styles.primaryButton} ${
                !agreeTerms ? styles.disabled : ""
              }`}
              onClick={handleCreateAccount}
              disabled={!agreeTerms}
            >
              Создать аккаунт
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => setStep("phone")}
            >
              Назад
            </button>
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
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <HiXMark />
        </button>
        {renderContent()}
      </div>
    </Modal>
  );
};

AuthModal.displayName = "AuthModal";

export default AuthModal;
