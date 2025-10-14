import React, { ReactNode } from 'react';
import { InputDate as BaseInputDate, InputDateIndicator, InputDateInput } from '@/components/ui/input-date';

type InputDateProps = {
  leftAdornment?: ReactNode;
} & Pick<
  React.ComponentProps<typeof BaseInputDate>,
  'value' | 'minDate' | 'maxDate' | 'disabled' | 'dateFormat' | 'onValueChange' | 'style'
> &
  Omit<React.ComponentPropsWithRef<typeof InputDateInput>, 'value' | 'style'>;

const InputDate = ({
  value,
  minDate,
  maxDate,
  disabled,
  dateFormat,
  leftAdornment,
  onValueChange,
  placeholder = 'dd/mm/aaaa',
  style,
  ...props
}: InputDateProps) => {
  return (
    <BaseInputDate
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      dateFormat={dateFormat}
      onValueChange={onValueChange}
      style={style}
    >
      {leftAdornment}
      <InputDateInput placeholder={placeholder} {...props} />
      <InputDateIndicator />
    </BaseInputDate>
  );
};

export { InputDate };
