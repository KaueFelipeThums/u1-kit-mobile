import * as React from 'react';
import { Pressable, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootProps = ComponentPropsWithAsChild<typeof Slot.Pressable> & {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  disabled?: boolean;
};

const Root = ({ asChild, pressed, onPressedChange, disabled, onPress: onPressProp, ...props }: RootProps) => {
  function onPress(ev: GestureResponderEvent) {
    if (disabled) {
      return;
    }
    const newValue = !pressed;
    onPressedChange(newValue);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      aria-disabled={disabled}
      role="switch"
      aria-selected={pressed}
      onPress={onPress}
      accessibilityState={{
        selected: pressed,
        disabled,
      }}
      disabled={disabled}
      {...props}
    />
  );
};

export { Root };
