import { ReactNode, useCallback, useRef } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, TextProps, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ButtonIcon } from './button';
import { Icon } from './icon';
import { KeyboardAvoidingContent } from './keyboard-avoid-content';
import { Text } from './text';
import * as SelectMultiplePrimitive from '@/components/primitves/select-multiple';
import { useSheetAnimation } from '@/hooks/use-sheet-animation';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const SelectMultiple = ({ ...props }: React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Root>) => {
  return <SelectMultiplePrimitive.Root {...props} />;
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
      justifyContent: 'space-between',
      minHeight: sizes.dimension.xl,
      minWidth: 0,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.sm,
      width: '100%',
    },
  });

type SelectMultipleTriggerProps = Omit<
  React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Trigger>,
  'children'
> & {
  children?: React.ReactNode;
};

const SelectMultipleTrigger = ({ disabled, style, children, ...props }: SelectMultipleTriggerProps) => {
  const styles = useStyles(selectTriggerStyles);
  const { disabled: disabledRoot } = SelectMultiplePrimitive.useRootContext();
  const { colors, sizes } = useTheme();
  const isDisabled = disabledRoot || disabled;

  return (
    <SelectMultiplePrimitive.Trigger
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
    </SelectMultiplePrimitive.Trigger>
  );
};

const selectValueStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    placeholder: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.md,
    },
    valueContent: {
      flexDirection: 'row',
      flexGrow: 1,
      flexShrink: 1,
      flexWrap: 'wrap',
      gap: sizes.gap.md,
    },
  });

type SelectMultipleValueProps = Omit<
  React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.ValueContent>,
  'children'
> &
  React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Value> & {
    placeholder?: string;
  };

const SelectMultipleValue = ({ style, placeholder, renderItem, ...props }: SelectMultipleValueProps) => {
  const styles = useStyles(selectValueStyles);
  return (
    <SelectMultiplePrimitive.ValueContent style={[styles.valueContent, style]} {...props}>
      <SelectMultiplePrimitive.Value renderItem={renderItem} />
      <SelectMultiplePrimitive.Placeholder numberOfLines={1} style={styles.placeholder}>
        {placeholder}
      </SelectMultiplePrimitive.Placeholder>
    </SelectMultiplePrimitive.ValueContent>
  );
};

