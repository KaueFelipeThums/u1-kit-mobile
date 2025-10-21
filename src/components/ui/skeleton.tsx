import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type SkeletonProps = React.ComponentPropsWithRef<typeof View> & {
  style?: ViewStyle;
};

const skeletonStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    skeleton: {
      backgroundColor: colors.secondary,
    },
  });

const Skeleton = ({ style, ...props }: SkeletonProps) => {
  const opacityAnim = useRef(new Animated.Value(0.5)).current;
  const styles = useStyles(skeletonStyles);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]),
      {
        iterations: -1, // repete até você parar
        resetBeforeIteration: false,
      },
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          opacity: opacityAnim,
        },
        style,
      ]}
      {...props}
    />
  );
};

export { Skeleton };
