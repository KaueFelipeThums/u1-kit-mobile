import React, { ReactNode } from 'react';
import { InputMask as BaseInputMask, InputMaskInput } from '@/components/ui/input-mask';

type InputMaskProps = {
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
} & Pick<React.ComponentProps<typeof BaseInputMask>, 'value' | 'disabled' | 'mask' | 'onChangeText' | 'style'> &
  Omit<React.ComponentPropsWithRef<typeof InputMaskInput>, 'value' | 'style' | 'onChangeText'>;

const InputMask = ({
  value,
  mask,
  disabled,
  onChangeText,
  leftAdornment,
  rightAdornment,
  placeholder = 'dd/mm/aaaa',
  style,
  ...props
}: InputMaskProps) => {
  return (
    <BaseInputMask value={value} mask={mask} disabled={disabled} onChangeText={onChangeText} style={style}>
      {leftAdornment}
      <InputMaskInput placeholder={placeholder} {...props} />
      {rightAdornment}
    </BaseInputMask>
  );
};

export { InputMask };
