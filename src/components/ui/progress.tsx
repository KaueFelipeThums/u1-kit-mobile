import * as React from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import * as ProgressPrimitive from '@/components/primitves/progress';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type ProgressProps = {
  value?: number;
  max?: number;
  style?: ViewStyle | ViewStyle[];
  indicatorStyle?: ViewStyle | ViewStyle[];
  animated?: boolean;
  duration?: number;
};

const progressStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.muted,
      borderRadius: sizes.radius.full,
      height: sizes.dimension.xs / 3,
      overflow: 'hidden',
      width: '100%',
    },
    indicator: {
      backgroundColor: colors.primary,
      borderRadius: sizes.radius.full,
      height: '100%',
    },
  });

const AnimatedIndicator = Animated.createAnimatedComponent(ProgressPrimitive.Indicator);

const Progress = ({ value = 0, max = 100, style, indicatorStyle, animated = true, duration = 150 }: ProgressProps) => {
  const styles = useStyles(progressStyles);
  const widthAnim = React.useRef(new Animated.Value(0)).current;

  const widthPercent = Math.min(Math.max((value / max) * 100, 0), 100);

  React.useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: widthPercent,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(widthPercent);
    }
  }, [widthPercent, animated, duration, widthAnim]);

  return (
    <ProgressPrimitive.Root style={[styles.container, style]}>
      <AnimatedIndicator
        shouldRasterizeIOS
        style={[
          styles.indicator,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
          indicatorStyle,
        ]}
      />
    </ProgressPrimitive.Root>
  );
};

export { Progress };
