import React from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import * as InputMaskPrimitive from '@/components/primitves/input-mask';
import composeRefs from '@/functions/compose-refs';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type InputMaskContextProps = {
  controlRef: React.RefObject<TextInput | null>;
  onFocusedChange: (focused: boolean) => void;
};

const InputMaskContext = React.createContext<InputMaskContextProps>({
  controlRef: { current: null },
  onFocusedChange: () => {},
});

const useInputMaskContext = () => {
  const context = React.useContext(InputMaskContext);
  if (!context) {
    throw new Error('Input compound components cannot be rendered outside the Input component');
  }
  return context;
};

type InputMaskContentProps = React.ComponentPropsWithRef<typeof Pressable>;

const inputMaskContentStyles = ({ colors, sizes }: ThemeValue) =>
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

const InputMaskContent = ({ style, disabled, ...props }: InputMaskContentProps) => {
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef<TextInput | null>(null);
  const styles = useStyles(inputMaskContentStyles);
  const { disabled: rootDisabled } = InputMaskPrimitive.useRootContext();
  const isDisabled = disabled || rootDisabled;

  return (
    <InputMaskContext.Provider
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
    </InputMaskContext.Provider>
  );
};

const inputMaskInputStyles = ({ colors, sizes }: ThemeValue) =>
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

const InputMaskInput = ({ style, ref, onFocus, onBlur, ...props }: React.ComponentPropsWithRef<typeof TextInput>) => {
  const { colors } = useTheme();
  const styles = useStyles(inputMaskInputStyles);
  const { controlRef, onFocusedChange } = useInputMaskContext();

  return (
    <InputMaskPrimitive.Input
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

type InputMaskProps = Omit<React.ComponentPropsWithRef<typeof InputMaskPrimitive.Root>, 'children'> &
  InputMaskContentProps;

const InputMask = ({ value, mask, disabled, onChangeText, ...props }: InputMaskProps) => {
  return (
    <InputMaskPrimitive.Root value={value} mask={mask} disabled={disabled} onChangeText={onChangeText}>
      <InputMaskContent {...props} />
    </InputMaskPrimitive.Root>
  );
};

export { InputMask, InputMaskInput };
