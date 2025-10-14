import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, IconName } from './icon';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const Breadcrumb = (props: React.ComponentPropsWithRef<typeof View>) => {
  return <View {...props} />;
};

const breadcrumbListStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    list: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: sizes.gap.md,
    },
  });

const BreadcrumbList = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(breadcrumbListStyles);
  return <View style={[styles.list, style]} {...props} />;
};

const breadcrumbItemStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    item: {
      alignItems: 'center',
      gap: sizes.gap.sm,
    },
  });

const BreadcrumbItem = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(breadcrumbItemStyles);
  return <View style={[styles.item, style]} {...props} />;
};

type BreadcrumbTitleProps = React.ComponentPropsWithRef<typeof Text> & {
  current?: boolean;
};

const breadcrumbTitleStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
    titleCurrent: {
      color: colors.foreground,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const BreadcrumbTitle = ({ style, current, ...props }: BreadcrumbTitleProps) => {
  const styles = useStyles(breadcrumbTitleStyles);
  return <Text style={[styles.title, current && styles.titleCurrent, style]} {...props} />;
};
type BreadcrumbSeparatorProps = Omit<React.ComponentPropsWithRef<typeof Icon>, 'name'> & {
  name?: IconName;
};

const BreadcrumbSeparator = ({ name, color, size, ...props }: BreadcrumbSeparatorProps) => {
  const { colors, sizes } = useTheme();
  return (
    <Icon
      name={name ?? 'ChevronRight'}
      color={color ?? colors.mutedForeground}
      size={size ?? sizes.fontSize.md}
      {...props}
    />
  );
};

type BreadcrumbEllipsisProps = Omit<React.ComponentPropsWithRef<typeof Icon>, 'name'> & {
  name?: IconName;
};

const BreadcrumbEllipsis = ({ name, color, size, ...props }: BreadcrumbEllipsisProps) => {
  const { colors, sizes } = useTheme();
  return (
    <Icon
      name={name ?? 'Ellipsis'}
      color={color ?? colors.mutedForeground}
      size={size ?? sizes.fontSize.md}
      {...props}
    />
  );
};

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbTitle, BreadcrumbSeparator, BreadcrumbEllipsis };
