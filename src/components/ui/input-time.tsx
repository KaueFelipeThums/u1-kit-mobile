import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from './icon';
import * as InputTimePrimitive from '@/components/primitves/input-time';
import composeRefs from '@/functions/compose-refs';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type InputTimeContextProps = {
  controlRef: React.RefObject<TextInput | null>;
  onFocusedChange: (focused: boolean) => void;
};

const InputTimeContext = React.createContext<InputTimeContextProps>({
  controlRef: { current: null },
  onFocusedChange: () => {},
});

const useInputTimeContext = () => {
  const context = React.useContext(InputTimeContext);
  if (!context) {
    throw new Error('Input compound components cannot be rendered outside the Input component');
  }
  return context;
};

type InputTimeContentProps = React.ComponentPropsWithRef<typeof Pressable>;

const inputTimeContentStyles = ({ colors, sizes }: ThemeValue) =>
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

const InputTimeContent = ({ style, disabled, ...props }: InputTimeContentProps) => {
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef<TextInput | null>(null);
  const styles = useStyles(inputTimeContentStyles);
  const { isValid, disabled: rootDisabled } = InputTimePrimitive.useRootContext();
  const isDisabled = disabled || rootDisabled;

  return (
    <InputTimeContext.Provider
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
    </InputTimeContext.Provider>
  );
};

const inputTimeInputStyles = ({ colors, sizes }: ThemeValue) =>
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

const InputTimeInput = ({ style, ref, onFocus, onBlur, ...props }: React.ComponentPropsWithRef<typeof TextInput>) => {
  const { colors } = useTheme();
  const styles = useStyles(inputTimeInputStyles);
  const { controlRef, onFocusedChange } = useInputTimeContext();

  return (
    <InputTimePrimitive.Input
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

const inputTimeIndicatorStyles = ({ sizes }: ThemeValue) =>
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

const InputTimeIndicator = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(inputTimeIndicatorStyles);
  const { isValid } = InputTimePrimitive.useRootContext();
  const { colors, sizes } = useTheme();

  return (
    <View style={[styles.indicator, style]} {...props}>
      <Icon
        name={isValid ? 'Clock' : 'CircleX'}
        size={sizes.fontSize.md}
        color={isValid ? colors.mutedForeground : colors.destructive}
      />
    </View>
  );
};

type InputTimeProps = Omit<React.ComponentProps<typeof InputTimePrimitive.Root>, 'children'> & InputTimeContentProps;

const InputTime = ({ value, minTime, maxTime, disabled, onValueChange, ...props }: InputTimeProps) => {
  return (
    <InputTimePrimitive.Root
      value={value}
      minTime={minTime}
      maxTime={maxTime}
      disabled={disabled}
      onValueChange={onValueChange}
    >
      <InputTimeContent {...props} />
    </InputTimePrimitive.Root>
  );
};

export { InputTime, InputTimeInput, InputTimeIndicator };
