import { ReactElement, ReactNode } from 'react';
import { CheckboxGroup as BaseCheckboxGroup, CheckboxGroupItem } from '@/components/ui/checkbox-group';
import { Text } from '@/components/ui/text';

type CheckboxGroupOptionProps = {
  label: ReactNode | string;
  value: string;
  disabled?: boolean;
};

type CheckboxGroupProps = React.ComponentProps<typeof BaseCheckboxGroup> & {
  options: CheckboxGroupOptionProps[];
};

const CheckboxGroup = ({ options, ...props }: CheckboxGroupProps): ReactElement => {
  return (
    <BaseCheckboxGroup {...props}>
      {options.map(({ label, value, disabled }) => (
        <CheckboxGroupItem key={value} value={value} disabled={disabled}>
          {typeof label === 'string' ? <Text>{label}</Text> : label}
        </CheckboxGroupItem>
      ))}
    </BaseCheckboxGroup>
  );
};

export { CheckboxGroup, type CheckboxGroupOptionProps };
