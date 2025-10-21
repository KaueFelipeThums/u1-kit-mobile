import { createContext, useCallback, useContext, useRef } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from './button';
import { Text } from './text';
import * as DialogPrimitive from '@/components/primitves/dialog';
import { useSheetAnimation } from '@/hooks/use-sheet-animation';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type MenuActionsSide = 'top' | 'bottom';

type MenuActionsContextProps = {
  side: MenuActionsSide;
};

const MenuActionsContext = createContext<MenuActionsContextProps>({ side: 'bottom' });

const useMenuActionsContext = () => {
  const context = useContext(MenuActionsContext);
  if (!context) {
    throw new Error('MenuActions compound components cannot be rendered outside the MenuActions component');
  }
  return context;
};

type MenuActionsProps = React.ComponentPropsWithRef<typeof DialogPrimitive.Root> & {
  side?: MenuActionsSide;
};

const MenuActions = ({ ...props }: MenuActionsProps) => {
  return (
    <MenuActionsContext.Provider value={{ side: props.side ?? 'bottom' }}>
      <DialogPrimitive.Root {...props} />
    </MenuActionsContext.Provider>
  );
};

const MenuActionsTrigger = ({ ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Trigger>) => {
  return <DialogPrimitive.Trigger {...props} />;
};

const MenuActionsPortal = ({ ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Portal>) => {
  return <DialogPrimitive.Portal {...props} />;
};

const menuActionsOverlayStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: `${colors.black}80`,
      justifyContent: 'center',
      zIndex: 50,
    },
  });

const MenuActionsOverlay = ({ style, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) => {
  const styles = useStyles(menuActionsOverlayStyles);

  return (
    <DialogPrimitive.Overlay
      style={(pressableState) => [styles.overlay, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const menuActionsPanelStyles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    zIndex: 50,
  },
});

const MenuActionsPanel = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { bottom, left, right, top } = useSafeAreaInsets();
  const { sizes } = useTheme();
  return (
    <View
      style={[
        menuActionsPanelStyles.panel,
        style,
        {
          paddingBottom: bottom + sizes.padding.lg,
          paddingTop: top + sizes.padding.lg,
          paddingLeft: left + sizes.padding.lg,
          paddingRight: right + sizes.padding.lg,
        },
      ]}
      pointerEvents="box-none"
      {...props}
    />
  );
};

const menuActionsContentStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.lg,
      flexDirection: 'column',
      height: 'auto',
      maxHeight: '100%',
      maxWidth: '100%',
      width: '100%',
    },
  });

const menuActionsPanelSideStyles = StyleSheet.create({
  bottom: {
    alignItems: 'flex-end',
  },
  top: {
    alignItems: 'flex-start',
  },
});

type MenuActionsContentLayoutProps = React.ComponentPropsWithRef<typeof View> & {
  onLayoutReady?: () => void;
};

const MenuActionsContentLayout = ({ onLayoutReady, style, onLayout, ...props }: MenuActionsContentLayoutProps) => {
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

const MenuActionsPanelAnimated = Animated.createAnimatedComponent(MenuActionsPanel);
const MenuActionsOverlayAnimated = Animated.createAnimatedComponent(MenuActionsOverlay);

const MenuActionsContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) => {
  const styles = useStyles(menuActionsContentStyles);
  const { side } = useMenuActionsContext();
  const { open } = DialogPrimitive.useRootContext();
  const { animateIn, opacityAnim, translateAnim, visible } = useSheetAnimation({ open, side });

  const animatedStyle = {
    transform: [{ translateY: translateAnim }],
  };

  return (
    <MenuActionsPortal visible={visible}>
      <MenuActionsContentLayout onLayoutReady={animateIn}>
        <MenuActionsOverlayAnimated shouldRasterizeIOS style={{ opacity: opacityAnim }} />
        <MenuActionsPanelAnimated shouldRasterizeIOS style={[animatedStyle, menuActionsPanelSideStyles[side]]}>
          <TouchableWithoutFeedback touchSoundDisabled onPress={(event) => event.stopPropagation()}>
            <DialogPrimitive.Content style={[styles.content, style]} {...props} />
          </TouchableWithoutFeedback>
        </MenuActionsPanelAnimated>
      </MenuActionsContentLayout>
    </MenuActionsPortal>
  );
};

const menuActionsHeaderStyles = ({ sizes }: ThemeValue) =>
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

const MenuActionsHeader = ({ style, children, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(menuActionsHeaderStyles);
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

const menuActionsBodyStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    body: {
      gap: sizes.gap.sm,
      padding: sizes.padding.sm,
    },
  });

const MenuActionsBody = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(menuActionsBodyStyles);
  return <View style={[styles.body, style]} {...props} />;
};

const MenuActionsBodyScroll = ({ style, ...props }: React.ComponentPropsWithRef<typeof ScrollView>) => {
  const styles = useStyles(menuActionsBodyStyles);
  return <ScrollView contentContainerStyle={[styles.body, style]} {...props} />;
};

const menuActionsTitleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      flexShrink: 1,
      fontSize: sizes.fontSize.lg,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const MenuActionsTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(menuActionsTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const MenuActionsDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
  });

const MenuActionsDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(MenuActionsDescriptionStyles);
  return <Text style={[styles.description, style]} {...props} />;
};

const menuActionsItemStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      gap: sizes.gap.md,
      height: sizes.dimension.xl,
      justifyContent: 'center',
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.xl,
    },
    disabled: {
      opacity: 0.8,
    },
    pressed: {
      opacity: 0.8,
    },
  });

const MenuActionsItem = ({ style, ...props }: React.ComponentPropsWithRef<typeof Pressable>) => {
  const { colors } = useTheme();
  const styles = useStyles(menuActionsItemStyles);

  return (
    <DialogPrimitive.Close
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      style={(triggerState) => [
        triggerState.pressed && styles.pressed,
        styles.item,
        props.disabled && styles.disabled,
        typeof style === 'function' ? style(triggerState) : style,
      ]}
      {...props}
    />
  );
};

const menuActionsItemContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    itemContent: {
      flexDirection: 'column',
      flexGrow: 1,
      flexShrink: 1,
      gap: sizes.gap.xs,
      justifyContent: 'center',
    },
  });

const MenuActionsItemContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(menuActionsItemContentStyles);
  return <View style={[styles.itemContent, style]} {...props} />;
};

export {
  MenuActions,
  MenuActionsContent,
  MenuActionsDescription,
  MenuActionsHeader,
  MenuActionsOverlay,
  MenuActionsPortal,
  MenuActionsTitle,
  MenuActionsTrigger,
  MenuActionsBody,
  MenuActionsBodyScroll,
  MenuActionsItem,
  MenuActionsItemContent,
};
