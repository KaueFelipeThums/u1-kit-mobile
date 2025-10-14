import React, { useCallback } from 'react';
import { TextInput } from 'react-native';
import { formatNumber } from '@/functions/format-mask';
import { useControllableState } from '@/hooks/use-controllable-state';

type RootContext = {
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
};

const NumberContext = React.createContext<RootContext | null>(null);

type RootProps = {
  value?: string;
  separator?: string;
  decimals?: number;
  disabled?: boolean;
  onChangeText?: (value: string) => void;
  children?: React.ReactNode;
};

const Root = ({
  value: valueProp,
  separator = ',',
  decimals = 2,
  onChangeText: onChangeTextProp,
  disabled = false,
  children,
}: RootProps) => {
  const [value, onChangeText] = useControllableState({
    prop: valueProp && formatNumber(valueProp ?? '', { decimalSeparator: separator, decimals }),
    defaultProp: '',
    onChange: onChangeTextProp,
  });

  const handleTextChange = useCallback(
    (raw: string) => {
      const masked = formatNumber(raw, { decimalSeparator: separator, decimals });
      onChangeText(masked);
    },
    [onChangeText, separator, decimals],
  );

  return (
    <NumberContext.Provider
      value={{
        value: value || '',
        onChangeText: handleTextChange,
        disabled,
      }}
    >
      {children}
    </NumberContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(NumberContext);
  if (!context) {
    throw new Error('NumberInput components must be used within a NumberRoot');
  }
  return context;
}

type InputProps = Omit<
  React.ComponentPropsWithRef<typeof TextInput>,
  'value' | 'onChangeText' | 'maxLength' | 'keyboardType'
>;
const Input = ({ placeholder, editable, ...rest }: InputProps) => {
  const { value, onChangeText, disabled } = useRootContext();
  return (
    <TextInput
      {...rest}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={editable && !disabled}
    />
  );
};

export { Root, Input, useRootContext };
