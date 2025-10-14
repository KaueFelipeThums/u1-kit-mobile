import React, { ReactNode } from 'react';
import { InputNumber as BaseInputNumber, InputNumberInput } from '@/components/ui/input-number';

type InputNumberProps = {
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
} & Pick<
  React.ComponentProps<typeof BaseInputNumber>,
  'value' | 'disabled' | 'separator' | 'decimals' | 'onChangeText' | 'style'
> &
  Omit<React.ComponentPropsWithRef<typeof InputNumberInput>, 'value' | 'style' | 'onChangeText'>;

const InputNumber = ({
  value,
  separator,
  disabled,
  onChangeText,
  decimals,
  leftAdornment,
  rightAdornment,
  placeholder,
  style,
  ...props
}: InputNumberProps) => {
  return (
    <BaseInputNumber
      value={value}
      separator={separator}
      decimals={decimals}
      disabled={disabled}
      onChangeText={onChangeText}
      style={style}
    >
      {leftAdornment}
      <InputNumberInput placeholder={placeholder} {...props} />
      {rightAdornment}
    </BaseInputNumber>
  );
};

export { InputNumber };
