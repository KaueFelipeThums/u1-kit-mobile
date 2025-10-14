import React, { ReactNode } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { InputBase, InputBaseInput } from '@/components/ui/input';

type InputTextProps = {
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  inputStyle?: StyleProp<TextStyle>;
} & Omit<React.ComponentPropsWithRef<typeof InputBaseInput>, 'style'> &
  Pick<React.ComponentProps<typeof InputBase>, 'style' | 'disabled'>;

const InputText = ({ disabled, leftAdornment, rightAdornment, style, inputStyle, ...props }: InputTextProps) => {
  return (
    <InputBase disabled={disabled} style={style}>
      {leftAdornment}
      <InputBaseInput style={inputStyle} {...props} />
      {rightAdornment}
    </InputBase>
  );
};

export { InputText, type InputTextProps };
