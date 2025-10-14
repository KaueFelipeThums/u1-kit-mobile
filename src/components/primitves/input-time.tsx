import { format, parse, isValid as isValidDate } from 'date-fns';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData } from 'react-native';
import { useControllableState } from '@/hooks/use-controllable-state';

const formatTimeMasked = (raw: string): string => {
  const numbers = raw.replace(/\D/g, '');
  return numbers.replace(/^(\d{0,2})(\d{0,2})?/, (_, h = '', m = '') => {
    const parts = [h, m].filter(Boolean);
    return parts.map((part, i) => (i > 0 ? `:${part}` : part)).join('');
  });
};

type RootContext = {
  inputValue: string;
  minTime?: Date;
  maxTime?: Date;
  onInputChange: (value: string) => void;
  onInputBlur: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  isValid: boolean;
  disabled?: boolean;
};

const TimeContext = React.createContext<RootContext | null>(null);

type RootProps = {
  value?: Date | null;
  minTime?: Date;
  maxTime?: Date;
  disabled?: boolean;
  onValueChange?: (date: Date | null) => void;
  children?: React.ReactNode;
};

const Root = ({
  value: valueProp = null,
  onValueChange: onValueChangeProp,
  minTime,
  maxTime,
  disabled = false,
  children,
}: RootProps) => {
  const [value, onValueChange] = useControllableState({
    prop: valueProp,
    defaultProp: null,
    onChange: onValueChangeProp,
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const isEditing = useRef(false);

  const timeToMinutes = useCallback((date: Date) => date.getHours() * 60 + date.getMinutes(), []);
  const checkIsValid = useCallback(
    (date: Date) => {
      if (!isValidDate(date)) return false;
      const mins = timeToMinutes(date);
      if (minTime && mins < timeToMinutes(minTime)) return false;
      if (maxTime && mins > timeToMinutes(maxTime)) return false;
      return true;
    },
    [minTime, maxTime, timeToMinutes],
  );

  useEffect(() => {
    if (isEditing.current) return;
    if (value instanceof Date && checkIsValid(value)) {
      setInputValue(format(value, 'HH:mm'));
      setIsValid(true);
    } else if (value === null) {
      setInputValue('');
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [value, checkIsValid]);

  const handleTextChange = useCallback(
    (raw: string) => {
      isEditing.current = true;
      const masked = formatTimeMasked(raw);
      setInputValue(masked);
      if (masked.length === 5) {
        const parsed = parse(masked, 'HH:mm', new Date());
        const ok = checkIsValid(parsed);
        setIsValid(ok);
        onValueChange(ok ? parsed : null);
      } else {
        setIsValid(true);
        onValueChange(null);
      }
    },
    [onValueChange, checkIsValid],
  );

  const handleBlur = useCallback(() => {
    isEditing.current = false;
    if (value instanceof Date && checkIsValid(value)) {
      setInputValue(format(value, 'HH:mm'));
      setIsValid(true);
    } else if (value === null) {
      setInputValue('');
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [value, checkIsValid]);

  return (
    <TimeContext.Provider
      value={{
        inputValue,
        onInputChange: handleTextChange,
        onInputBlur: handleBlur,
        minTime,
        maxTime,
        isValid,
        disabled,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(TimeContext);
  if (!context) {
    throw new Error('TimeInput components must be used within a TimeRoot');
  }
  return context;
}

type InputProps = Omit<
  React.ComponentPropsWithRef<typeof TextInput>,
  'value' | 'onChangeText' | 'maxLength' | 'keyboardType'
>;
const Input = ({ onBlur, placeholder, editable, ...rest }: InputProps) => {
  const { inputValue, onInputChange, onInputBlur, disabled } = useRootContext();
  return (
    <TextInput
      {...rest}
      value={inputValue}
      onChangeText={onInputChange}
      onBlur={(e) => {
        onInputBlur(e);
        onBlur?.(e);
      }}
      keyboardType="numeric"
      maxLength={5}
      placeholder={placeholder || 'hh:mm'}
      editable={editable && !disabled}
    />
  );
};

export { Root, Input, useRootContext };
