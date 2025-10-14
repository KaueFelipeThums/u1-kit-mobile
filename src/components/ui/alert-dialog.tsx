import React, { useRef } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './button';
import { Text } from './text';
import * as AlertDialogPrimitive from '@/components/primitves/alert-dialog';
import { useDialogAnimation } from '@/hooks/use-dialog-animation';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const AlertDialog = ({ ...props }: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Root>) => {
  return <AlertDialogPrimitive.Root {...props} />;
};

const AlertDialogTrigger = ({ ...props }: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Trigger>) => {
  return <AlertDialogPrimitive.Trigger {...props} />;
};

const AlertDialogPortal = ({ ...props }: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Portal>) => {
  return <AlertDialogPrimitive.Portal {...props} />;
};

const alertDialogOverlayStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: `${colors.black}80`,
      justifyContent: 'center',
      zIndex: 50,
    },
  });

const AlertDialogOverlay = ({ style, ...props }: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Overlay>) => {
  const styles = useStyles(alertDialogOverlayStyles);

  return (
    <AlertDialogPrimitive.Overlay
      style={(pressableState) => [styles.overlay, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const alertDialogPanelStyles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    zIndex: 50,
  },
});

const AlertDialogPanel = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { bottom, left, right, top } = useSafeAreaInsets();

  return (
    <View
      style={[
        alertDialogPanelStyles.panel,
        style,
        {
          paddingBottom: bottom,
          paddingTop: top,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
      pointerEvents="box-none"
      {...props}
    />
  );
};

const alertDialogContentStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.lg,
      flexDirection: 'column',
      gap: sizes.gap.xl,
      maxHeight: '100%',
      maxWidth: '100%',
      padding: sizes.padding.xl,
      width: '90%',
    },
  });

type AlertDialogContentLayoutProps = React.ComponentPropsWithRef<typeof View> & {
  onLayoutReady?: () => void;
};

const AlertDialogContentLayout = ({ onLayoutReady, style, onLayout, ...props }: AlertDialogContentLayoutProps) => {
  const isLayoutReady = useRef<boolean>(false);

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      if (!isLayoutReady.current) {
        isLayoutReady.current = true;
        onLayoutReady?.();
      }
      onLayout?.(event);
    },
    [onLayoutReady, onLayout],
  );

  return <View onLayout={handleLayout} style={[StyleSheet.absoluteFillObject, style]} {...props} />;
};

const AlertDialogPanelAnimated = Animated.createAnimatedComponent(AlertDialogPanel);
const AlertDialogOverlayAnimated = Animated.createAnimatedComponent(AlertDialogOverlay);

const AlertDialogContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof AlertDialogPrimitive.Content>) => {
  const styles = useStyles(alertDialogContentStyles);
  const { open } = AlertDialogPrimitive.useRootContext();
  const { animateIn, opacityAnim, scaleAnim, visible } = useDialogAnimation({ open });

  return (
    <AlertDialogPortal visible={visible}>
      <AlertDialogContentLayout onLayoutReady={animateIn}>
        <AlertDialogOverlayAnimated shouldRasterizeIOS style={{ opacity: opacityAnim }} />
        <AlertDialogPanelAnimated
          shouldRasterizeIOS
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <TouchableWithoutFeedback touchSoundDisabled onPress={(event) => event.stopPropagation()}>
            <AlertDialogPrimitive.Content style={[styles.content, style]} {...props} />
          </TouchableWithoutFeedback>
        </AlertDialogPanelAnimated>
      </AlertDialogContentLayout>
    </AlertDialogPortal>
  );
};

const alertDialogHeaderStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      gap: sizes.gap.md,
    },
  });

const AlertDialogHeader = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(alertDialogHeaderStyles);
  return <View style={[styles.header, style]} {...props} />;
};

const alertDialogFooterStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    footer: {
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
  });

const AlertDialogFooter = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(alertDialogFooterStyles);
  return <View style={[styles.footer, style]} {...props} />;
};

const alertDialogTitleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      fontSize: sizes.fontSize.lg,
      fontWeight: sizes.fontWeight.medium,
      textAlign: 'center',
    },
  });

const AlertDialogTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(alertDialogTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const alertDialogDiscroptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
      textAlign: 'center',
    },
  });

const AlertDialogDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(alertDialogDiscroptionStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const alertDialogCancelStyles = StyleSheet.create({
  cancel: {
    flex: 1,
  },
});

const AlertDialogCancel = ({ style, ...props }: React.ComponentPropsWithRef<typeof Button>) => {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button
        variant="outline"
        style={(pressableState) => [
          alertDialogCancelStyles.cancel,
          typeof style === 'function' ? style(pressableState) : style,
        ]}
        {...props}
      />
    </AlertDialogPrimitive.Cancel>
  );
};

const alertDialogActionStyles = StyleSheet.create({
  action: {
    flex: 1,
  },
});

const AlertDialogAction = ({ style, ...props }: React.ComponentPropsWithRef<typeof Button>) => {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button
        style={(pressableState) => [
          alertDialogActionStyles.action,
          typeof style === 'function' ? style(pressableState) : style,
        ]}
        {...props}
      />
    </AlertDialogPrimitive.Action>
  );
};

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
