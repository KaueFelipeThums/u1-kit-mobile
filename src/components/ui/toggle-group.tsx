import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from './icon';
import { Text } from './text';
import * as ToggleGroupPrimitive from '@/components/primitves/toggle-group';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { ToggleGroupUtils } from '@/utils/toggle-group';

type ToggleGroupProps = React.ComponentPropsWithRef<typeof ToggleGroupPrimitive.Root> & {
  children?: React.ReactNode;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline';
};

type ToggleGroupContextProps = {
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline';
};

export const ToggleGroupContext = React.createContext<ToggleGroupContextProps>({
  size: 'default',
  variant: 'default',
});

const useToggleGroupContext = () => {
  const context = React.useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('ToggleGroup compound components cannot be rendered outside the ToggleGroup component');
  }
  return context;
};

const toggleGroupStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    toggleGroup: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.sm,
    },
  });

const ToggleGroup = ({ style, size = 'default', variant = 'default', ...props }: ToggleGroupProps) => {
  const styles = useStyles(toggleGroupStyles);
  return (
    <ToggleGroupContext.Provider value={{ size, variant }}>
      <ToggleGroupPrimitive.Root style={[styles.toggleGroup, style]} {...props} />
    </ToggleGroupContext.Provider>
  );
};

type ToggleGroupItemProps = Omit<React.ComponentPropsWithRef<typeof ToggleGroupPrimitive.Item>, 'children'> & {
  disabled?: boolean;
  invalid?: boolean;
  children?: React.ReactNode;
};

const toggleGroupItemStyles = ({ sizes, colors }: ThemeValue) =>
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
    toggleGroupItem: {
      alignItems: 'center',
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      gap: sizes.gap.lg,
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });

const toggleGroupItemSizes = ({ sizes }: ThemeValue) =>
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

const toggleGroupItemVariants = ({ sizes, colors }: ThemeValue) =>
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

const ToggleGroupItem = ({ disabled = false, style, value: itemValue, children, ...props }: ToggleGroupItemProps) => {
  const styles = useStyles(toggleGroupItemStyles);
  const sizes = useStyles(toggleGroupItemSizes);
  const variants = useStyles(toggleGroupItemVariants);
  const { size = 'default', variant = 'default' } = useToggleGroupContext();
  const { disabled: rootDisabled, value } = ToggleGroupPrimitive.useRootContext();
  const isDisabled = disabled || rootDisabled;
  const { colors } = useTheme();

  const pressed = ToggleGroupUtils.getIsSelected(value, itemValue);

  return (
    <ToggleGroupPrimitive.Item
      value={itemValue}
      aria-disabled={disabled ?? undefined}
      disabled={disabled ?? undefined}
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      style={(styleState) => [
        styles.toggleGroupItem,
        isDisabled && styles.disabled,
        sizes[size],
        variants[variant],
        pressed && styles.active,
        styleState.pressed && styles.pressed,
        typeof style === 'function' ? style(styleState) : style,
      ]}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
};

const toggleGroupItemTextVariants = ({ colors }: ThemeValue) =>
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

const ToggleGroupItemTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(toggleGroupItemTextVariants);
  const { variant = 'default' } = useToggleGroupContext();
  return <Text numberOfLines={1} style={[styles[variant], style]} {...props} />;
};

const ToggleGroupItemIcon = ({ color, ...props }: React.ComponentPropsWithRef<typeof Icon>) => {
  const { variant = 'default' } = useToggleGroupContext();
  const { colors } = useTheme();
  const toggleGroupItemIconColors = {
    default: colors.foreground,
    outline: colors.foreground,
  };

  return <Icon color={color ?? toggleGroupItemIconColors[variant]} {...props} />;
};

export { ToggleGroup, ToggleGroupItem, ToggleGroupItemIcon, ToggleGroupItemTitle };
