import { useCallback, useRef } from 'react';
import { Animated, LayoutChangeEvent, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from './button';
import { KeyboardAvoidingContent } from './keyboard-avoid-content';
import { Text } from './text';
import * as DialogPrimitive from '@/components/primitves/dialog';
import { useDialogAnimation } from '@/hooks/use-dialog-animation';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const Dialog = ({ ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Root>) => {
  return <DialogPrimitive.Root {...props} />;
};

const DialogTrigger = ({ ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Trigger>) => {
  return <DialogPrimitive.Trigger {...props} />;
};

const DialogPortal = ({ ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Portal>) => {
  return <DialogPrimitive.Portal {...props} />;
};

const dialogOverlayStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: `${colors.black}80`,
      justifyContent: 'center',
      zIndex: 50,
    },
  });

const DialogOverlay = ({ style, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) => {
  const styles = useStyles(dialogOverlayStyles);

  return (
    <DialogPrimitive.Overlay
      style={(pressableState) => [styles.overlay, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const alertPanelStyles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    zIndex: 50,
  },
});

const DialogPanel = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { bottom, left, right, top } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingContent style={StyleSheet.absoluteFillObject}>
      <View
        style={[
          alertPanelStyles.panel,
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
    </KeyboardAvoidingContent>
  );
};

const dialogContentStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.lg,
      flexDirection: 'column',
      maxHeight: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      width: '90%',
    },
  });

type DialogContentLayoutProps = React.ComponentPropsWithRef<typeof View> & {
  onLayoutReady?: () => void;
};

const DialogContentLayout = ({ onLayoutReady, style, onLayout, ...props }: DialogContentLayoutProps) => {
  const isLayoutReady = useRef<boolean>(false);

  const handleLayout = useCallback(
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

const DialogPanelAnimated = Animated.createAnimatedComponent(DialogPanel);
const DialogOverlayAnimated = Animated.createAnimatedComponent(DialogOverlay);

const DialogContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) => {
  const styles = useStyles(dialogContentStyles);
  const { open } = DialogPrimitive.useRootContext();
  const { animateIn, opacityAnim, scaleAnim, visible } = useDialogAnimation({ open });

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <DialogPortal visible={visible}>
      <DialogContentLayout onLayoutReady={animateIn}>
        <DialogOverlayAnimated shouldRasterizeIOS style={{ opacity: opacityAnim }}>
          <DialogPanelAnimated shouldRasterizeIOS style={animatedStyle}>
            <TouchableWithoutFeedback touchSoundDisabled onPress={(event) => event.stopPropagation()}>
              <DialogPrimitive.Content style={[styles.content, style]} {...props} />
            </TouchableWithoutFeedback>
          </DialogPanelAnimated>
        </DialogOverlayAnimated>
      </DialogContentLayout>
    </DialogPortal>
  );
};

const dialogHeaderStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      gap: sizes.gap.md,
      padding: sizes.padding.xl,
    },
    headerButton: {
      height: sizes.dimension.lg,
      width: sizes.dimension.lg,
    },
    headerContent: {
      flexGrow: 1,
      flexShrink: 1,
    },
  });

const DialogHeader = ({ style, children, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(dialogHeaderStyles);
  const { sizes, colors } = useTheme();

  return (
    <View style={[styles.header, style]} {...props}>
      <View style={styles.headerContent}>{children}</View>
      <DialogPrimitive.Close asChild>
        <Button size="icon" variant="ghost" style={styles.headerButton}>
          <ButtonIcon size={sizes.fontSize.lg} color={colors.foreground} name="X" />
        </Button>
      </DialogPrimitive.Close>
    </View>
  );
};

const dialogFooterStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    footer: {
      flexDirection: 'row-reverse',
      gap: sizes.gap.md,
      padding: sizes.padding.xl,
    },
  });

const DialogFooter = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(dialogFooterStyles);
  return <View style={[styles.footer, style]} {...props} />;
};

const dialogBodyStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    body: {
      gap: sizes.gap.md,
      padding: sizes.padding.xl,
    },
  });

const DialogBody = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(dialogBodyStyles);
  return <View style={[styles.body, style]} {...props} />;
};

const DialogBodyScroll = ({ contentContainerStyle, ...props }: React.ComponentPropsWithRef<typeof ScrollView>) => {
  const styles = useStyles(dialogBodyStyles);
  return <ScrollView contentContainerStyle={[styles.body, contentContainerStyle]} {...props} />;
};

const dialogTitleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      fontSize: sizes.fontSize.lg,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const DialogTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(dialogTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const dialogDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
  });

const DialogDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(dialogDescriptionStyles);
  return <Text style={[styles.description, style]} {...props} />;
};

const DialogClose = DialogPrimitive.Close;

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  DialogBodyScroll,
  DialogClose,
};
