import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const itemStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    item: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.xl,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.xl,
    },
    pressed: {
      opacity: 0.8,
    },
  });

const Item = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(itemStyles);
  return <View style={[styles.item, style]} {...props} />;
};

const ItemPressable = ({ style, disabled, ...props }: React.ComponentPropsWithRef<typeof Pressable>) => {
  const styles = useStyles(itemStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      disabled={disabled}
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      style={(styleState) => [
        styles.item,
        disabled && styles.disabled,
        styleState.pressed && styles.pressed,
        typeof style === 'function' ? style(styleState) : style,
      ]}
      {...props}
    />
  );
};

const itemContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    itemContent: {
      flexGrow: 1,
      flexShrink: 1,
      gap: sizes.gap.sm,
    },
  });

const ItemContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(itemContentStyles);
  return <View style={[styles.itemContent, style]} {...props} />;
};

const itemAdornmentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    itemAdornment: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
  });

const ItemAdornment = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(itemAdornmentStyles);
  return <View style={[styles.itemAdornment, style]} {...props} />;
};

const itemTitleStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.foreground,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const ItemTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(itemTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const itemDescriptionStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
    },
  });

const ItemDescription = ({ style, size = 'sm', ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(itemDescriptionStyles);
  return <Text style={[styles.description, style]} size={size} {...props} />;
};

export { Item, ItemPressable, ItemContent, ItemAdornment, ItemTitle, ItemDescription };
