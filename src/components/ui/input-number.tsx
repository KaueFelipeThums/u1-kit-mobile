import React from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import * as InputNumberPrimitive from '@/components/primitves/input-number';
import composeRefs from '@/functions/compose-refs';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type InputNumberContextProps = {
  controlRef: React.RefObject<TextInput | null>;
  onFocusedChange: (focused: boolean) => void;
};

const InputNumberContext = React.createContext<InputNumberContextProps>({
  controlRef: { current: null },
  onFocusedChange: () => {},
});

const useInputNumberContext = () => {
  const context = React.useContext(InputNumberContext);
  if (!context) {
    throw new Error('Input compound components cannot be rendered outside the Input component');
  }
  return context;
};

type InputNumberContentProps = React.ComponentPropsWithRef<typeof Pressable>;

const inputNumberContentStyles = ({ colors, sizes }: ThemeValue) =>
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
    focused: {
      borderColor: colors.primary,
      boxShadow: `0px 0px 0px 4px ${colors.primary}50`,
    },
  });

const InputNumberContent = ({ style, disabled, ...props }: InputNumberContentProps) => {
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef<TextInput | null>(null);
  const styles = useStyles(inputNumberContentStyles);
  const { disabled: rootDisabled } = InputNumberPrimitive.useRootContext();
  const isDisabled = disabled || rootDisabled;

  return (
    <InputNumberContext.Provider
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
          isDisabled && styles.disabled,
          typeof style === 'function' ? style(pressableState) : style,
        ]}
        {...props}
      />
    </InputNumberContext.Provider>
  );
};

const inputNumberInputStyles = ({ colors, sizes }: ThemeValue) =>
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

const InputNumberInput = ({ style, ref, onFocus, onBlur, ...props }: React.ComponentPropsWithRef<typeof TextInput>) => {
  const { colors } = useTheme();
  const styles = useStyles(inputNumberInputStyles);
  const { controlRef, onFocusedChange } = useInputNumberContext();

  return (
    <InputNumberPrimitive.Input
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

type InputNumberProps = Omit<React.ComponentPropsWithRef<typeof InputNumberPrimitive.Root>, 'children'> &
  InputNumberContentProps;

const InputNumber = ({ value, decimals, separator, disabled, onChangeText, ...props }: InputNumberProps) => {
  return (
    <InputNumberPrimitive.Root
      value={value}
      decimals={decimals}
      separator={separator}
      disabled={disabled}
      onChangeText={onChangeText}
    >
      <InputNumberContent {...props} />
    </InputNumberPrimitive.Root>
  );
};

export { InputNumber, InputNumberInput };
