import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from './icon';
import { Text } from './text';
import * as TogglePrimitive from '@/components/primitves/toggle';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type ToggleProps = Omit<React.ComponentPropsWithRef<typeof TogglePrimitive.Root>, 'children'> & {
  disabled?: boolean;
  invalid?: boolean;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline';
  children?: React.ReactNode;
};

const toggleStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    active: {
      backgroundColor: colors.accent,
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
    toggle: {
      alignItems: 'center',
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      gap: sizes.gap.lg,
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });

const toggleSizes = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    default: {
      height: sizes.dimension.xl,
      minWidth: sizes.dimension.xl,
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.md,
    },
    lg: {
      height: sizes.dimension['2xl'],
      minWidth: sizes.dimension['2xl'],
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.lg,
    },
    sm: {
      height: sizes.dimension.lg,
      minWidth: sizes.dimension.lg,
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.md,
    },
  });

const toggleVariants = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    default: {
      backgroundColor: colors.transparent,
    },
    outline: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: sizes.border.sm,
    },
  });

type ToggleContextProps = {
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline';
};

export const ToggleContext = React.createContext<ToggleContextProps>({ size: 'default', variant: 'default' });

const useToggleContext = () => {
  const context = React.useContext(ToggleContext);
  if (!context) {
    throw new Error('Toggle compound components cannot be rendered outside the Toggle component');
  }
  return context;
};

const Toggle = ({
  disabled = false,
  pressed,
  style,
  size = 'default',
  variant = 'default',
  children,
  ...props
}: ToggleProps) => {
  const styles = useStyles(toggleStyles);
  const sizes = useStyles(toggleSizes);
  const variants = useStyles(toggleVariants);
  const { colors } = useTheme();

  return (
    <ToggleContext.Provider value={{ size, variant }}>
      <TogglePrimitive.Root
        pressed={pressed}
        aria-disabled={disabled ?? undefined}
        disabled={disabled ?? undefined}
        android_ripple={{
          color: `${colors.foreground}20`,
          foreground: true,
        }}
        style={(styleState) => [
          styles.toggle,
          disabled && styles.disabled,
          sizes[size],
          variants[variant],
          pressed && styles.active,
          styleState.pressed && styles.pressed,
          typeof style === 'function' ? style(styleState) : style,
        ]}
        {...props}
      >
        {children}
      </TogglePrimitive.Root>
    </ToggleContext.Provider>
  );
};

const toggleTextVariants = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    default: {
      color: colors.foreground,
      flexShrink: 1,
    },
    outline: {
      color: colors.foreground,
      flexShrink: 1,
    },
  });

const ToggleTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(toggleTextVariants);
  const { variant = 'default' } = useToggleContext();
  return <Text numberOfLines={1} style={[styles[variant], style]} {...props} />;
};

const ToggleIcon = ({ color, ...props }: React.ComponentPropsWithRef<typeof Icon>) => {
  const { variant = 'default' } = useToggleContext();
  const { colors } = useTheme();
  const toggleIconColors = {
    default: colors.foreground,
    outline: colors.foreground,
  };

  return <Icon color={color ?? toggleIconColors[variant]} {...props} />;
};

export { Toggle, ToggleIcon, ToggleTitle };
