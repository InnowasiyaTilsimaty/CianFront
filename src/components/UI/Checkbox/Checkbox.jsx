'use client';

import React, { forwardRef } from 'react';
import styles from './checkbox.module.scss';

const Checkbox = forwardRef(({ 
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  name,
  value,
  ...props 
}, ref) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          checked: !checked,
          value: value || e.target.value
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleChange(e);
    }
  };

  return (
    <div className={`${styles.checkboxWrapper} ${className} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.checkboxContainer}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.checkboxInput}
          aria-checked={checked}
          {...props}
        />
        <div
          className={`${styles.checkbox} ${checked ? styles.checked : ''}`}
          onClick={handleChange}
          onKeyDown={handleKeyDown}
          role="checkbox"
          tabIndex={disabled ? -1 : 0}
          aria-checked={checked}
        >
          {checked && (
            <svg
              className={styles.checkmark}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        {label && (
          <label
            htmlFor={id}
            className={styles.checkboxLabel}
            onClick={handleChange}
          >
            {label}
          </label>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;