const SelectMultiplePortal = ({ ...props }: React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Portal>) => {
  return <SelectMultiplePrimitive.Portal {...props} />;
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

const SelectMultipleOverlay = ({
  style,
  ...props
}: React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Overlay>) => {
  const styles = useStyles(SheetOverlayStyles);

  return (
    <SelectMultiplePrimitive.Overlay
      style={(pressableState) => [styles.overlay, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const selectMultiplePanelStyles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    zIndex: 50,
  },
});

const SelectMultiplePanel = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { bottom, left, right, top } = useSafeAreaInsets();
  const { sizes } = useTheme();
  return (
    <KeyboardAvoidingContent>
      <View
        style={[
          selectMultiplePanelStyles.panel,
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

type SelectMultipleContentLayoutProps = React.ComponentPropsWithRef<typeof View> & {
  onLayoutReady?: () => void;
};

const SelectMultipleContentLayout = ({
  onLayoutReady,
  style,
  onLayout,
  ...props
}: SelectMultipleContentLayoutProps) => {
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

const SelectMultiplePanelAnimated = Animated.createAnimatedComponent(SelectMultiplePanel);
const SelectMultipleOverlayAnimated = Animated.createAnimatedComponent(SelectMultipleOverlay);

const SelectMultipleContent = ({
  style,
  ...props
}: React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Content>) => {
  const styles = useStyles(selectContentStyles);
  const { open } = SelectMultiplePrimitive.useRootContext();
  const { animateIn, opacityAnim, translateAnim, visible } = useSheetAnimation({ open, side: 'bottom' });

  const animatedStyle = {
    transform: [{ translateY: translateAnim }],
  };

  return (
    <SelectMultiplePortal visible={visible}>
      <SelectMultipleContentLayout onLayoutReady={animateIn}>
        <SelectMultipleOverlayAnimated shouldRasterizeIOS style={{ opacity: opacityAnim }} />
        <SelectMultiplePanelAnimated shouldRasterizeIOS style={animatedStyle}>
          <TouchableWithoutFeedback touchSoundDisabled onPress={(event) => event.stopPropagation()}>
            <SelectMultiplePrimitive.Content style={[styles.content, style]} {...props} />
          </TouchableWithoutFeedback>
        </SelectMultiplePanelAnimated>
      </SelectMultipleContentLayout>
    </SelectMultiplePortal>
  );
};

const SelectMultipleHeaderStyles = ({ sizes }: ThemeValue) =>
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

const SelectMultipleHeader = ({ style, children, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(SelectMultipleHeaderStyles);
  const { sizes, colors } = useTheme();

  return (
    <View style={[styles.header, style]} {...props}>
      <View style={styles.headerContent}>{children}</View>
      <SelectMultiplePrimitive.Close asChild>
        <Button size="icon" variant="ghost" style={styles.headerButton}>
          <ButtonIcon size={sizes.fontSize.lg} color={colors.foreground} name="X" />
        </Button>
      </SelectMultiplePrimitive.Close>
    </View>
  );
};

const SelectMultipleTitleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      fontSize: sizes.fontSize.lg,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const SelectMultipleTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(SelectMultipleTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const selectDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
  });

const SelectMultipleDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(selectDescriptionStyles);
  return <Text style={[styles.description, style]} {...props} />;
};

const SelectMultipleGroup = ({
  maxToRenderPerBatch = 5,
  windowSize = 1,
  removeClippedSubviews = true,
  initialNumToRender = 20,
  ...props
}: React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.FlatListGroup>) => {
  return (
    <SelectMultiplePrimitive.FlatListGroup
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

type SelectItemProps = Omit<React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Item>, 'children'> & {
  children?: ReactNode;
};

const SelectMultipleItem = ({ style, value: itemValue, disabled, children, ...props }: SelectItemProps) => {
  const styles = useStyles(selectItemStyles);
  const { colors, sizes } = useTheme();
  const { value } = SelectMultiplePrimitive.useRootContext();

  return (
    <SelectMultiplePrimitive.Item
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      value={itemValue}
      style={(triggerState) => [
        triggerState.pressed && styles.pressed,
        styles.item,
        value?.includes(itemValue) && styles.selected,
        disabled && styles.disabled,
        typeof style === 'function' ? style(triggerState) : style,
      ]}
      {...props}
    >
      {children}
      <SelectMultiplePrimitive.ItemIndicator>
        <Icon name="Check" color={colors.foreground} size={sizes.fontSize.lg} />
      </SelectMultiplePrimitive.ItemIndicator>
    </SelectMultiplePrimitive.Item>
  );
};

const selectMultipleItemContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    itemContent: {
      flexGrow: 1,
      flexShrink: 1,
      gap: sizes.gap.sm,
    },
  });

const SelectMultipleItemContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(selectMultipleItemContentStyles);
  return <View style={[styles.itemContent, style]} {...props} />;
};

const selectMultipleItemAdornmentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    itemAdornment: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
  });

const SelectMultipleItemAdornment = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(selectMultipleItemAdornmentStyles);
  return <View style={[styles.itemAdornment, style]} {...props} />;
};

const itemMultipleTitleStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.foreground,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const SelectMultipleItemTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(itemMultipleTitleStyles);
  return <Text numberOfLines={1} style={[styles.title, style]} {...props} />;
};

const selectMultipleItemDescriptionStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
    },
  });

