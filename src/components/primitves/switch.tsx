import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootProps = ComponentPropsWithAsChild<typeof Slot.Pressable> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const Root = ({
  asChild,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  disabled,
  onPress: onPressProp,
  'aria-valuetext': ariaValueText,
  ...props
}: RootProps) => {
  const [checked, onCheckedChange] = useControllableState({
    prop: checkedProp,
    defaultProp: false,
    onChange: onCheckedChangeProp,
  });

  function onPress(ev: GestureResponderEvent) {
    if (disabled) {
      return;
    }
    onCheckedChange(!checked);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      aria-disabled={disabled}
      role="switch"
      aria-valuetext={(ariaValueText ?? checked) ? 'on' : 'off'}
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

type ThumbProps = React.ComponentPropsWithRef<typeof View>;

const Thumb = ({ ...props }: ThumbProps) => {
  return <View role="presentation" {...props} />;
};

export { Root, Thumb };
