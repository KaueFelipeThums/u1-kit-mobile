import React from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import composeRefs from '@/functions/compose-refs';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type TextAreaBaseContextProps = Pick<TextAreaBaseProps, 'autoFocus' | 'disabled'> & {
  controlRef: React.RefObject<TextInput | null>;
  onFocusedChange: (focused: boolean) => void;
};

const TextAreaBaseContext = React.createContext<TextAreaBaseContextProps>({
  autoFocus: false,
  controlRef: { current: null },
  disabled: false,
  onFocusedChange: () => {},
});

const useTextAreaBaseContext = () => {
  const context = React.useContext(TextAreaBaseContext);
  if (!context) {
    throw new Error('Input compound components cannot be rendered outside the Input component');
  }
  return context;
};

type TextAreaBaseProps = React.ComponentPropsWithRef<typeof Pressable> & {
  autoFocus?: boolean;
  disabled?: boolean;
};

const textAreaBaseStyles = ({ colors, sizes }: ThemeValue) =>
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
      gap: sizes.gap.sm,
      minHeight: sizes.dimension['3xl'],
      minWidth: 0,
      paddingHorizontal: sizes.padding.lg,
      paddingVertical: sizes.padding.xs,
      width: '100%',
    },
  });

const TextAreaBase = ({ autoFocus, disabled, style, ...props }: TextAreaBaseProps) => {
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef<TextInput | null>(null);
  const styles = useStyles(textAreaBaseStyles);

  return (
    <TextAreaBaseContext.Provider
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
    </TextAreaBaseContext.Provider>
  );
};

const textAreaBaseInputStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.transparent,
      color: colors.foreground,
      flexGrow: 1,
      flexShrink: 1,
      fontSize: sizes.fontSize.md,
      width: '100%',
    },
  });

const TextAreaBaseInput = ({
  style,
  ref,
  editable,
  onFocus,
  onBlur,
  ...props
}: React.ComponentPropsWithRef<typeof TextInput>) => {
  const { colors } = useTheme();
  const styles = useStyles(textAreaBaseInputStyles);
  const { controlRef, onFocusedChange, autoFocus, disabled } = useTextAreaBaseContext();

  return (
    <TextInput
      ref={composeRefs(ref, controlRef)}
      placeholderTextColor={colors.mutedForeground}
      selectionColor={colors.primary}
      autoFocus={autoFocus}
      editable={!disabled || editable}
      onFocus={(event) => {
        onFocusedChange(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        onFocusedChange(false);
        onBlur?.(event);
      }}
      style={[styles.input, style]}
      numberOfLines={3}
      multiline={true}
      {...props}
    />
  );
};

export { TextAreaBase, TextAreaBaseInput };
