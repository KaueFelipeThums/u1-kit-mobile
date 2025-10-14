import { ReactElement, ReactNode } from 'react';
import { Controller, FieldValues, FieldPath, ControllerProps } from 'react-hook-form';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerProps<TFieldValues, TName> & {
  label?: ReactNode | string;
  description?: ReactNode | string;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  hideErrorMessage?: boolean;
  formControlClassName?: string;
};

const formFieldStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.xs,
    },
    disabled: {
      opacity: 0.8,
    },
    error: {
      color: colors.destructive,
      fontSize: sizes.fontSize.xs,
    },
    label: {
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
    required: {
      color: colors.destructive,
    },
  });

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  contentStyle,
  labelStyle,
  descriptionStyle,
  errorStyle,
  rules,
  disabled = false,
  hideErrorMessage = false,
  defaultValue,
  render,
}: FormFieldProps<TFieldValues, TName>): ReactElement => {
  const styles = useStyles(formFieldStyles);

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState, formState }) => (
        <View style={[styles.content, contentStyle]}>
          {label && (
            <Text style={[styles.label, disabled && styles.disabled, labelStyle]}>
              {label} {rules?.required && <Text style={styles.required}>*</Text>}
            </Text>
          )}
          {render({ field, fieldState, formState })}
          {description && <Text style={[styles.description, descriptionStyle]}>{description}</Text>}
          {!hideErrorMessage && fieldState.error?.message && (
            <Text style={[styles.error, errorStyle]}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
};

export { FormField };
