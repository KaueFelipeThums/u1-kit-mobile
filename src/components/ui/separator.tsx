import { StyleSheet, View } from 'react-native';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type SeparatorProps = React.ComponentPropsWithRef<typeof View> & {
  orientation?: 'horizontal' | 'vertical';
};

const separatorStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    separator: {
      backgroundColor: colors.border,
      flexShrink: 0,
    },
  });

const orientationStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    horizontal: {
      height: sizes.border.sm,
      width: '100%',
    },
    vertical: {
      height: '100%',
      width: sizes.border.sm,
    },
  });

const Separator = ({ orientation = 'horizontal', style, ...props }: SeparatorProps) => {
  const styles = useStyles(separatorStyles);
  const Orientation = useStyles(orientationStyles);

  return <View style={[styles.separator, Orientation[orientation], style]} {...props} />;
};

export { Separator };
