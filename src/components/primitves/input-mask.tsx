import React, { useCallback, useMemo } from 'react';
import { TextInput } from 'react-native';
import { formatCEP, formatCNPJ, formatCPF, formatPhone } from '@/functions/format-mask';
import { useControllableState } from '@/hooks/use-controllable-state';

type MaskType = 'cpf' | 'cnpj' | 'phone' | 'cep';

const formatByType: Record<MaskType, (value: string) => string> = {
  cpf: formatCPF,
  cnpj: formatCNPJ,
  phone: formatPhone,
  cep: formatCEP,
};

type RootContext = {
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
};

const MaskContext = React.createContext<RootContext | null>(null);

type RootProps = {
  value?: string;
  mask: MaskType;
  disabled?: boolean;
  onChangeText?: (value: string) => void;
  children?: React.ReactNode;
};

const Root = ({ value: valueProp, mask, onChangeText: onChangeTextProp, disabled = false, children }: RootProps) => {
  const formatter = useMemo(() => formatByType[mask], [mask]);

  const [value, onChangeText] = useControllableState({
    prop: valueProp && formatter(valueProp ?? ''),
    defaultProp: '',
    onChange: onChangeTextProp,
  });

  const handleTextChange = useCallback(
    (raw: string) => {
      const masked = formatter(raw);
      onChangeText(masked);
    },
    [onChangeText, formatter],
  );

  return (
    <MaskContext.Provider
      value={{
        value: value || '',
        onChangeText: handleTextChange,
        disabled,
      }}
    >
      {children}
    </MaskContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(MaskContext);
  if (!context) {
    throw new Error('MaskInput components must be used within a MaskRoot');
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
