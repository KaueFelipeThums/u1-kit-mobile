import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import * as SwitchPrimitve from '@/components/primitves/switch';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type SwitchProps = React.ComponentProps<typeof SwitchPrimitve.Root>;

const switchStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
    },

    root: {
      backgroundColor: colors.muted,
      borderRadius: sizes.radius.full,
      height: sizes.dimension.md,
      justifyContent: 'center',
      padding: sizes.padding.sm,
      width: 53,
    },
    rootChecked: {
      backgroundColor: colors.primary,
    },
    thumb: {
      backgroundColor: colors.background,
      borderRadius: sizes.radius.full,
      height: sizes.dimension.sm,
      width: sizes.dimension.sm,
    },
  });

const AnimatedSwitchThumb = Animated.createAnimatedComponent(SwitchPrimitve.Thumb);

const Switch = ({ checked, disabled, style, ...props }: SwitchProps) => {
  const styles = useStyles(switchStyles);
  const { sizes } = useTheme();

  const thumbAnim = React.useRef(new Animated.Value(checked ? 1 : 0)).current;
  const trackWidth = 53;
  const thumbWidth = sizes.dimension.sm;
  const padding = sizes.padding.sm;

  const maxTranslateX = trackWidth - thumbWidth - padding * 2;

  React.useEffect(() => {
    Animated.spring(thumbAnim, {
      toValue: checked ? 1 : 0,
      friction: 40,
      tension: 150,
      useNativeDriver: true,
    }).start();
  }, [checked, thumbAnim]);

  const translateX = thumbAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxTranslateX],
  });

  return (
    <SwitchPrimitve.Root
      checked={checked}
      disabled={disabled}
      style={(triggerState) => [
        styles.root,
        checked && styles.rootChecked,
        disabled && styles.disabled,
        typeof style === 'function' ? style(triggerState) : style,
      ]}
      {...props}
    >
      <AnimatedSwitchThumb shouldRasterizeIOS style={[styles.thumb, { transform: [{ translateX }] }]} />
    </SwitchPrimitve.Root>
  );
};

export { Switch };
