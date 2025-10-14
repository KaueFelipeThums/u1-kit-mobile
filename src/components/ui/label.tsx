import { StyleSheet } from 'react-native';
import * as LabelPrimitive from '@/components/primitves/label';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const labelStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
    },
    label: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
    },
  });

const Label = ({ style, disabled, ...props }: React.ComponentPropsWithRef<typeof LabelPrimitive.Root>) => {
  const styles = useStyles(labelStyles);
  return (
    <LabelPrimitive.Root disabled={disabled} style={[styles.label, disabled && styles.disabled, style]} {...props} />
  );
};

const labelTitleStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    title: {
      color: colors.foreground,
      fontSize: sizes.fontSize.md,
    },
  });

const LabelTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof LabelPrimitive.Text>) => {
  const styles = useStyles(labelTitleStyles);
  return <LabelPrimitive.Text style={[styles.title, style]} {...props} />;
};

export { Label, LabelTitle };
