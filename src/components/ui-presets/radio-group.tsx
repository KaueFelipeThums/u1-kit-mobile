import { ReactElement, ReactNode } from 'react';
import { RadioGroup as BaseRadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Text } from '@/components/ui/text';

type RadioGroupOptionProps = {
  label: ReactNode | string;
  value: string;
  disabled?: boolean;
};

type RadioGroupProps = React.ComponentProps<typeof BaseRadioGroup> & {
  options: RadioGroupOptionProps[];
};

const RadioGroup = ({ options, ...props }: RadioGroupProps): ReactElement => {
  return (
    <BaseRadioGroup {...props}>
      {options.map(({ label, value, disabled }) => (
        <RadioGroupItem key={value} value={value} disabled={disabled}>
          {typeof label === 'string' ? <Text>{label}</Text> : label}
        </RadioGroupItem>
      ))}
    </BaseRadioGroup>
  );
};

export { RadioGroup, type RadioGroupOptionProps };
