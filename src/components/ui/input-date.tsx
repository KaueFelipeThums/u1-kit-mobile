import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from './icon';
import * as InputDatePrimitive from '@/components/primitves/input-date';
import composeRefs from '@/functions/compose-refs';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type InputDateContextProps = {
  controlRef: React.RefObject<TextInput | null>;
  onFocusedChange: (focused: boolean) => void;
};

const InputDateContext = React.createContext<InputDateContextProps>({
  controlRef: { current: null },
  onFocusedChange: () => {},
});

const useInputDateContext = () => {
  const context = React.useContext(InputDateContext);
  if (!context) {
    throw new Error('Input compound components cannot be rendered outside the Input component');
  }
  return context;
};

type InputDateContentProps = React.ComponentPropsWithRef<typeof Pressable>;

const inputDateContentStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.background,
      borderColor: colors.input,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.sm,
      flexDirection: 'row',
      gap: sizes.gap.sm,
      height: sizes.dimension.xl,
      minWidth: 0,
      paddingHorizontal: sizes.padding.lg,
      width: '100%',
    },
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    error: {
      borderColor: colors.destructive,
      boxShadow: `0px 0px 0px 4px ${colors.destructive}50`,
    },
    focused: {
      borderColor: colors.primary,
      boxShadow: `0px 0px 0px 4px ${colors.primary}50`,
    },
  });

const InputDateContent = ({ style, disabled, ...props }: InputDateContentProps) => {
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef<TextInput | null>(null);
  const styles = useStyles(inputDateContentStyles);
  const { isValid, disabled: rootDisabled } = InputDatePrimitive.useRootContext();
  const isDisabled = disabled || rootDisabled;

  return (
    <InputDateContext.Provider
      value={{
        controlRef,
        onFocusedChange: setFocused,
      }}
    >
      <Pressable
        onPress={(event) => {
          if (controlRef.current && event.currentTarget === event.target) {
            controlRef.current.focus();
          }
        }}
        disabled={isDisabled}
        style={(pressableState) => [
          styles.content,
          focused && styles.focused,
          !isValid && styles.error,
          isDisabled && styles.disabled,
          typeof style === 'function' ? style(pressableState) : style,
        ]}
        {...props}
      />
    </InputDateContext.Provider>
  );
};

const inputDateInputStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    input: {
      alignSelf: 'center',
      backgroundColor: colors.transparent,
      color: colors.foreground,
      flexGrow: 1,
      flexShrink: 1,
      fontSize: sizes.fontSize.md,
      height: '100%',
      width: '100%',
    },
  });

const InputDateInput = ({ style, ref, onFocus, onBlur, ...props }: React.ComponentPropsWithRef<typeof TextInput>) => {
  const { colors } = useTheme();
  const styles = useStyles(inputDateInputStyles);
  const { controlRef, onFocusedChange } = useInputDateContext();

  return (
    <InputDatePrimitive.Input
      ref={composeRefs(ref, controlRef)}
      placeholderTextColor={colors.mutedForeground}
      selectionColor={colors.primary}
      onFocus={(event) => {
        onFocusedChange(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        onFocusedChange(false);
        onBlur?.(event);
      }}
      style={[styles.input, style]}
      {...props}
    />
  );
};

const inputDateIndicatorStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    indicator: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.sm,
      height: '100%',
      justifyContent: 'center',
      width: sizes.dimension.md,
    },
  });

const InputDateIndicator = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(inputDateIndicatorStyles);
  const { isValid } = InputDatePrimitive.useRootContext();
  const { colors, sizes } = useTheme();

  return (
    <View style={[styles.indicator, style]} {...props}>
      <Icon
        name={isValid ? 'Calendar' : 'CircleX'}
        size={sizes.fontSize.md}
        color={isValid ? colors.mutedForeground : colors.destructive}
      />
    </View>
  );
};

type InputDateProps = Omit<React.ComponentProps<typeof InputDatePrimitive.Root>, 'children'> & InputDateContentProps;

const InputDate = ({ value, minDate, maxDate, disabled, dateFormat, onValueChange, ...props }: InputDateProps) => {
  return (
    <InputDatePrimitive.Root
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      dateFormat={dateFormat}
      onValueChange={onValueChange}
    >
      <InputDateContent {...props} />
    </InputDatePrimitive.Root>
  );
};

export { InputDate, InputDateInput, InputDateIndicator };
