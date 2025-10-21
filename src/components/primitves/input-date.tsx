import { formatDate, isValid as isValidDate, parse } from 'date-fns';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { useControllableState } from '@/hooks/use-controllable-state';

const formatMasked = (raw: string, format: string): string => {
  const numbers = raw.replace(/\D/g, '');
  if (format === 'dd/MM/yyyy') {
    return numbers.replace(/^(\d{0,2})(\d{0,2})?(\d{0,4})?/, (_, d, m, y) =>
      [d, m, y]
        .filter(Boolean)
        .map((part, i) => (i > 0 ? `/${part}` : part))
        .join(''),
    );
  } else {
    // yyyy-MM-dd
    return numbers.replace(/^(\d{0,4})(\d{0,2})?(\d{0,2})?/, (_, y, m, d) =>
      [y, m, d]
        .filter(Boolean)
        .map((part, i) => (i > 0 ? `-${part}` : part))
        .join(''),
    );
  }
};

type RootContext = {
  inputValue: string;
  minDate?: Date;
  maxDate?: Date;
  dateFormat: SupportedFormats;
  onInputChange: (value: string) => void;
  onInputBlur: () => void;
  isValid: boolean;
  disabled?: boolean;
};

const RootContext = React.createContext<RootContext | null>(null);

type SupportedFormats = 'dd/MM/yyyy' | 'yyyy-MM-dd';

type RootProps = {
  value?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  dateFormat?: SupportedFormats;
  onValueChange?: (date: Date | null) => void;
  children?: React.ReactNode;
};

const Root = ({
  value: valueProp,
  onValueChange: onValueChangeProp,
  minDate,
  maxDate,
  disabled,
  dateFormat = 'dd/MM/yyyy',
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

  const checkIsValid = React.useCallback(
    (date: Date) => isValidDate(date) && (!minDate || date >= minDate) && (!maxDate || date <= maxDate),
    [minDate, maxDate],
  );

  useEffect(() => {
    if (isEditing.current) return;
    if (value instanceof Date && checkIsValid(value)) {
      setInputValue(formatDate(value, dateFormat));
      setIsValid(true);
    } else if (value === null) {
      setInputValue('');
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [value, dateFormat, checkIsValid]);

  const handleTextChange = React.useCallback(
    (raw: string) => {
      isEditing.current = true;
      const masked = formatMasked(raw, dateFormat);
      setInputValue(masked);

      if (masked.length >= 7 && masked.length <= 10) {
        const parsed = parse(masked, dateFormat, new Date());
        const ok = checkIsValid(parsed);
        setIsValid(ok);
        onValueChange?.(ok ? parsed : null);
      } else {
        setIsValid(true);
        onValueChange?.(null);
      }
    },
    [onValueChange, checkIsValid, dateFormat],
  );

  const handleBlur = React.useCallback(() => {
    isEditing.current = false;

    if (value instanceof Date && checkIsValid(value)) {
      setInputValue(formatDate(value, dateFormat));
      setIsValid(true);
    } else if (value === null) {
      setInputValue('');
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [value, dateFormat, checkIsValid]);

  return (
    <RootContext.Provider
      value={{
        inputValue,
        onInputChange: handleTextChange,
        onInputBlur: handleBlur,
        minDate,
        maxDate,
        dateFormat,
        isValid,
        disabled,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(RootContext);
  if (!context) {
    throw new Error('InputDate compound components cannot be rendered outside the InputDate component');
  }
  return context;
}

type InputProps = Omit<
  React.ComponentPropsWithRef<typeof TextInput>,
  'value' | 'onChangeText' | 'maxLength' | 'keyboardType'
>;

const Input = ({ onBlur, placeholder, editable, ...rest }: InputProps) => {
  const { inputValue, onInputBlur: handleBlur, onInputChange: handleTextChange, disabled } = useRootContext();

  return (
    <TextInput
      {...rest}
      onBlur={(event) => {
        handleBlur();
        onBlur?.(event);
      }}
      editable={editable || !disabled}
      keyboardType="numeric"
      placeholder={placeholder}
      maxLength={10}
      value={inputValue}
      onChangeText={handleTextChange}
    />
  );
};

export { Root, useRootContext, Input };
