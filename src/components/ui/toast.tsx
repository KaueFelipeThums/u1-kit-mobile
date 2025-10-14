import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from './icon';
import { Text } from './text';
import * as ToastPrimitive from '@/components/primitves/toast';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
const DURATION = 3000;

const toastContentStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

const ToastContent = () => {
  const { toasts } = ToastPrimitive.useListContext();

  return (
    <View style={toastContentStyles.content}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </View>
  );
};

const toastStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    descriptionContent: {
      flexGrow: 1,
      flexShrink: 1,
    },
    descrption: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.xs,
    },
    remove: {
      alignItems: 'center',
      borderRadius: sizes.radius.full,
      justifyContent: 'center',
      overflow: 'hidden',
      padding: sizes.padding.sm,
    },
    title: {
      color: colors.foreground,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
    toast: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: '0px 2px 4px rgba(63, 63, 63, 0.08)',
      flexDirection: 'row',
      gap: sizes.gap.xl,
      maxWidth: sizes.dimension['3xl'] * 5,
      minWidth: sizes.dimension['2xl'],
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.lg,
      position: 'absolute',
      width: '90%',
      zIndex: 70,
    },
    toastIconContent: {
      alignItems: 'center',
      borderRadius: sizes.radius.full,
      height: sizes.dimension.sm,
      justifyContent: 'center',
      width: sizes.dimension.sm,
    },
  });

const iconName: Record<ToastPrimitive.Item['type'], IconName> = {
  success: 'Check',
  error: 'X',
  warning: 'CircleAlert',
  info: 'CircleAlert',
};

const Toast = ({ id, options, title, description, type }: ToastPrimitive.Item) => {
  const { colors, sizes } = useTheme();
  const styles = useStyles(toastStyles);
  const { top, left, right, bottom } = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-50)).current;

  const handleDismiss = React.useCallback(
    (id: string) => {
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -50,
            duration: 150,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start((endAnimation) => endAnimation.finished && ToastPrimitive.toastPrimitive.dismiss(id));
      });
    },
    [opacity, translateY],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        restDisplacementThreshold: 1,
        restSpeedThreshold: 200,
      }).start();

      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });

    const timeout = setTimeout(() => handleDismiss(id), options?.duration || DURATION);

    return () => clearTimeout(timeout);
  }, [options, translateY, opacity, id, handleDismiss]);

  const iconColor = {
    success: colors.green[600],
    error: colors.destructive,
    warning: colors.orange[600],
    info: colors.blue[600],
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity,
          transform: [{ translateY }],
          marginTop: top + sizes.dimension.md,
          marginLeft: left,
          marginRight: right,
          marginBottom: bottom,
        },
      ]}
    >
      <View
        style={[
          styles.toastIconContent,
          {
            backgroundColor: iconColor[type],
            boxShadow: `0px 0px 0px 6px ${iconColor[type]}50`,
          },
        ]}
      >
        <Icon size={sizes.fontSize.sm} color={colors.white} name={iconName[type]} />
      </View>
      <View style={styles.descriptionContent}>
        <Text style={[styles.title, { color: iconColor[type] }]}>{title}</Text>
        {description && <Text style={[styles.descrption, { color: iconColor[type] }]}>{description}</Text>}
      </View>
      <Pressable
        style={styles.remove}
        onPress={() => handleDismiss(id)}
        android_ripple={{
          color: `${colors.foreground}20`,
          foreground: true,
        }}
      >
        <Icon name="X" color={colors.foreground} size={sizes.fontSize.lg} />
      </Pressable>
    </Animated.View>
  );
};

const Toaster = ({ children }: React.ComponentPropsWithRef<typeof ToastPrimitive.Root>) => {
  return (
    <ToastPrimitive.Root>
      <ToastContent />
      {children}
    </ToastPrimitive.Root>
  );
};

const toast = ToastPrimitive.toastPrimitive;

export { Toaster, toast };
