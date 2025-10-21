import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type BadgeContextProps = {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
};

const BadgeContext = React.createContext<BadgeContextProps>({ variant: 'default' });

export const useBadgeContext = () => {
  const context = React.useContext(BadgeContext);
  if (!context) {
    throw new Error('Badge compound components cannot be rendered outside the Badge component');
  }
  return context;
};

type BadgeProps = React.ComponentPropsWithRef<typeof View> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

const badgeStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    badge: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: sizes.radius.lg,
      borderWidth: sizes.border.sm,
      flexDirection: 'row',
      flexShrink: 0,
      gap: sizes.gap.md,
      justifyContent: 'center',
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.md,
      paddingVertical: sizes.padding.xs,
    },
  });

const badgeVariants = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    default: {
      backgroundColor: colors.primary,
      borderColor: colors.transparent,
    },
    destructive: {
      backgroundColor: colors.destructive,
      borderColor: colors.transparent,
    },
    outline: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderColor: colors.transparent,
    },
  });

const Badge = ({ style, variant = 'default', ...props }: BadgeProps) => {
  const styles = useStyles(badgeStyles);
  const variants = useStyles(badgeVariants);
  return (
    <BadgeContext.Provider value={{ variant }}>
      <View style={[styles.badge, variants[variant], style]} {...props} />
    </BadgeContext.Provider>
  );
};

const badgeTextStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    text: {
      flexShrink: 1,
      fontSize: sizes.fontSize.xs,
    },
  });

const badgeTextVariants = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    default: {
      color: colors.primaryForeground,
    },
    destructive: {
      color: colors.white,
    },
    outline: {
      color: colors.foreground,
    },
    secondary: {
      color: colors.secondaryForeground,
    },
  });

const BadgeTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const { variant = 'default' } = useBadgeContext();
  const variants = useStyles(badgeTextVariants);
  const styles = useStyles(badgeTextStyles);

  return <Text style={[variants[variant], styles.text, style]} {...props} />;
};

export { Badge, BadgeTitle };
