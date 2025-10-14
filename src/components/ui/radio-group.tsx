import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import * as RadioGroupPrimitve from '@/components/primitves/radio-group';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const radioIndicatorStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    borderChecked: {
      borderColor: colors.primary,
      borderWidth: sizes.border.md,
    },
    indicator: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: sizes.radius.full,
      borderWidth: sizes.border.sm,
      height: sizes.dimension.sm,
      justifyContent: 'center',
      overflow: 'hidden',
      padding: sizes.padding.sm,
      width: sizes.dimension.sm,
    },
    overlay: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: sizes.radius.full,
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  });

const RadioIndicator = ({
  style,
  ...props
}: React.ComponentPropsWithRef<typeof RadioGroupPrimitve.IndicatorContent>) => {
  const styles = useStyles(radioIndicatorStyles);
  const { value } = RadioGroupPrimitve.useRadioGroupContext();
  const { itemValue } = RadioGroupPrimitve.useRadioItemContext();

  const overlayOpacity = useRef(new Animated.Value(value === itemValue ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: value === itemValue ? 1 : 0,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [overlayOpacity, itemValue, value]);

  return (
    <RadioGroupPrimitve.IndicatorContent
      style={[styles.indicator, value === itemValue && styles.borderChecked, style]}
      {...props}
    >
      <Animated.View shouldRasterizeIOS style={[{ opacity: overlayOpacity }, styles.overlay]}>
        <RadioGroupPrimitve.Indicator />
      </Animated.View>
    </RadioGroupPrimitve.IndicatorContent>
  );
};

const radioGroupItemStyles = ({ sizes }: ThemeValue) =>
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

type RadioProps = Omit<React.ComponentPropsWithRef<typeof RadioGroupPrimitve.Item>, 'children'> & {
  children?: React.ReactNode;
};

const RadioGroupItem = ({ style, disabled, children, ...props }: RadioProps) => {
  const styles = useStyles(radioGroupItemStyles);
  const { disabled: groupDisabled } = RadioGroupPrimitve.useRadioGroupContext();
  const isDisabled = groupDisabled || disabled;

  return (
    <RadioGroupPrimitve.Item
      disabled={disabled}
      style={(pressableState) => [
        styles.groupItem,
        isDisabled && styles.disabled,
        pressableState.pressed && styles.pressed,
        typeof style === 'function' ? style(pressableState) : style,
      ]}
      {...props}
    >
      <RadioIndicator />
      {children}
    </RadioGroupPrimitve.Item>
  );
};

type RadioGroupProps = React.ComponentPropsWithRef<typeof RadioGroupPrimitve.Root> & {
  orientation?: 'horizontal' | 'vertical';
};

const radioGroupStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    group: {
      gap: sizes.gap.md,
    },
  });

const radioGroupVariants = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
});

const RadioGroup = ({ style, orientation = 'vertical', ...props }: RadioGroupProps) => {
  const styles = useStyles(radioGroupStyles);
  return <RadioGroupPrimitve.Root style={[styles.group, radioGroupVariants[orientation], style]} {...props} />;
};

export { RadioGroup, RadioGroupItem };
