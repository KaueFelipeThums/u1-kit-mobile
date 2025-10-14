import * as React from 'react';
import { Pressable, Text as RNText, ViewProps } from 'react-native';
import * as Slot from './slot';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type SlottablePressableProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

type RootProps = Omit<SlottablePressableProps, 'children' | 'hitSlop' | 'style'> &
  Pick<ViewProps, 'style' | 'children'>;

const Root = ({ asChild, ...props }: RootProps) => {
  const Component = asChild ? Slot.Pressable : Pressable;
  return <Component {...props} />;
};

type TextProps = React.ComponentPropsWithRef<typeof RNText>;

const Text = ({ ...props }: TextProps) => {
  return <RNText {...props} />;
};

export { Root, Text };
