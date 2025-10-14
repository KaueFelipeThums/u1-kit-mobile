import * as React from 'react';
import {
  Pressable as RNPressable,
  StyleSheet,
  type PressableStateCallbackType,
  type ImageStyle as RNImageStyle,
  type PressableProps as RNPressableProps,
  type StyleProp,
} from 'react-native';

const Pressable = ({ ref, ...props }: React.ComponentPropsWithRef<typeof RNPressable>) => {
  const { children, ...pressableSlotProps } = props;

  if (!React.isValidElement(children)) {
    console.log('Slot.Pressable - Invalid asChild element', children);
    return null;
  }

  return React.cloneElement<React.ComponentPropsWithRef<typeof RNPressable>>(
    isTextChildren(children) ? <></> : children,
    {
      ...mergeProps(pressableSlotProps, children.props as any),
      ref: ref ? composeRefs(ref, (children as any).ref) : (children as any).ref,
    },
  );
};

export { Pressable };

function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as React.RefObject<T>).current = node;
      }
    });
}

type AnyProps = Record<string, any>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = combineStyles(slotPropValue, childPropValue);
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
}

type PressableStyle = RNPressableProps['style'];
type ImageStyle = StyleProp<RNImageStyle>;
type Style = PressableStyle | ImageStyle;

function combineStyles(slotStyle?: Style, childValue?: Style) {
  if (typeof slotStyle === 'function' && typeof childValue === 'function') {
    return (state: PressableStateCallbackType) => {
      return StyleSheet.flatten([slotStyle(state), childValue(state)]);
    };
  }
  if (typeof slotStyle === 'function') {
    return (state: PressableStateCallbackType) => {
      return childValue ? StyleSheet.flatten([slotStyle(state), childValue]) : slotStyle(state);
    };
  }
  if (typeof childValue === 'function') {
    return (state: PressableStateCallbackType) => {
      return slotStyle ? StyleSheet.flatten([slotStyle, childValue(state)]) : childValue(state);
    };
  }

  return StyleSheet.flatten([slotStyle, childValue].filter(Boolean));
}

export function isTextChildren(children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)) {
  return Array.isArray(children) ? children.every((child) => typeof child === 'string') : typeof children === 'string';
}
