import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = React.createContext<RootProps | null>(null);

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
    <RadioGroupContext.Provider
      value={{
        value,
        disabled,
        onValueChange,
      }}
    >
      <View role="radiogroup" {...viewProps} />
    </RadioGroupContext.Provider>
  );
};

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroup compound components cannot be rendered outside the RadioGroup component');
  }
  return context;
}

interface RadioItemContext {
  itemValue: string | undefined;
}

const RadioItemContext = React.createContext<RadioItemContext | null>(null);

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
  const { disabled, value, onValueChange } = useRadioGroupContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled || disabledProp) {
      return;
    }
    onValueChange?.(itemValue);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <RadioItemContext.Provider
      value={{
        itemValue: itemValue,
      }}
    >
      <Component
        role="radio"
        onPress={onPress}
        disabled={(disabled || disabledProp) ?? false}
        accessibilityState={{
          disabled: (disabled || disabledProp) ?? false,
          checked: value === itemValue,
        }}
        {...props}
      />
    </RadioItemContext.Provider>
  );
};

function useRadioItemContext() {
  const context = React.useContext(RadioItemContext);
  if (!context) {
    throw new Error('RadioItem compound components cannot be rendered outside the RadioItem component');
  }
  return context;
}

type IndicatorProps = React.ComponentPropsWithRef<typeof View>;

const Indicator = ({ ...props }: IndicatorProps) => {
  const { value } = useRadioGroupContext();
  const { itemValue } = useRadioItemContext();

  if (value !== itemValue) {
    return null;
  }
  return <View role="presentation" {...props} />;
};

type IndicatorContentProps = React.ComponentPropsWithRef<typeof View>;

const IndicatorContent = ({ ...props }: IndicatorContentProps) => {
  return <View role="presentation" {...props} />;
};

export { Indicator, IndicatorContent, Item, Root, useRadioGroupContext, useRadioItemContext };
