import React, { ReactNode, useState } from 'react';
import {
  InputBase,
  InputBaseAdornment,
  InputBaseAdornmentButton,
  InputBaseAdornmentButtonIcon,
  InputBaseInput,
} from '@/components/ui/input';

type InputPasswordProps = {
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
} & Omit<React.ComponentPropsWithRef<typeof InputBaseInput>, 'style' | 'secureTextEntry'> &
  Pick<React.ComponentProps<typeof InputBase>, 'style' | 'disabled'>;

const InputPassword = ({ disabled, leftAdornment, style, ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <InputBase disabled={disabled} style={style}>
      {leftAdornment}
      <InputBaseInput secureTextEntry={!showPassword} {...props} />
      <InputBaseAdornment>
        <InputBaseAdornmentButton onPress={() => setShowPassword((state) => !state)}>
          <InputBaseAdornmentButtonIcon name={showPassword ? 'EyeOff' : 'Eye'} />
        </InputBaseAdornmentButton>
      </InputBaseAdornment>
    </InputBase>
  );
};

export { InputPassword, type InputPasswordProps };
