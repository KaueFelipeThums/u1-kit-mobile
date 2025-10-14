import { ReactNode, useCallback, useRef } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from './button';
import { Icon } from './icon';
import { KeyboardAvoidingContent } from './keyboard-avoid-content';
import { Text } from './text';
import * as SelectPrimitive from '@/components/primitves/select';
import { useSheetAnimation } from '@/hooks/use-sheet-animation';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const Select = ({ ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Root>) => {
  return <SelectPrimitive.Root {...props} />;
};

const selectTriggerStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    focused: {
      borderColor: colors.primary,
      boxShadow: `0px 0px 0px 4px ${colors.primary}50`,
    },
    iconContent: {
      alignItems: 'center',
      height: sizes.dimension.md,
      justifyContent: 'center',
      width: sizes.dimension.md,
    },
    pressed: {
      opacity: 0.8,
    },
    trigger: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.input,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.sm,
      flexDirection: 'row',
      gap: sizes.gap.sm,
      height: sizes.dimension.xl,
      justifyContent: 'space-between',
      minWidth: 0,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.xs,
      width: '100%',
    },
  });

type SelectTriggerProps = Omit<React.ComponentPropsWithRef<typeof SelectPrimitive.Trigger>, 'children'> & {
  children?: React.ReactNode;
};

const SelectTrigger = ({ disabled, style, children, ...props }: SelectTriggerProps) => {
  const styles = useStyles(selectTriggerStyles);
  const { disabled: disabledRoot } = SelectPrimitive.useRootContext();
  const { colors, sizes } = useTheme();
  const isDisabled = disabledRoot || disabled;

  return (
    <SelectPrimitive.Trigger
      disabled={isDisabled}
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      style={(triggerState) => [
        styles.trigger,
        isDisabled && styles.disabled,
        triggerState.pressed && styles.pressed,
        typeof style === 'function' ? style?.(triggerState) : style,
      ]}
      {...props}
    >
      {children}
      <View style={styles.iconContent}>
        <Icon name="ChevronDown" size={sizes.fontSize.md} color={colors.mutedForeground} />
      </View>
    </SelectPrimitive.Trigger>
  );
};

const selectValueStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    placeholder: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.md,
    },
    value: {
      color: colors.foreground,
      fontSize: sizes.fontSize.md,
    },
    valueContent: {
      flexGrow: 1,
      flexShrink: 1,
      justifyContent: 'center',
    },
  });

type SelectValueProps = Omit<React.ComponentPropsWithRef<typeof SelectPrimitive.ValueContent>, 'children'> & {
  placeholder?: string;
};

const SelectValue = ({ style, placeholder, ...props }: SelectValueProps) => {
  const styles = useStyles(selectValueStyles);
  return (
    <SelectPrimitive.ValueContent style={[styles.valueContent, style]} {...props}>
      <SelectPrimitive.Value numberOfLines={1} style={styles.value} />
      <SelectPrimitive.Placeholder numberOfLines={1} style={styles.placeholder}>
        {placeholder}
      </SelectPrimitive.Placeholder>
    </SelectPrimitive.ValueContent>
  );
};

const SelectPortal = ({ ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Portal>) => {
  return <SelectPrimitive.Portal {...props} />;
};

const SheetOverlayStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: `${colors.black}80`,
      justifyContent: 'center',
      zIndex: 50,
    },
  });

const SelectOverlay = ({ style, ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Overlay>) => {
  const styles = useStyles(SheetOverlayStyles);

  return (
    <SelectPrimitive.Overlay
      style={(pressableState) => [styles.overlay, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const selectPanelStyles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    zIndex: 50,
  },
});

const SelectPanel = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { bottom, left, right, top } = useSafeAreaInsets();
  const { sizes } = useTheme();
  return (
    <KeyboardAvoidingContent>
      <View
        style={[
          selectPanelStyles.panel,
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
    </KeyboardAvoidingContent>
  );
};

const selectContentStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.lg,
      flexDirection: 'column',
      height: '60%',
      maxHeight: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      width: '100%',
    },
  });

type SelectContentLayoutProps = React.ComponentPropsWithRef<typeof View> & {
  onLayoutReady?: () => void;
};

const SelectContentLayout = ({ onLayoutReady, style, onLayout, ...props }: SelectContentLayoutProps) => {
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

const SelectPanelAnimated = Animated.createAnimatedComponent(SelectPanel);
const SelectOverlayAnimated = Animated.createAnimatedComponent(SelectOverlay);

const SelectContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Content>) => {
  const styles = useStyles(selectContentStyles);
  const { open } = SelectPrimitive.useRootContext();
  const { animateIn, opacityAnim, translateAnim, visible } = useSheetAnimation({ open, side: 'bottom' });

  const animatedStyle = {
    transform: [{ translateY: translateAnim }],
  };

  return (
    <SelectPortal visible={visible}>
      <SelectContentLayout onLayoutReady={animateIn}>
        <SelectOverlayAnimated shouldRasterizeIOS style={{ opacity: opacityAnim }} />
        <SelectPanelAnimated shouldRasterizeIOS style={animatedStyle}>
          <TouchableWithoutFeedback touchSoundDisabled onPress={(event) => event.stopPropagation()}>
            <SelectPrimitive.Content pointerEvents="auto" style={[styles.content, style]} {...props} />
          </TouchableWithoutFeedback>
        </SelectPanelAnimated>
      </SelectContentLayout>
    </SelectPortal>
  );
};

const SelectHeaderStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
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

const SelectHeader = ({ style, children, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(SelectHeaderStyles);
  const { sizes, colors } = useTheme();

  return (
    <View style={[styles.header, style]} {...props}>
      <View style={styles.headerContent}>{children}</View>
      <SelectPrimitive.Close asChild>
        <Button size="icon" variant="ghost" style={styles.headerButton}>
          <ButtonIcon size={sizes.fontSize.lg} color={colors.foreground} name="X" />
        </Button>
      </SelectPrimitive.Close>
    </View>
  );
};

const SelectTitleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      fontSize: sizes.fontSize.lg,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const SelectTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(SelectTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const selectDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
  });

const SelectDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(selectDescriptionStyles);
  return <Text style={[styles.description, style]} {...props} />;
};

const SelectGroup = ({
  maxToRenderPerBatch = 5,
  windowSize = 1,
  removeClippedSubviews = true,
  initialNumToRender = 20,
  ...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.FlatListGroup>) => {
  return (
    <SelectPrimitive.FlatListGroup
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      removeClippedSubviews={removeClippedSubviews}
      initialNumToRender={initialNumToRender}
      keyExtractor={(item) => item.value.toString()}
      {...props}
    />
  );
};

const selectItemStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
    },
    item: {
      alignItems: 'center',
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      gap: sizes.gap.md,
      // height: sizes.dimension.xl,
      justifyContent: 'center',
      margin: sizes.margin.sm,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.lg,
    },
    pressed: {
      opacity: 0.8,
    },
    selected: {
      backgroundColor: `${colors.foreground}10`,
    },
  });

type SelectItemProps = Omit<React.ComponentPropsWithRef<typeof SelectPrimitive.Item>, 'children'> & {
  children?: ReactNode;
};

const SelectItem = ({ style, value: itemValue, children, disabled, ...props }: SelectItemProps) => {
  const styles = useStyles(selectItemStyles);
  const { colors, sizes } = useTheme();
  const { value } = SelectPrimitive.useRootContext();

  return (
    <SelectPrimitive.Item
      disabled={disabled}
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      value={itemValue}
      style={(pressableState) => [
        pressableState.pressed && styles.pressed,
        styles.item,
        itemValue === value && styles.selected,
        disabled && styles.disabled,
        typeof style === 'function' ? style(pressableState) : style,
      ]}
      {...props}
    >
      {children}
      <SelectPrimitive.ItemIndicator>
        <Icon name="Check" color={colors.foreground} size={sizes.fontSize.lg} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
};

const selectItemContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    itemContent: {
      flexGrow: 1,
      flexShrink: 1,
      gap: sizes.gap.sm,
    },
  });

const SelectItemContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(selectItemContentStyles);
  return <View style={[styles.itemContent, style]} {...props} />;
};

const selectItemAdornmentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    itemAdornment: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
  });

const SelectItemAdornment = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(selectItemAdornmentStyles);
  return <View style={[styles.itemAdornment, style]} {...props} />;
};

const itemTitleStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.foreground,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const SelectItemTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(itemTitleStyles);
  return <Text numberOfLines={1} style={[styles.title, style]} {...props} />;
};

const selectItemDescriptionStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
    },
  });

const SelectItemDescription = ({ style, size = 'sm', ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(selectItemDescriptionStyles);
  return <Text numberOfLines={1} style={[styles.description, style]} size={size} {...props} />;
};

const selectInputStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.xs,
      justifyContent: 'space-between',
      paddingHorizontal: sizes.padding.xl,
    },
    input: {
      color: colors.foreground,
      flexGrow: 1,
      height: sizes.dimension.xl,
      paddingHorizontal: sizes.padding.lg,
    },
  });

const SelectInput = ({ style, ...props }: React.ComponentPropsWithRef<typeof SelectPrimitive.Input>) => {
  const styles = useStyles(selectInputStyles);
  const { sizes, colors } = useTheme();

  return (
    <View style={styles.content}>
      <Icon name="Search" size={sizes.fontSize.lg} color={colors.mutedForeground} />
      <SelectPrimitive.Input placeholderTextColor={colors.mutedForeground} style={[styles.input, style]} {...props} />
    </View>
  );
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectOverlay,
  SelectPortal,
  SelectHeader,
  SelectTitle,
  SelectDescription,
  SelectGroup,
  SelectItem,
  SelectInput,
  SelectItemContent,
  SelectItemAdornment,
  SelectItemTitle,
  SelectItemDescription,
};
