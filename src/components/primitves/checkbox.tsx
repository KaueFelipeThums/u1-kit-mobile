import * as React from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootProps = ComponentPropsWithAsChild<typeof Slot.Pressable> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
};

interface RootContext extends RootProps {
  nativeID?: string;
}

const CheckboxContext = React.createContext<RootContext | null>(null);

const Root = ({
  disabled = false,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  nativeID,
  ...props
}: RootProps) => {
  const [checked, onCheckedChange] = useControllableState({
    prop: checkedProp,
    defaultProp: false,
    onChange: onCheckedChangeProp,
  });

  return (
    <CheckboxContext.Provider
      value={{
        disabled,
        checked: checked ?? false,
        onCheckedChange,
        nativeID,
      }}
    >
      <Trigger {...props} />
    </CheckboxContext.Provider>
  );
};

function useCheckboxContext() {
  const context = React.useContext(CheckboxContext);
  if (!context) {
    throw new Error('Checkbox compound components cannot be rendered outside the Checkbox component');
  }
  return context;
}

type SlottablePressableProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Trigger = ({ asChild, onPress: onPressProp, ...props }: SlottablePressableProps) => {
  const { disabled, checked, onCheckedChange, nativeID } = useCheckboxContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled) {
      return;
    }
    const newValue = !checked;
    onCheckedChange?.(newValue);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      nativeID={nativeID}
      aria-disabled={disabled}
      role="checkbox"
      onPress={onPress}
      accessibilityState={{
        checked,
        disabled,
      }}
      disabled={disabled}
      {...props}
    />
  );
};

type IndicatorProps = React.ComponentPropsWithRef<typeof View>;

const Indicator = ({ ...props }: IndicatorProps) => {
  const { checked, disabled } = useCheckboxContext();

  if (!checked) {
    return null;
  }

  return <View aria-disabled={disabled} aria-hidden={!checked} role={'presentation'} {...props} />;
};

type IndicatorContentProps = React.ComponentPropsWithRef<typeof View>;

const IndicatorContent = ({ ...props }: IndicatorContentProps) => {
  return <View role="presentation" {...props} />;
};

export { Indicator, Root, IndicatorContent, useCheckboxContext };
