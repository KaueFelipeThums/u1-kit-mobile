import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Icon } from './icon';
import * as CheckboxGroupPrimitve from '@/components/primitves/checkbox-group';
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
}: React.ComponentPropsWithRef<typeof CheckboxGroupPrimitve.IndicatorContent>) => {
  const styles = useStyles(checkboxIndicatorStyles);
  const { colors } = useTheme();
  const { value } = CheckboxGroupPrimitve.useCheckboxGroupContext();
  const { itemValue } = CheckboxGroupPrimitve.useCheckboxItemContext();

  const overlayOpacity = useRef(new Animated.Value(value?.includes(itemValue) ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: value?.includes(itemValue) ? 1 : 0,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [overlayOpacity, itemValue, value]);

  return (
    <CheckboxGroupPrimitve.IndicatorContent
      style={[styles.indicator, value?.includes(itemValue) && styles.borderChecked, style]}
      {...props}
    >
      <Animated.View shouldRasterizeIOS style={[{ opacity: overlayOpacity }, styles.overlay]}>
        <CheckboxGroupPrimitve.Indicator>
          <Icon size={16} color={colors.primaryForeground} name="Check" />
        </CheckboxGroupPrimitve.Indicator>
      </Animated.View>
    </CheckboxGroupPrimitve.IndicatorContent>
  );
};

const checkboxGroupItemStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    groupItem: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
    pressed: {
      opacity: 0.8,
    },
  });

type CheckboxProps = Omit<React.ComponentPropsWithRef<typeof CheckboxGroupPrimitve.Item>, 'children'> & {
  children?: React.ReactNode;
};

const CheckboxGroupItem = ({ style, disabled, children, ...props }: CheckboxProps) => {
  const styles = useStyles(checkboxGroupItemStyles);
  const { disabled: groupDisabled } = CheckboxGroupPrimitve.useCheckboxGroupContext();
  const isDisabled = groupDisabled || disabled;

  return (
    <CheckboxGroupPrimitve.Item
      disabled={disabled}
      style={(pressableState) => [
        styles.groupItem,
        isDisabled && styles.disabled,
        pressableState.pressed && styles.pressed,
        typeof style === 'function' ? style(pressableState) : style,
      ]}
      {...props}
    >
      <CheckboxIndicator />
      {children}
    </CheckboxGroupPrimitve.Item>
  );
};

type CheckboxGroupProps = React.ComponentPropsWithRef<typeof CheckboxGroupPrimitve.Root> & {
  orientation?: 'horizontal' | 'vertical';
};

const checkboxGroupStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    group: {
      gap: sizes.gap.md,
    },
  });

const groupVariants = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
});

const CheckboxGroup = ({ style, orientation = 'vertical', ...props }: CheckboxGroupProps) => {
  const styles = useStyles(checkboxGroupStyles);
  return <CheckboxGroupPrimitve.Root style={[styles.group, groupVariants[orientation], style]} {...props} />;
};

export { CheckboxGroup, CheckboxGroupItem };
