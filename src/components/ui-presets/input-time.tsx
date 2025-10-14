import React, { ReactNode } from 'react';
import { InputTime as BaseInputTime, InputTimeIndicator, InputTimeInput } from '@/components/ui/input-time';

type InputTimeProps = {
  leftAdornment?: ReactNode;
} & Pick<
  React.ComponentProps<typeof BaseInputTime>,
  'value' | 'minTime' | 'maxTime' | 'disabled' | 'onValueChange' | 'style'
> &
  Omit<React.ComponentPropsWithRef<typeof InputTimeInput>, 'value' | 'style'>;

const InputTime = ({
  value,
  minTime,
  maxTime,
  disabled,
  onValueChange,
  placeholder = 'hh:mm',
  leftAdornment,
  style,
  ...props
}: InputTimeProps) => {
  return (
    <BaseInputTime
      value={value}
      minTime={minTime}
      maxTime={maxTime}
      disabled={disabled}
      onValueChange={onValueChange}
      style={style}
    >
      {leftAdornment}
      <InputTimeInput placeholder={placeholder} {...props} />
      <InputTimeIndicator />
    </BaseInputTime>
  );
};

export { InputTime };
