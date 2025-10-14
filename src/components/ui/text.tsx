import { Text as RNText, StyleSheet } from 'react-native';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const textStyles = (theme: ThemeValue) =>
  StyleSheet.create({
    text: {
      color: theme.colors.foreground,
      flexShrink: 1,
    },
  });

const textAlignStyles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
});

const textSizeStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    lg: {
      fontSize: sizes.fontSize.lg,
    },
    md: {
      fontSize: sizes.fontSize.md,
    },
    sm: {
      fontSize: sizes.fontSize.sm,
    },
    xl: {
      fontSize: sizes.fontSize.xl,
    },
    xs: {
      fontSize: sizes.fontSize.xs,
    },
  });

const textWeightStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    bold: {
      fontWeight: sizes.fontWeight.bold,
    },
    medium: {
      fontWeight: sizes.fontWeight.medium,
    },
    normal: {
      fontWeight: sizes.fontWeight.normal,
    },
  });

type TextProps = React.ComponentPropsWithRef<typeof RNText> & {
  align?: 'center' | 'left' | 'right';
  size?: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
  weight?: 'bold' | 'medium' | 'normal';
};

const Text = ({ style, align = 'left', size = 'md', weight = 'normal', ...props }: TextProps) => {
  const styles = useStyles(textStyles);
  const sizeStyles = useStyles(textSizeStyles);
  const weightStyles = useStyles(textWeightStyles);

  return (
    <RNText style={[styles.text, textAlignStyles[align], sizeStyles[size], weightStyles[weight], style]} {...props} />
  );
};

export { Text };
