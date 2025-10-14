import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from './text';
import * as TabsPrimitive from '@/components/primitves/tabs';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const tabsStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    tabs: {
      flexDirection: 'column',
      flex: 1,
      gap: sizes.gap.md,
    },
  });

const Tabs = ({ style, ...props }: React.ComponentPropsWithRef<typeof TabsPrimitive.Root>) => {
  const styles = useStyles(tabsStyles);
  return <TabsPrimitive.Root style={[styles.tabs, style]} {...props} />;
};

const tabsListStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    list: {
      borderBottomColor: colors.border,
      borderBottomWidth: sizes.border.sm,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      // paddingHorizontal: sizes.padding.xl,
    },
  });

const TabsList = ({ style, ...props }: React.ComponentPropsWithRef<typeof TabsPrimitive.List>) => {
  const styles = useStyles(tabsListStyles);
  return <TabsPrimitive.List style={[styles.list, style]} {...props} />;
};

const TabsListScroll = ({ style, ...props }: React.ComponentPropsWithRef<typeof TabsPrimitive.List>) => {
  const styles = useStyles(tabsListStyles);
  const scrollRef = useRef<ScrollView>(null);
  const { selectedItemPosition } = TabsPrimitive.useRootContext();

  const scrollToIndex = React.useCallback(() => {
    if (!selectedItemPosition) return;
    scrollRef.current?.scrollTo({ x: selectedItemPosition - 10, animated: true });
  }, [selectedItemPosition]);

  useEffect(() => {
    scrollToIndex();
  }, [scrollToIndex]);

  return (
    <ScrollView ref={scrollRef} onLayout={() => scrollToIndex()} showsHorizontalScrollIndicator={false} horizontal>
      <TabsPrimitive.List style={[styles.list, style]} {...props} />
    </ScrollView>
  );
};

const tabsTriggerStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    active: {
      borderBottomColor: colors.primary,
      borderBottomWidth: sizes.border.sm,
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
    textActive: {
      color: colors.primary,
    },
    trigger: {
      alignItems: 'center',
      borderBottomColor: colors.transparent,
      borderBottomWidth: sizes.border.sm,
      flexGrow: 1,
      flexShrink: 1,
      gap: sizes.gap.xs,
      justifyContent: 'center',
      marginBottom: -sizes.border.sm,
      overflow: 'hidden',
      paddingHorizontal: sizes.padding.xl,
      paddingVertical: sizes.padding.lg,
    },
  });

type TabsTriggerProps = Omit<React.ComponentPropsWithRef<typeof TabsPrimitive.Trigger>, 'children'> &
  Pick<React.ComponentPropsWithRef<typeof Text>, 'children' | 'numberOfLines'>;

const TabsTrigger = ({ style, children, value, numberOfLines, ...props }: TabsTriggerProps) => {
  const styles = useStyles(tabsTriggerStyles);
  const { colors } = useTheme();
  const { value: rootValue } = TabsPrimitive.useRootContext();
  return (
    <TabsPrimitive.Trigger
      value={value}
      android_ripple={{
        color: `${colors.foreground}20`,
        foreground: true,
      }}
      style={(triggerState) => [
        styles.trigger,
        rootValue === value && styles.active,
        triggerState.pressed && styles.pressed,
        typeof style === 'function' ? style(triggerState) : style,
      ]}
      {...props}
    >
      <Text numberOfLines={numberOfLines} style={[styles.text, rootValue === value && styles.textActive]}>
        {children}
      </Text>
    </TabsPrimitive.Trigger>
  );
};

const tabsContentStyles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

const TabsContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof TabsPrimitive.Content>) => {
  return <TabsPrimitive.Content style={[tabsContentStyles.content, style]} {...props} />;
};

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsListScroll };
