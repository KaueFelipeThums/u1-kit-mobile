import { createContext, useCallback, useContext, useRef } from 'react';
import { Animated, LayoutChangeEvent, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from './button';
import { Text } from './text';
import * as DialogPrimitive from '@/components/primitves/dialog';
import { useSheetAnimation } from '@/hooks/use-sheet-animation';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type SheetSide = 'top' | 'bottom' | 'left' | 'right';

type SheetContextProps = {
  side: SheetSide;
};

const SheetContext = createContext<SheetContextProps>({ side: 'bottom' });

const useSheetContext = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet compound components cannot be rendered outside the Sheet component');
  }
  return context;
};

type SheetProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Root> & {
  side?: SheetSide;
};

const Sheet = ({ ...props }: SheetProps) => {
  return (
    <SheetContext.Provider value={{ side: props.side ?? 'bottom' }}>
      <DialogPrimitive.Root {...props} />
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Trigger>) => {
  return <DialogPrimitive.Trigger {...props} />;
};

const SheetPortal = ({ ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Portal>) => {
  return <DialogPrimitive.Portal {...props} />;
};

const sheetOverlayStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: `${colors.black}80`,
      justifyContent: 'center',
      zIndex: 50,
    },
  });

const SheetOverlay = ({ style, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) => {
  const styles = useStyles(sheetOverlayStyles);

  return (
    <DialogPrimitive.Overlay
      style={(pressableState) => [styles.overlay, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const sheetPanelStyles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    zIndex: 50,
  },
});

const SheetPanel = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { bottom, left, right, top } = useSafeAreaInsets();
  return (
    <View
      style={[
        sheetPanelStyles.panel,
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

const sheetContentStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.lg,
      flexDirection: 'column',
      maxHeight: '100%',
      maxWidth: '100%',
    },
  });

const sheetSideStyles = StyleSheet.create({
  bottom: {
    height: '60%',
    width: '100%',
  },
  left: {
    height: '100%',
    width: '80%',
  },
  right: {
    height: '100%',
    width: '80%',
  },
  top: {
    height: '60%',
    width: '100%',
  },
});

const sheetContainerSideStyles = StyleSheet.create({
  bottom: {
    alignItems: 'flex-end',
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
  top: {
    alignItems: 'flex-start',
  },
});

type SheetContentLayoutProps = React.ComponentPropsWithRef<typeof View> & {
  onLayoutReady?: () => void;
};

const SheetContentLayout = ({ onLayoutReady, style, onLayout, ...props }: SheetContentLayoutProps) => {
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

const SheetPanelAnimated = Animated.createAnimatedComponent(SheetPanel);
const SheetOverlayAnimated = Animated.createAnimatedComponent(SheetOverlay);

const SheetContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) => {
  const styles = useStyles(sheetContentStyles);
  const { side } = useSheetContext();
  const { open } = DialogPrimitive.useRootContext();
  const { animateIn, opacityAnim, translateAnim, visible } = useSheetAnimation({ open, side });
  const isVertical = side === 'top' || side === 'bottom';

  const animatedStyle = {
    transform: isVertical ? [{ translateY: translateAnim }] : [{ translateX: translateAnim }],
  };

  return (
    <SheetPortal visible={visible}>
      <SheetContentLayout onLayoutReady={animateIn}>
        <SheetOverlayAnimated shouldRasterizeIOS style={{ opacity: opacityAnim }} />
        <SheetPanelAnimated
          shouldRasterizeIOS
          style={[animatedStyle, sheetContainerSideStyles[side]]}
          pointerEvents="box-none"
        >
          <TouchableWithoutFeedback touchSoundDisabled onPress={(event) => event.stopPropagation()}>
            <DialogPrimitive.Content style={[styles.content, sheetSideStyles[side], style]} {...props} />
          </TouchableWithoutFeedback>
        </SheetPanelAnimated>
      </SheetContentLayout>
    </SheetPortal>
  );
};

const sheetHeaderStyles = ({ sizes }: ThemeValue) =>
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
    },
  });

const SheetHeader = ({ style, children, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(sheetHeaderStyles);
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

const sheetFooterStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    footer: {
      flexDirection: 'row-reverse',
      gap: sizes.gap.md,
      padding: sizes.padding.xl,
    },
  });

const SheetFooter = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(sheetFooterStyles);
  return <View style={[styles.footer, style]} {...props} />;
};

const sheetBodyStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    body: {
      gap: sizes.gap.md,
      padding: sizes.padding.xl,
    },
  });

const SheetBody = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(sheetBodyStyles);
  return <View style={[styles.body, style]} {...props} />;
};

const SheetBodyScroll = ({ style, ...props }: React.ComponentPropsWithRef<typeof ScrollView>) => {
  const styles = useStyles(sheetBodyStyles);
  return <ScrollView contentContainerStyle={[styles.body, style]} {...props} />;
};

const sheetTitleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      fontSize: sizes.fontSize.lg,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const SheetTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(sheetTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const SheetDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
  });

const SheetDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(SheetDescriptionStyles);
  return <Text style={[styles.description, style]} {...props} />;
};

const SheetClose = DialogPrimitive.Close;

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  SheetBody,
  SheetBodyScroll,
  SheetClose,
};
