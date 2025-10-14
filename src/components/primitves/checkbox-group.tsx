import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onValueChange?: (val: string[]) => void;
  disabled?: boolean;
};

const CheckboxGroupContext = React.createContext<RootProps | null>(null);

const Root = ({
  value: valueProp,
  onValueChange: onValueChangeProp,
  defaultValue,
  disabled = false,
  ...viewProps
}: RootProps) => {
  const [value, onValueChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProp,
  });

  return (
    <CheckboxGroupContext.Provider
      value={{
        value,
        disabled,
        onValueChange,
      }}
    >
      <View role="checkbox" {...viewProps} />
    </CheckboxGroupContext.Provider>
  );
};

function useCheckboxGroupContext() {
  const context = React.useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error('CheckboxGroup compound components cannot be rendered outside the CheckboxGroup component');
  }
  return context;
}

interface CheckboxItemContext {
  itemValue: string;
}

const CheckboxItemContext = React.createContext<CheckboxItemContext | null>(null);

type ItemProps = ComponentPropsWithAsChild<typeof Slot.Pressable> & {
  value: string;
};

const Item = ({
  asChild,
  value: itemValue,
  disabled: disabledProp = false,
  onPress: onPressProp,
  ...props
}: ItemProps) => {
  const { disabled, value, onValueChange } = useCheckboxGroupContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled || disabledProp) {
      return;
    }

    const isChecked = value?.includes(itemValue);
    const currentValue = value ?? [];

    const updatedValues = isChecked ? currentValue?.filter((v) => v !== itemValue) : [...currentValue, itemValue];

    onValueChange?.(updatedValues);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <CheckboxItemContext.Provider
      value={{
        itemValue: itemValue,
      }}
    >
      <Component
        role="checkbox"
        onPress={onPress}
        disabled={(disabled || disabledProp) ?? false}
        accessibilityState={{
          disabled: (disabled || disabledProp) ?? false,
          checked: value?.includes(itemValue),
        }}
        {...props}
      />
    </CheckboxItemContext.Provider>
  );
};

function useCheckboxItemContext() {
  const context = React.useContext(CheckboxItemContext);
  if (!context) {
    throw new Error('CheckboxItem compound components cannot be rendered outside the CheckboxItem component');
  }
  return context;
}

type IndicatorProps = React.ComponentPropsWithRef<typeof View>;

const Indicator = ({ ...props }: IndicatorProps) => {
  const { value } = useCheckboxGroupContext();
  const { itemValue } = useCheckboxItemContext();

  if (!value?.includes(itemValue)) {
    return null;
  }
  return <View role="presentation" {...props} />;
};

type IndicatorContentProps = React.ComponentPropsWithRef<typeof View>;

const IndicatorContent = ({ ...props }: IndicatorContentProps) => {
  return <View role="presentation" {...props} />;
};

export { Indicator, IndicatorContent, Item, Root, useCheckboxGroupContext, useCheckboxItemContext };
