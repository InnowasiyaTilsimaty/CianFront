'use client';

import React from 'react';
import styles from './divider.module.scss';

const Divider = ({ 
  className = '',
  orientation = 'horizontal',
  spacing = 'default',
  ...props 
}) => {
  return (
    <div
      className={`${styles.divider} ${styles[orientation]} ${styles[spacing]} ${className}`}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
};

Divider.displayName = 'Divider';

export default Divider;