const SelectMultipleItemDescription = ({ style, size = 'sm', ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(selectMultipleItemDescriptionStyles);
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

const SelectMultipleInput = ({
  style,
  ...props
}: React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.Input>) => {
  const styles = useStyles(selectInputStyles);
  const { sizes, colors } = useTheme();

  return (
    <View style={styles.content}>
      <Icon name="Search" size={sizes.fontSize.lg} color={colors.mutedForeground} />
      <SelectMultiplePrimitive.Input
        placeholderTextColor={colors.mutedForeground}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
};

const selectMultipleTagStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    remove: {
      alignItems: 'center',
      borderRadius: sizes.radius.full,
      justifyContent: 'center',
      overflow: 'hidden',
      padding: sizes.padding.sm,
    },
    tag: {
      alignItems: 'center',
      backgroundColor: colors.seccondary,
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      flex: 0,
      gap: sizes.gap.sm,
      justifyContent: 'center',
      paddingHorizontal: sizes.padding.md,
      paddingVertical: sizes.padding.xs,
    },
    text: {
      color: colors.foreground,
      flexShrink: 1,
      fontSize: sizes.fontSize.sm,
    },
  });

type SelectMultipleTagProps = Omit<React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.TagItem>, 'children'> &
  Pick<TextProps, 'children'>;

const SelectMultipleTag = ({ style, children, ...props }: SelectMultipleTagProps) => {
  const styles = useStyles(selectMultipleTagStyles);
  const { colors, sizes } = useTheme();

  return (
    <SelectMultiplePrimitive.TagItem style={[styles.tag, style]} {...props}>
      <Text style={styles.text} numberOfLines={1}>
        {children}
      </Text>
      <SelectMultiplePrimitive.TagItemRemove
        style={styles.remove}
        android_ripple={{
          color: `${colors.foreground}20`,
          foreground: true,
        }}
      >
        <Icon name="X" color={colors.foreground} size={sizes.fontSize.lg} />
      </SelectMultiplePrimitive.TagItemRemove>
    </SelectMultiplePrimitive.TagItem>
  );
};

const selectItemAllStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      gap: sizes.gap.md,
      height: sizes.dimension.xl,
      justifyContent: 'center',
      margin: sizes.margin.sm,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.xl,
    },
    pressed: {
      opacity: 0.8,
    },
    selected: {
      backgroundColor: `${colors.foreground}10`,
    },
    text: {
      color: colors.foreground,
      flexGrow: 1,
      flexShrink: 1,
      fontSize: sizes.fontSize.md,
      fontWeight: sizes.fontWeight.medium,
    },
  });

type SelectMultipleItemAllProps = Omit<
  React.ComponentPropsWithRef<typeof SelectMultiplePrimitive.ItemAll>,
  'children'
> &
  Pick<TextProps, 'children'>;

const SelectMultipleItemAll = ({ style, children, ...props }: SelectMultipleItemAllProps) => {
  const styles = useStyles(selectItemAllStyles);
  const { colors, sizes } = useTheme();
  const { value, options } = SelectMultiplePrimitive.useRootContext();
  const isSelected: boolean = value?.length && value.length > 0 && value.length === options?.length ? true : false;

  return (
    <SelectMultiplePrimitive.ItemAll
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      style={(triggerState) => [
        triggerState.pressed && styles.pressed,
        styles.item,
        isSelected && styles.selected,
        typeof style === 'function' ? style(triggerState) : style,
      ]}
      {...props}
    >
      <Text style={styles.text} numberOfLines={1}>
        {children}
      </Text>
      <SelectMultiplePrimitive.ItemAllIndicator>
        <Icon name="Check" color={colors.foreground} size={sizes.fontSize.lg} />
      </SelectMultiplePrimitive.ItemAllIndicator>
    </SelectMultiplePrimitive.ItemAll>
  );
};

const selectMultipleTagCountStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    tag: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      flexDirection: 'row',
      flex: 0,
      gap: sizes.gap.sm,
      justifyContent: 'center',
      paddingHorizontal: sizes.padding.md,
      paddingVertical: sizes.padding.xs,
    },
    text: {
      color: colors.foreground,
      flexShrink: 1,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
  });

type SelectMultipleTagCountProps = Omit<React.ComponentPropsWithRef<typeof View>, 'children'> &
  Pick<TextProps, 'children'>;

const SelectMultipleTagCount = ({ style, children, ...props }: SelectMultipleTagCountProps) => {
  const styles = useStyles(selectMultipleTagCountStyles);
  return (
    <View style={[styles.tag, style]} {...props}>
      <Text style={styles.text} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
};

export {
  SelectMultiple,
  SelectMultipleTrigger,
  SelectMultipleValue,
  SelectMultipleContent,
  SelectMultipleOverlay,
  SelectMultiplePortal,
  SelectMultipleHeader,
  SelectMultipleTitle,
  SelectMultipleDescription,
  SelectMultipleGroup,
  SelectMultipleItem,
  SelectMultipleInput,
  SelectMultipleTag,
  SelectMultipleItemAll,
  SelectMultipleTagCount,
  SelectMultipleItemContent,
  SelectMultipleItemAdornment,
  SelectMultipleItemTitle,
  SelectMultipleItemDescription,
};
