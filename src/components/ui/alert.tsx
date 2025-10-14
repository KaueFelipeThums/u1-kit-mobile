import { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from './icon';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const AlertContext = createContext<{ variant: 'default' | 'destructive' }>({ variant: 'default' });

type AlertProps = React.ComponentPropsWithRef<typeof View> & {
  variant: 'default' | 'destructive';
};

const alertStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    alert: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      flexDirection: 'row',
      gap: sizes.gap.lg,
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.lg,
      width: '100%',
    },
    alertDestructive: {
      backgroundColor: `${colors.destructive}10`,
      borderColor: colors.destructive,
    },
  });

const Alert = ({ style, variant = 'default', ...props }: AlertProps) => {
  const styles = useStyles(alertStyles);

  return (
    <AlertContext.Provider value={{ variant }}>
      <View style={[styles.alert, variant === 'destructive' && styles.alertDestructive, style]} {...props} />
    </AlertContext.Provider>
  );
};

function useAlertContext() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('Dialog compound components cannot be rendered outside the Dialog component');
  }
  return context;
}

type AlertContentProps = React.ComponentPropsWithRef<typeof View>;

const alertContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      alignItems: 'flex-start',
      flex: 1,
      gap: sizes.gap.sm,
    },
  });

const AlertContent = ({ style, ...props }: AlertContentProps) => {
  const styles = useStyles(alertContentStyles);
  return <View style={[styles.content, style]} {...props} />;
};

type AlertTitleProps = React.ComponentPropsWithRef<typeof Text>;

const alertTitleStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    title: {
      fontWeight: sizes.fontWeight.medium,
    },
    titleDestructive: {
      color: colors.destructive,
    },
  });

const AlertTitle = ({ style, ...props }: AlertTitleProps) => {
  const { variant } = useAlertContext();
  const styles = useStyles(alertTitleStyles);
  return <Text style={[styles.title, variant === 'destructive' && styles.titleDestructive, style]} {...props} />;
};

type AlertDescroptionProps = React.ComponentPropsWithRef<typeof Text>;

const alertDescroptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      fontSize: sizes.fontSize.sm,
    },
    descriptionDestructive: {
      color: colors.destructive,
    },
  });

const AlertDescription = ({ style, ...props }: AlertDescroptionProps) => {
  const { variant } = useAlertContext();
  const styles = useStyles(alertDescroptionStyles);
  return (
    <Text style={[styles.description, variant === 'destructive' && styles.descriptionDestructive, style]} {...props} />
  );
};

const AlertIcon = ({ color, ...props }: React.ComponentPropsWithRef<typeof Icon>) => {
  const { variant } = useAlertContext();
  const { colors } = useTheme();
  return <Icon color={color ?? (variant === 'destructive' ? colors.destructive : colors.foreground)} {...props} />;
};

export { Alert, AlertContent, AlertTitle, AlertDescription, AlertIcon };
