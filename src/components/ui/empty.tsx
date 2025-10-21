import { StyleSheet, View } from 'react-native';
import { Icon, IconName } from './icon';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const emptyStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    empty: {
      alignItems: 'center',
      flex: 1,
      gap: sizes.gap.md,
      justifyContent: 'center',
      padding: sizes.padding.xl,
    },
  });

const Empty = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(emptyStyles);
  return <View style={[styles.empty, style]} {...props} />;
};

const emptyTitleStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    emptyTitle: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
  });

const EmptyTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(emptyTitleStyles);
  return <Text style={[styles.emptyTitle, style]} {...props} />;
};

type EmptyIconProps = Omit<React.ComponentPropsWithRef<typeof Icon>, 'name'> & {
  name?: IconName;
};

const EmptyIcon = ({ name = 'Search', size, color, ...props }: EmptyIconProps) => {
  const { colors, sizes } = useTheme();
  return <Icon name={name} size={size ?? sizes.dimension.xl} color={color ?? colors.border} {...props} />;
};

export { Empty, EmptyTitle, EmptyIcon };
