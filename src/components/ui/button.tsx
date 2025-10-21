import React from 'react';
import { ActivityIndicator, Pressable, PressableStateCallbackType, StyleSheet, TextStyle } from 'react-native';
import { Icon } from './icon';
import { Text } from './text';
import * as Slot from '@/components/primitves/slot';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type ButtonProps = Omit<ComponentPropsWithAsChild<typeof Slot.Pressable>, 'children'> & {
  disabled?: boolean;
  invalid?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'secondary';
  children?: ((pressableState: PressableStateCallbackType, textStyle: TextStyle) => React.ReactNode) | React.ReactNode;
};

const buttonStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      flexShrink: 0,
      gap: sizes.gap.lg,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    invalid: {
      borderColor: colors.destructive,
    },
    pressed: {
      opacity: 0.8,
    },
  });

const buttonSizes = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    default: {
      height: sizes.dimension.xl,
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.md,
    },
    icon: {
      height: sizes.dimension.xl,
      width: sizes.dimension.xl,
    },
    lg: {
      height: sizes.dimension['2xl'],
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.lg,
    },
    sm: {
      height: sizes.dimension.lg,
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.md,
    },
  });

const buttonVariants = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    default: {
      backgroundColor: colors.primary,
    },
    destructive: {
      backgroundColor: colors.destructive,
    },
    ghost: {
      backgroundColor: colors.transparent,
    },
    link: {
      backgroundColor: colors.transparent,
    },
    outline: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: sizes.border.sm,
    },
    secondary: {
      backgroundColor: colors.secondary,
    },
  });

type ButtonContextProps = {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'ghost' | 'link' | 'outline' | 'secondary';
};

export const ButtonContext = React.createContext<ButtonContextProps>({ size: 'default', variant: 'default' });

const useButtonContext = () => {
  const context = React.useContext(ButtonContext);
  if (!context) {
    throw new Error('Button compound components cannot be rendered outside the Button component');
  }
  return context;
};

const Button = ({
  asChild,
  disabled = false,
  style,
  size = 'default',
  variant = 'default',
  children,
  ...props
}: ButtonProps) => {
  const styles = useStyles(buttonStyles);
  const sizes = useStyles(buttonSizes);
  const variants = useStyles(buttonVariants);
  const textVariants = useStyles(buttonTextVariants);
  const { colors } = useTheme();

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <ButtonContext.Provider value={{ size, variant }}>
      <Component
        aria-disabled={disabled ?? undefined}
        role="button"
        disabled={disabled ?? undefined}
        android_ripple={{
          color: `${colors.foreground}20`,
          foreground: true,
        }}
        style={(styleState) => [
          styles.button,
          disabled && styles.disabled,
          sizes[size],
          variants[variant],
          styleState.pressed && styles.pressed,
          typeof style === 'function' ? style(styleState) : style,
        ]}
        {...props}
      >
        {(pressableState) => {
          const textStyle = textVariants[variant];
          return typeof children === 'function' ? children(pressableState, textStyle) : children;
        }}
      </Component>
    </ButtonContext.Provider>
  );
};

const buttonTextVariants = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    default: {
      color: colors.primaryForeground,
      flexShrink: 1,
    },
    destructive: {
      color: colors.white,
      flexShrink: 1,
    },
    ghost: {
      color: colors.foreground,
      flexShrink: 1,
    },
    link: {
      color: colors.primary,
      flexShrink: 1,
    },
    outline: {
      color: colors.foreground,
      flexShrink: 1,
    },
    secondary: {
      color: colors.secondaryForeground,
      flexShrink: 1,
    },
  });

const ButtonTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(buttonTextVariants);
  const { variant = 'default' } = useButtonContext();
  return <Text numberOfLines={1} style={[styles[variant], style]} {...props} />;
};

const ButtonIcon = ({ color, ...props }: React.ComponentPropsWithRef<typeof Icon>) => {
  const { variant = 'default' } = useButtonContext();
  const { colors } = useTheme();
  const buttonIconColors = {
    default: colors.primaryForeground,
    destructive: colors.white,
    ghost: colors.foreground,
    link: colors.primary,
    outline: colors.foreground,
    secondary: colors.secondaryForeground,
  };

  return <Icon color={color ?? buttonIconColors[variant]} {...props} />;
};

const ButtonLoader = ({ color, ...props }: React.ComponentPropsWithRef<typeof ActivityIndicator>) => {
  const { variant = 'default' } = useButtonContext();
  const { colors } = useTheme();
  const buttonIconColors = {
    default: colors.primaryForeground,
    destructive: colors.white,
    ghost: colors.foreground,
    link: colors.primary,
    outline: colors.foreground,
    secondary: colors.secondaryForeground,
  };

  return <ActivityIndicator size="small" color={color ?? buttonIconColors[variant]} {...props} />;
};

export { Button, ButtonTitle, ButtonIcon, ButtonLoader };
