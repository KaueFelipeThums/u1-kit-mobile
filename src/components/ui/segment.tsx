import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TextProps } from 'react-native-svg';
import { Text } from './text';
import * as SegmentPrimitive from '@/components/primitves/segment';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const segmentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    segment: {
      borderRadius: sizes.radius.lg,
      flexDirection: 'column',
      gap: sizes.gap.md,
    },
  });

const Segment = ({ style, ...props }: React.ComponentPropsWithRef<typeof SegmentPrimitive.Root>) => {
  const styles = useStyles(segmentStyles);
  return <SegmentPrimitive.Root style={[styles.segment, style]} {...props} />;
};

const segmentListStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    content: {
      borderRadius: sizes.radius.lg,
    },
    list: {
      backgroundColor: colors.muted,
      borderRadius: sizes.radius.lg,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: sizes.padding.sm,
    },
  });

const SegmentList = ({ style, ...props }: React.ComponentPropsWithRef<typeof SegmentPrimitive.List>) => {
  const styles = useStyles(segmentListStyles);
  const scrollRef = useRef<ScrollView>(null);
  const { selectedItemPosition } = SegmentPrimitive.useRootContext();

  const scrollToIndex = React.useCallback(() => {
    if (!selectedItemPosition) return;
    scrollRef.current?.scrollTo({ x: selectedItemPosition - 10, animated: true });
  }, [selectedItemPosition]);

  useEffect(() => {
    scrollToIndex();
  }, [scrollToIndex]);

  return (
    <ScrollView
      ref={scrollRef}
      onLayout={() => scrollToIndex()}
      showsHorizontalScrollIndicator={false}
      style={styles.content}
      horizontal
    >
      <SegmentPrimitive.List {...props} style={[styles.list, style]} />
    </ScrollView>
  );
};

const segmentTriggerStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    active: {
      backgroundColor: colors.background,
      boxShadow: sizes.shadow.md,
    },
    disabled: {
      opacity: 0.8,
    },
    pressed: {
      opacity: 0.8,
    },
    text: {
      color: colors.foreground,
      fontSize: sizes.fontSize.sm,
      fontWeight: sizes.fontWeight.medium,
    },
    trigger: {
      alignItems: 'center',
      borderRadius: sizes.radius.lg,
      flex: 1,
      gap: sizes.gap.xs,
      justifyContent: 'center',
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.md,
    },
  });

type SegmentTriggerProps = Omit<React.ComponentPropsWithRef<typeof SegmentPrimitive.Trigger>, 'children'> &
  Pick<TextProps, 'children'>;

const SegmentTrigger = ({ style, children, value, disabled, ...props }: SegmentTriggerProps) => {
  const styles = useStyles(segmentTriggerStyles);
  const { colors } = useTheme();
  const { value: rootValue, disabled: rootDisabled } = SegmentPrimitive.useRootContext();
  const isDisabled = rootDisabled || disabled;

  return (
    <SegmentPrimitive.Trigger
      value={value}
      disabled={isDisabled}
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      style={(triggerState) => [
        styles.trigger,
        rootValue === value && styles.active,
        triggerState.pressed && styles.pressed,
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(triggerState) : style,
      ]}
      {...props}
    >
      <Text style={styles.text}>{children}</Text>
    </SegmentPrimitive.Trigger>
  );
};

export { Segment, SegmentList, SegmentTrigger };
