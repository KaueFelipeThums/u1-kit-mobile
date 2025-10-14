import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Icon } from './icon';
import * as CheckboxPrimitive from '@/components/primitves/checkbox';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const checkboxIndicatorStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    borderChecked: {
      borderColor: colors.primary,
    },
    indicator: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: sizes.radius.lg,
      borderWidth: sizes.border.sm,
      height: sizes.dimension.sm,
      justifyContent: 'center',
      overflow: 'hidden',
      width: sizes.dimension.sm,
    },
    overlay: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  });

const CheckboxIndicator = ({
  style,
  ...props
}: React.ComponentPropsWithRef<typeof CheckboxPrimitive.IndicatorContent>) => {
  const styles = useStyles(checkboxIndicatorStyles);
  const { colors } = useTheme();
  const { checked } = CheckboxPrimitive.useCheckboxContext();

  const overlayOpacity = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: checked ? 1 : 0,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [checked, overlayOpacity]);

  return (
    <CheckboxPrimitive.IndicatorContent style={[styles.indicator, checked && styles.borderChecked, style]} {...props}>
      <Animated.View shouldRasterizeIOS style={[{ opacity: overlayOpacity }, styles.overlay]}>
        <CheckboxPrimitive.Indicator>
          <Icon size={16} color={colors.primaryForeground} name="Check" />
        </CheckboxPrimitive.Indicator>
      </Animated.View>
    </CheckboxPrimitive.IndicatorContent>
  );
};

const checkboxStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    checkbox: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    pressed: {
      opacity: 0.8,
    },
  });

type CheckboxProps = Omit<React.ComponentPropsWithRef<typeof CheckboxPrimitive.Root>, 'children'> & {
  children?: React.ReactNode;
};

const Checkbox = ({ style, disabled, children, ...props }: CheckboxProps) => {
  const styles = useStyles(checkboxStyles);
  return (
    <CheckboxPrimitive.Root
      disabled={disabled}
      style={(pressableState) => [
        styles.checkbox,
        disabled && styles.disabled,
        pressableState.pressed && styles.pressed,
        typeof style === 'function' ? style(pressableState) : style,
      ]}
      {...props}
    >
      <CheckboxIndicator />
      {children}
    </CheckboxPrimitive.Root>
  );
};

export { Checkbox, CheckboxIndicator };
