'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './select.module.scss';
import Checkbox from '@/components/UI/Checkbox';
import Divider from '@/components/UI/Divider';

const Select = ({ 
  children, 
  className = '', 
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  multiple = false,
  buttonLayout = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || (multiple ? [] : ''));
  const [selectedOptions, setSelectedOptions] = useState(multiple ? [] : []);
  const wrapperRef = useRef(null);
  const initializedRef = useRef(false);

  // Инициализация: находим опции с checked={true} по умолчанию
  useEffect(() => {
    if (initializedRef.current || value !== undefined) return;
    
    if (multiple && children) {
      const defaultSelected = [];
      let foundDivider = false;
      
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && (child.type === Divider || child.type?.displayName === 'Divider')) {
          foundDivider = true;
          return;
        }

        if (child.type === 'option') {
          const optionChildren = child.props.children;
          const childrenArray = React.Children.toArray(optionChildren);
          
          const checkboxIndex = childrenArray.findIndex(
            item => React.isValidElement(item) && (item.type === Checkbox || item.type?.displayName === 'Checkbox')
          );
          
          if (checkboxIndex !== -1) {
            const checkbox = childrenArray[checkboxIndex];
            if (checkbox.props?.checked === true) {
              // Извлекаем текст опции
              const optionText = childrenArray
                .filter((item, idx) => idx !== checkboxIndex)
                .map(item => {
                  if (typeof item === 'string') return item;
                  if (React.isValidElement(item) && item.props?.children) {
                    return typeof item.props.children === 'string' ? item.props.children : '';
                  }
                  return '';
                })
                .join('')
                .trim();
              
              if (optionText) {
                defaultSelected.push(optionText);
              }
            }
          }
        }
      });
      
      if (defaultSelected.length > 0) {
        setSelectedOptions(defaultSelected);
        setSelectedValue(defaultSelected);
      } else if (!buttonLayout) {
        // Если нет опций с checked={true} и это не buttonLayout, выбираем первую опцию
        React.Children.forEach(children, (child) => {
          if (child.type === 'option' && defaultSelected.length === 0) {
            const optionChildren = child.props.children;
            const childrenArray = React.Children.toArray(optionChildren);
            
            const checkboxIndex = childrenArray.findIndex(
              item => React.isValidElement(item) && (item.type === Checkbox || item.type?.displayName === 'Checkbox')
            );
            
            let optionText = '';
            if (checkboxIndex !== -1) {
              optionText = childrenArray
                .filter((item, idx) => idx !== checkboxIndex)
                .map(item => {
                  if (typeof item === 'string') return item;
                  if (React.isValidElement(item) && item.props?.children) {
                    return typeof item.props.children === 'string' ? item.props.children : '';
                  }
                  return '';
                })
                .join('')
                .trim();
            } else {
              optionText = typeof optionChildren === 'string' 
                ? optionChildren 
                : childrenArray
                    .map(item => typeof item === 'string' ? item : '')
                    .join('')
                    .trim();
            }
            
            if (optionText) {
              defaultSelected.push(optionText);
            }
          }
        });
        
        if (defaultSelected.length > 0) {
          setSelectedOptions(defaultSelected);
          setSelectedValue(defaultSelected);
        }
      }
    }
    
    initializedRef.current = true;
  }, [children, multiple, value, buttonLayout]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue, optionText, hasCheckbox = false, event) => {
    if (multiple) {
      // Множественный выбор - не закрываем dropdown
      event?.stopPropagation();
      
      const isCurrentlySelected = selectedOptions.includes(optionText);
      let newSelected;
      
      if (isCurrentlySelected) {
        // Пытаемся снять выбор
        // Для buttonLayout разрешаем снять все опции, для остальных - минимум 1
        if (!buttonLayout && selectedOptions.length <= 1) {
          // Не позволяем снять последнюю опцию (только для не-buttonLayout)
          return;
        }
        newSelected = selectedOptions.filter(item => item !== optionText);
      } else {
        // Добавляем опцию
        newSelected = [...selectedOptions, optionText];
      }
      
      setSelectedOptions(newSelected);
      setSelectedValue(newSelected);
      
      if (onChange) {
        onChange({
          target: {
            value: newSelected,
            text: buttonLayout ? formatButtonLayoutValue(newSelected) : newSelected.join(', ')
          }
        });
      }
    } else {
      // Одиночный выбор - закрываем dropdown
      setSelectedValue(optionText);
      setIsOpen(false);
      if (onChange) {
        onChange({
          target: {
            value: optionValue,
            text: optionText
          }
        });
      }
    }
  };

  const formatButtonLayoutValue = (values) => {
    if (!Array.isArray(values) || values.length === 0) return '';
    
    // Разделяем на числа (кнопки) и чекбоксы
    const buttonValues = [];
    const checkboxValues = [];
    
    values.forEach(val => {
      // Проверяем, является ли значение числом (кнопкой)
      // Может быть "1-комнатную" или просто "1", "6+" и т.д.
      const matchWithSuffix = val.match(/^(\d+\+?)-комнатную$/);
      const matchSimple = val.match(/^(\d+\+?)\s*$/);
      
      if (matchWithSuffix) {
        buttonValues.push(matchWithSuffix[1]);
      } else if (matchSimple) {
        buttonValues.push(matchSimple[1].trim());
      } else {
        // Это чекбокс (Студия, Свободная планировка и т.д.)
        checkboxValues.push(val);
      }
    });
    
    let result = '';
    
    // Форматируем кнопки (числа)
    if (buttonValues.length > 0) {
      const sortedNumbers = buttonValues.sort((a, b) => {
        const numA = parseInt(a.replace('+', ''));
        const numB = parseInt(b.replace('+', ''));
        return numA - numB;
      });
      
      // Если все числа выбраны (1-6+), показываем "1 - 6+ комн."
      if (sortedNumbers.length === 6 && 
          sortedNumbers[0] === '1' && 
          sortedNumbers[5] === '6+') {
        result = '1 - 6+ комн.';
      } else if (sortedNumbers.length >= 4) {
        // Если выбрано много опций, ищем непрерывный диапазон в конце
        const last = sortedNumbers[sortedNumbers.length - 1];
        let rangeStartIndex = sortedNumbers.length - 1;
        
        // Ищем начало непрерывного диапазона с конца
        for (let i = sortedNumbers.length - 2; i >= 0; i--) {
          const current = parseInt(sortedNumbers[i].replace('+', ''));
          const next = parseInt(sortedNumbers[i + 1].replace('+', ''));
          if (next - current === 1 || (sortedNumbers[i + 1] === '6+' && current === 5)) {
            rangeStartIndex = i;
          } else {
            break;
          }
        }
        
        // Если есть диапазон из 3+ элементов, показываем первые отдельно, затем диапазон
        if (rangeStartIndex < sortedNumbers.length - 2) {
          const beforeRange = sortedNumbers.slice(0, rangeStartIndex);
          const rangeStart = sortedNumbers[rangeStartIndex];
          if (beforeRange.length > 0) {
            result = `${beforeRange.join(', ')}, ${rangeStart} - ${last} к...`;
          } else {
            result = `${rangeStart} - ${last} к...`;
          }
        } else {
          // Нет явного диапазона, показываем все через запятую
          result = sortedNumbers.join(', ') + ' к...';
        }
      } else {
        // Если выбрано немного, показываем через запятую с "комнат"
        if (sortedNumbers.length === 1) {
          result = sortedNumbers[0] + ' комнат';
        } else {
          result = sortedNumbers.join(', ') + ' комнат';
        }
      }
    }
    
    // Добавляем чекбоксы, если есть
    if (checkboxValues.length > 0) {
      if (result) {
        result += ', ' + checkboxValues.join(', ');
      } else {
        result = checkboxValues.join(', ');
      }
    }
    
    return result;
  };

  const getDisplayValue = () => {
    if (multiple && Array.isArray(selectedValue)) {
      if (selectedValue.length > 0) {
        if (buttonLayout) {
          return formatButtonLayoutValue(selectedValue);
        }
        return selectedValue.join(', ');
      }
      // Если массив пустой, показываем placeholder
      return placeholder || 'Выберите...';
    }
    if (selectedValue) return selectedValue;
    return placeholder || 'Выберите...';
  };

  const renderOptions = () => {
    if (!children) return null;

    // Для buttonLayout разделяем опции на кнопки и чекбоксы
    if (buttonLayout) {
      const buttonOptions = [];
      const checkboxOptions = [];
      let foundDivider = false;

      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && (child.type === Divider || child.type?.displayName === 'Divider')) {
          foundDivider = true;
          return;
        }

        if (child.type === 'option') {
          const optionChildren = child.props.children;
          const childrenArray = React.Children.toArray(optionChildren);
          const hasCheckbox = childrenArray.some(
            item => React.isValidElement(item) && (item.type === Checkbox || item.type?.displayName === 'Checkbox')
          );

          if (hasCheckbox || foundDivider) {
            checkboxOptions.push(child);
          } else {
            buttonOptions.push(child);
          }
        }
      });

      return (
        <>
          {buttonOptions.length > 0 && (
            <div className={styles.buttonOptionsRow}>
              {buttonOptions.map((child, index) => {
                const optionText = typeof child.props.children === 'string' 
                  ? child.props.children 
                  : React.Children.toArray(child.props.children)
                      .filter(item => typeof item === 'string')
                      .join('')
                      .trim();
                const optionValue = child.props.value || optionText;
                const isSelected = multiple 
                  ? selectedOptions.includes(optionText)
                  : selectedValue === optionText;

                return (
                  <button
                    key={`button-${index}`}
                    type="button"
                    className={`${styles.optionButton} ${isSelected ? styles.selected : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionClick(optionValue, optionText, false, e);
                    }}
                  >
                    {optionText}
                  </button>
                );
              })}
            </div>
          )}
          {checkboxOptions.length > 0 && (
            <div className={styles.checkboxOptions}>
              {checkboxOptions.map((child, index) => {
                // Обработка Divider
                if (React.isValidElement(child) && (child.type === Divider || child.type?.displayName === 'Divider')) {
                  return (
                    <div key={`divider-${index}`} className={styles.selectDivider}>
                      {child}
                    </div>
                  );
                }

                if (child.type === 'option') {
                  return renderOption(child, buttonOptions.length + index);
                }
                return null;
              })}
            </div>
          )}
        </>
      );
    }

    // Обычный рендеринг
    return React.Children.map(children, (child, index) => {
      // Обработка Divider
      if (React.isValidElement(child) && (child.type === Divider || child.type?.displayName === 'Divider')) {
        return (
          <div key={`divider-${index}`} className={styles.selectDivider}>
            {child}
          </div>
        );
      }

      if (child.type === 'option') {
        return renderOption(child, index);
      }
      return child;
    });
  };

  const renderOption = (child, index) => {
    if (child.type !== 'option') return null;

    const optionValue = child.props.value;
    const optionChildren = child.props.children;
    
    // Преобразуем children в массив для обработки
    const childrenArray = React.Children.toArray(optionChildren);
    
    // Проверяем, есть ли Checkbox в children
    const checkboxIndex = childrenArray.findIndex(
      item => React.isValidElement(item) && (item.type === Checkbox || item.type?.displayName === 'Checkbox')
    );
    const hasCheckbox = checkboxIndex !== -1;
    
    // Проверяем, есть ли checked={true} у Checkbox
    let checkboxChecked = false;
    if (hasCheckbox) {
      const checkbox = childrenArray[checkboxIndex];
      checkboxChecked = checkbox.props?.checked === true;
    }
    
    // Извлекаем текст опции (без Checkbox)
    let optionText = '';
    if (hasCheckbox) {
      // Берем все текстовые элементы, пропуская Checkbox
      optionText = childrenArray
        .filter((item, idx) => idx !== checkboxIndex)
        .map(item => {
          if (typeof item === 'string') return item;
          if (React.isValidElement(item) && item.props?.children) {
            return typeof item.props.children === 'string' ? item.props.children : '';
          }
          return '';
        })
        .join('')
        .trim();
    } else {
      // Если нет Checkbox, просто берем текст
      optionText = typeof optionChildren === 'string' 
        ? optionChildren 
        : childrenArray
            .map(item => typeof item === 'string' ? item : '')
            .join('')
            .trim();
    }
    
    const finalValue = optionValue || optionText;
    // Проверяем выбранность: опция в selectedOptions
    const isSelected = multiple 
      ? selectedOptions.includes(optionText)
      : selectedValue === optionText;

    return (
      <div
        key={index}
        className={`${styles.selectOption} ${isSelected ? styles.selected : ''} ${hasCheckbox ? styles.withCheckbox : ''}`}
        onClick={(e) => {
          if (hasCheckbox && multiple) {
            // Для чекбоксов не закрываем dropdown при клике
            e.stopPropagation();
          }
          handleOptionClick(finalValue, optionText, hasCheckbox, e);
        }}
      >
        {hasCheckbox ? (
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              handleOptionClick(finalValue, optionText, hasCheckbox, e);
            }}
            label={optionText}
            id={`select-option-${index}`}
          />
        ) : (
          optionText
        )}
      </div>
    );
  };

  return (
    <div 
      ref={wrapperRef}
      className={`${styles.selectWrapper} ${className} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''} ${isOpen ? styles.open : ''}`}
      {...props}
    >
      <div 
        className={styles.selectTrigger}
        onClick={handleTriggerClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className={styles.selectValue}>
          {getDisplayValue()}
        </div>
        <span className={styles.arrow} aria-hidden="true">
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M6 9L1 4H11L6 9Z" 
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
      <div className={`${styles.selectDropdown} ${isOpen ? styles.open : ''}`}>
        <div className={styles.selectOptions}>
          {renderOptions()}
        </div>
      </div>
    </div>
  );
};

Select.displayName = 'Select';

export default Select;

