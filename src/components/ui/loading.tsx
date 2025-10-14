import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const loadingStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    loading: {
      alignItems: 'center',
      flex: 1,
      gap: sizes.gap.md,
      justifyContent: 'center',
      padding: sizes.padding.xl,
    },
  });

const Loading = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(loadingStyles);
  return <View style={[styles.loading, style]} {...props} />;
};

const loadingTitleStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    loadingTitle: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
  });

const LoadingTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(loadingTitleStyles);
  return <Text style={[styles.loadingTitle, style]} {...props} />;
};

type LoadingIconProps = Omit<React.ComponentPropsWithRef<typeof ActivityIndicator>, 'name'>;

const LoadingIcon = ({ color, ...props }: LoadingIconProps) => {
  const { colors } = useTheme();
  return <ActivityIndicator size="large" color={color ?? colors.foreground} {...props} />;
};

export { Loading, LoadingTitle, LoadingIcon };
