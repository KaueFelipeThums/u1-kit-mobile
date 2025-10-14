import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Button, ButtonIcon } from './button';
import composeRefs from '@/functions/compose-refs';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type InputBaseContextProps = Pick<InputBaseProps, 'autoFocus' | 'disabled'> & {
  controlRef: React.RefObject<TextInput | null>;
  onFocusedChange: (focused: boolean) => void;
};

const InputBaseContext = React.createContext<InputBaseContextProps>({
  autoFocus: false,
  controlRef: { current: null },
  disabled: false,
  onFocusedChange: () => {},
});

const useInputBaseContext = () => {
  const context = React.useContext(InputBaseContext);
  if (!context) {
    throw new Error('Input compound components cannot be rendered outside the Input component');
  }
  return context;
};

type InputBaseProps = React.ComponentPropsWithRef<typeof Pressable> & {
  autoFocus?: boolean;
  disabled?: boolean;
};

const inputBaseStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
      pointerEvents: 'none',
    },
    focused: {
      borderColor: colors.primary,
      boxShadow: `0px 0px 0px 4px ${colors.primary}50`,
    },
    inputBase: {
      backgroundColor: colors.background,
      borderColor: colors.input,
      borderRadius: sizes.radius.default,
      borderWidth: sizes.border.sm,
      boxShadow: sizes.shadow.sm,
      flexDirection: 'row',
      gap: sizes.gap.md,
      height: sizes.dimension.xl,
      minWidth: 0,
      paddingHorizontal: sizes.padding.lg,
      width: '100%',
    },
  });

const InputBase = ({ autoFocus, disabled, style, ...props }: InputBaseProps) => {
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef<TextInput | null>(null);
  const styles = useStyles(inputBaseStyles);

  return (
    <InputBaseContext.Provider
      value={{
        autoFocus,
        controlRef,
        disabled,
        onFocusedChange: setFocused,
      }}
    >
      <Pressable
        onPress={(event) => {
          if (controlRef.current && event.currentTarget === event.target) {
            controlRef.current.focus();
          }
        }}
        disabled={disabled}
        style={(pressableState) => [
          styles.inputBase,
          focused && styles.focused,
          disabled && styles.disabled,
          typeof style === 'function' ? style(pressableState) : style,
        ]}
        {...props}
      />
    </InputBaseContext.Provider>
  );
};

const inputBaseInputStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.transparent,
      color: colors.foreground,
      flexGrow: 1,
      flexShrink: 1,
      fontSize: sizes.fontSize.md,
      height: '100%',
      padding: 0,
      width: '100%',
    },
  });

const InputBaseInput = ({
  style,
  ref,
  editable,
  onFocus,
  onBlur,
  ...props
}: React.ComponentPropsWithRef<typeof TextInput>) => {
  const { colors } = useTheme();
  const styles = useStyles(inputBaseInputStyles);
  const { controlRef, onFocusedChange, autoFocus, disabled } = useInputBaseContext();

  return (
    <TextInput
      ref={composeRefs(ref, controlRef)}
      placeholderTextColor={colors.mutedForeground}
      autoFocus={autoFocus}
      editable={!disabled || editable}
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

const inputBaseAdornmentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    adornment: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.sm,
      justifyContent: 'center',
    },
  });

const InputBaseAdornment = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(inputBaseAdornmentStyles);
  return <View style={[styles.adornment, style]} {...props} />;
};

const inputBaseAdornmentButtonStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    adornmentButton: {
      height: sizes.dimension.md,
      width: sizes.dimension.md,
    },
  });

const InputBaseAdornmentButton = ({
  style,
  variant = 'ghost',
  size = 'icon',
  ...props
}: React.ComponentPropsWithRef<typeof Button>) => {
  const styles = useStyles(inputBaseAdornmentButtonStyles);

  return (
    <Button
      variant={variant}
      size={size}
      style={(pressableState) => [styles.adornmentButton, typeof style === 'function' ? style(pressableState) : style]}
      {...props}
    />
  );
};

const InputBaseAdornmentButtonIcon = ({ size, ...props }: React.ComponentPropsWithRef<typeof ButtonIcon>) => {
  const { sizes } = useTheme();
  return <ButtonIcon size={size ?? sizes.fontSize.md} {...props} />;
};

export { InputBase, InputBaseInput, InputBaseAdornment, InputBaseAdornmentButton, InputBaseAdornmentButtonIcon };
