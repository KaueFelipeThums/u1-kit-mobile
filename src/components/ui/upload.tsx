import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, ButtonIcon } from './button';
import { Icon, IconName } from './icon';
import { Text } from './text';
import * as UploadPrimitive from '@/components/primitves/upload';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const uploadStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    upload: {
      gap: sizes.gap.md,
    },
  });

const Upload = ({ style, ...props }: React.ComponentPropsWithRef<typeof UploadPrimitive.Root>) => {
  const styles = useStyles(uploadStyles);
  return <UploadPrimitive.Root style={[styles.upload, style]} {...props} />;
};

const uploadTriggerStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
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
      flex: 1,
      gap: sizes.gap.sm,
      height: sizes.dimension.xl,
      justifyContent: 'space-between',
      minWidth: 0,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.xs,
    },
  });

type UploadTriggerProps = Omit<React.ComponentPropsWithRef<typeof UploadPrimitive.Trigger>, 'children'> & {
  children?: React.ReactNode;
};

const UploadTrigger = ({ style, disabled, children, ...props }: UploadTriggerProps) => {
  const { colors, sizes } = useTheme();
  const styles = useStyles(uploadTriggerStyles);
  const { disabled: disabledRoot, isMaxFilesReached, loading } = UploadPrimitive.useRootContext();
  const isDisabled = disabledRoot || disabled || isMaxFilesReached || loading;

  return (
    <UploadPrimitive.Trigger
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
        {loading ? (
          <ActivityIndicator size="small" color={colors.mutedForeground} />
        ) : (
          <Icon name="Upload" size={sizes.fontSize.md} color={colors.mutedForeground} />
        )}
      </View>
    </UploadPrimitive.Trigger>
  );
};

const uploadCameraTriggerStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
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
      height: sizes.dimension.xl,
      justifyContent: 'center',
      minWidth: 0,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.xs,
      width: sizes.dimension.xl,
    },
  });

const UploadCameraTrigger = ({
  style,
  disabled,
  ...props
}: React.ComponentPropsWithRef<typeof UploadPrimitive.Trigger>) => {
  const { colors, sizes } = useTheme();
  const styles = useStyles(uploadCameraTriggerStyles);
  const { disabled: disabledRoot, isMaxFilesReached } = UploadPrimitive.useRootContext();
  const isDisabled = disabledRoot || disabled || isMaxFilesReached;

  return (
    <UploadPrimitive.CameraTrigger
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
      <Icon name="Camera" size={sizes.fontSize.md} color={colors.mutedForeground} />
    </UploadPrimitive.CameraTrigger>
  );
};

const uploadPlaceholderStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    placeholder: {
      color: colors.mutedForeground,
      flex: 1,
      flexGrow: 1,
      flexShrink: 1,
      fontSize: sizes.fontSize.md,
    },
  });

type SelectValueProps = React.ComponentPropsWithRef<typeof Text>;

const UploadPlaceholder = ({ style, ...props }: SelectValueProps) => {
  const styles = useStyles(uploadPlaceholderStyles);
  return <Text numberOfLines={1} style={[styles.placeholder, style]} {...props} />;
};

const uploadFileListStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    list: {
      flexDirection: 'column',
      gap: sizes.gap.md,
    },
  });

const UploadFileList = ({
  style,
  renderItem,
  ...props
}: Omit<React.ComponentPropsWithRef<typeof View>, 'children'> &
  React.ComponentPropsWithRef<typeof UploadPrimitive.Value>) => {
  const styles = useStyles(uploadFileListStyles);
  return (
    <View style={[styles.list, style]} {...props}>
      <UploadPrimitive.Value renderItem={renderItem} />
    </View>
  );
};

const uploadFileListItemStyles = ({ sizes, colors }: ThemeValue) =>
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

const UploadFileListItem = ({ style, ...props }: React.ComponentPropsWithRef<typeof UploadPrimitive.Item>) => {
  const styles = useStyles(uploadFileListItemStyles);
  return <UploadPrimitive.Item style={[styles.item, style]} {...props} />;
};

const uploadFileListHeaderStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.lg,
    },
  });

const UploadFileListHeader = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(uploadFileListHeaderStyles);
  return <View style={[styles.header, style]} {...props} />;
};

const uploadFileListIconContentStyles = ({ sizes, colors }: ThemeValue) =>
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

const UploadFileListIconContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(uploadFileListIconContentStyles);
  return <View style={[styles.iconContent, style]} {...props} />;
};

type UploadFileListIconProps = Omit<React.ComponentPropsWithRef<typeof Icon>, 'name'> & {
  name?: IconName;
};

const UploadFileListIcon = ({ color, name = 'FileText', ...props }: UploadFileListIconProps) => {
  const { colors } = useTheme();

  return <Icon name={name} color={color ?? colors.mutedForeground} {...props} />;
};

const uploadFileListInfoStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    info: {
      flex: 1,
      flexGrow: 1,
      flexShrink: 1,
      gap: sizes.gap.xs,
    },
  });

const UploadFileListInfo = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(uploadFileListInfoStyles);
  return <View style={[styles.info, style]} {...props} />;
};

const uploadFileListNameStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    name: {
      color: colors.foreground,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
  });

const UploadFileListName = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(uploadFileListNameStyles);
  return <Text style={[styles.name, style]} {...props} />;
};

const uploadFileListDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.xs,
    },
  });

const UploadFileListDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const styles = useStyles(uploadFileListDescriptionStyles);
  return <Text style={[styles.description, style]} {...props} />;
};

const UploadFileListDescriptionSeparator = ({ children, ...props }: React.ComponentPropsWithRef<typeof Text>) => (
  <Text {...props}>{children ?? '•'}</Text>
);

const uploadFileListActionsStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    actions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.sm,
    },
  });

const UploadFileListActions = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(uploadFileListActionsStyles);
  return <View style={[styles.actions, style]} {...props} />;
};

const uploadFileListActionStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    action: {
      height: sizes.dimension.md,
      width: sizes.dimension.md,
    },
  });

const UploadFileListRemove = ({
  style,
  variant = 'outline',
  size = 'icon',
  ...props
}: React.ComponentProps<typeof Button>) => {
  const styles = useStyles(uploadFileListActionStyles);

  return (
    <UploadPrimitive.ItemRemove asChild>
      <Button
        variant={variant}
        size={size}
        style={(styleState) => [styles.action, typeof style === 'function' ? style(styleState) : style]}
        {...props}
      />
    </UploadPrimitive.ItemRemove>
  );
};

const uploadTriggerContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
  });

const UploadTriggerContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(uploadTriggerContentStyles);
  return <View style={[styles.content, style]} {...props} />;
};

const UploadFileListActionIcon = ButtonIcon;

export {
  Upload,
  UploadPlaceholder,
  UploadTrigger,
  UploadCameraTrigger,
  UploadFileList,
  UploadFileListItem,
  UploadFileListHeader,
  UploadFileListIconContent,
  UploadFileListIcon,
  UploadFileListInfo,
  UploadFileListName,
  UploadFileListDescription,
  UploadFileListDescriptionSeparator,
  UploadFileListActions,
  UploadFileListRemove,
  UploadFileListActionIcon,
  UploadTriggerContent,
};
