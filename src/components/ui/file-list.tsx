import { StyleSheet, View } from 'react-native';
import { Button, ButtonIcon } from './button';
import { Icon, IconName } from './icon';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const fileListStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    list: {
      flexDirection: 'column',
      gap: sizes.gap.md,
    },
  });

const FileList = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(fileListStyles);
  return <View style={[styles.list, style]} {...props} />;
};

const fileListItemStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    item: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.md,
      gap: sizes.gap.md,
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.md,
    },
  });

const FileListItem = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(fileListItemStyles);
  return <View style={[styles.item, style]} {...props} />;
};

const fileListHeaderStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.lg,
    },
  });

const FileListHeader = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(fileListHeaderStyles);
  return <View style={[styles.header, style]} {...props} />;
};

const fileListIconContentStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    iconContent: {
      alignItems: 'center',
      backgroundColor: colors.muted,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      height: sizes.dimension.lg,
      justifyContent: 'center',
      width: sizes.dimension.lg,
    },
  });

const FileListIconContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(fileListIconContentStyles);
  return <View style={[styles.iconContent, style]} {...props} />;
};

type FileListIconProps = Omit<React.ComponentPropsWithRef<typeof Icon>, 'name'> & {
  name?: IconName;
};

const FileListIcon = ({ color, name = 'FileText', ...props }: FileListIconProps) => {
  const { colors } = useTheme();

  return <Icon name={name} color={color ?? colors.mutedForeground} {...props} />;
};

const fileListInfoStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    info: {
      flex: 1,
      flexGrow: 1,
      flexShrink: 1,
      gap: sizes.gap.xs,
    },
  });

const FileListInfo = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(fileListInfoStyles);
  return <View style={[styles.info, style]} {...props} />;
};

const fileListNameStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    name: {
      color: colors.foreground,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const FileListName = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(fileListNameStyles);
  return <Text style={[styles.name, style]} {...props} />;
};

const fileListDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.xs,
    },
  });

const FileListDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(fileListDescriptionStyles);
  return <Text style={[styles.description, style]} {...props} />;
};

const FileListDescriptionSeparator = ({ children, ...props }: React.ComponentPropsWithRef<typeof Text>) => (
  <Text {...props}>{children ?? '•'}</Text>
);

const fileListActionsStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    actions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.sm,
    },
  });

const FileListActions = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(fileListActionsStyles);
  return <View style={[styles.actions, style]} {...props} />;
};

const fileListActionStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    action: {
      height: sizes.dimension.md,
      width: sizes.dimension.md,
    },
  });

const FileListAction = ({
  style,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) => {
  const styles = useStyles(fileListActionStyles);
  return (
    <Button
      variant={variant}
      size={size}
      style={(styleState) => [styles.action, typeof style === 'function' ? style(styleState) : style]}
      {...props}
    />
  );
};

const FileListActionIcon = ButtonIcon;

export {
  FileList,
  FileListItem,
  FileListHeader,
  FileListIconContent,
  FileListIcon,
  FileListInfo,
  FileListName,
  FileListDescription,
  FileListDescriptionSeparator,
  FileListAction,
  FileListActions,
  FileListActionIcon,
};
