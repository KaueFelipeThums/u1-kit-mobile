import { ChevronDownIcon } from 'lucide-react-native';
import * as React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Icon } from './icon';
import * as AccordionPrimitive from '@/components/primitves/accordion';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const Accordion = ({ ...props }: React.ComponentPropsWithRef<typeof AccordionPrimitive.Root>) => {
  return <AccordionPrimitive.Root {...props} />;
};

type AccordionItemProps = React.ComponentPropsWithRef<typeof AccordionPrimitive.Item>;

const accordionItemStyle = (theme: ThemeValue) =>
  StyleSheet.create({
    item: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: theme.sizes.border.sm,
    },
  });

const AccordionItem = ({ style, ...props }: AccordionItemProps) => {
  const styles = useStyles(accordionItemStyle);

  return <AccordionPrimitive.Item style={[styles.item, style]} {...props} />;
};

type AccordionTriggerProps = Omit<React.ComponentPropsWithRef<typeof AccordionPrimitive.Trigger>, 'children'> & {
  children: React.ReactNode;
};

const accordionTriggerStyle = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.8,
    },
    header: {
      flexDirection: 'row',
    },
    trigger: {
      alignItems: 'flex-start',
      borderRadius: sizes.radius.default,
      flexDirection: 'row',
      flex: 1,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.light,
      gap: sizes.gap.xl,
      justifyContent: 'space-between',
      paddingVertical: sizes.padding.xl,
      textAlign: 'left',
    },
    triggerPressed: {
      opacity: 0.8,
    },
  });

const AccordionTrigger = ({ style, children, disabled, ...props }: AccordionTriggerProps) => {
  const styles = useStyles(accordionTriggerStyle);

  return (
    <AccordionPrimitive.Header style={styles.header}>
      <AccordionPrimitive.Trigger
        disabled={disabled}
        style={(styleState) => [
          styles.trigger,
          disabled && styles.disabled,
          styleState.pressed && styles.triggerPressed,
          typeof style === 'function' ? style(styleState) : style,
        ]}
        {...props}
      >
        {children}
        <AccordionTriggerIcon />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

type AccordionTriggerIconProps = React.ComponentPropsWithRef<typeof ChevronDownIcon>;

const accordionTriggerIconStyle = () =>
  StyleSheet.create({
    triggerIconContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const AccordionTriggerIcon = ({ ...props }: AccordionTriggerIconProps) => {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  const { colors, sizes } = useTheme();
  const styles = useStyles(accordionTriggerIconStyle);

  const rotateAnim = React.useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View
      style={[
        styles.triggerIconContent,
        {
          transform: [{ rotate }],
        },
      ]}
    >
      <Icon name="ChevronDown" color={colors.mutedForeground} size={sizes.dimension.xs} {...props} />
    </Animated.View>
  );
};

type AccordionContentProps = React.ComponentPropsWithRef<typeof AccordionPrimitive.Content>;

const accordionContentStyle = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      fontSize: sizes.fontSize.sm,
      overflow: 'hidden',
      padding: sizes.padding.none,
      paddingBottom: sizes.padding.lg,
    },
  });

const AccordionContent = ({ style, ...props }: AccordionContentProps) => {
  const styles = useStyles(accordionContentStyle);
  return <AccordionPrimitive.Content style={[styles.content, style]} {...props} />;
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
