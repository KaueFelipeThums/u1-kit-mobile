import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const cardStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.sm,
      flexDirection: 'column',
      gap: sizes.gap.lg,
      overflow: 'hidden',
      paddingVertical: sizes.padding.lg,
    },
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    pressed: {
      opacity: 0.8,
    },
  });

const Card = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(cardStyles);
  return <View style={[styles.card, style]} {...props} />;
};

const CardPressable = ({ style, disabled, ...props }: React.ComponentPropsWithRef<typeof Pressable>) => {
  const styles = useStyles(cardStyles);
  const { colors } = useTheme();

  return (
    <Pressable
      disabled={disabled}
      android_ripple={{
        color: `${colors.foreground}05`,
        foreground: true,
      }}
      style={(styleState) => [
        styles.card,
        disabled && styles.disabled,
        styleState.pressed && styles.pressed,
        typeof style === 'function' ? style(styleState) : style,
      ]}
      {...props}
    />
  );
};

const cardHeaderStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    header: {
      flexDirection: 'column',
      gap: sizes.gap.sm,
      paddingHorizontal: sizes.padding.xl,
    },
  });

const CardHeader = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(cardHeaderStyles);
  return <View style={[styles.header, style]} {...props} />;
};

const cardContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: sizes.padding.xl,
    },
  });

const CardContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(cardContentStyles);
  return <View style={[styles.content, style]} {...props} />;
};

const cardFooterStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    footer: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: sizes.padding.xl,
    },
  });

const CardFooter = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(cardFooterStyles);
  return <View style={[styles.footer, style]} {...props} />;
};

const cardTitleStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.cardForeground,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const CardTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(cardTitleStyles);
  return <Text style={[styles.title, style]} {...props} />;
};

const cardDescriptionStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
    },
  });

const CardDescription = ({ style, size = 'sm', ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(cardDescriptionStyles);
  return <Text style={[styles.description, style]} size={size} {...props} />;
};

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, CardPressable };
