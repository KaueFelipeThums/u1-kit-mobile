import React, { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type TimelineVariant = 'aligned' | 'alternate';
type TimeLineOrientation = 'horizontal' | 'vertical';

const TimelineContext = createContext<{ variant: TimelineVariant; orientation: TimeLineOrientation }>({
  variant: 'aligned',
  orientation: 'vertical',
});

function useTimeline() {
  const context = useContext(TimelineContext);
  if (!context) throw new Error('useTimeline must be used within a TimelineProvider.');
  return context;
}

type TimelineProps = React.ComponentPropsWithRef<typeof View> & {
  variant?: TimelineVariant;
  orientation?: TimeLineOrientation;
};

const timelineStyles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
});

const Timeline = ({ variant = 'aligned', orientation = 'vertical', style, ...props }: TimelineProps) => {
  return (
    <TimelineContext.Provider value={{ variant: orientation === 'horizontal' ? 'aligned' : variant, orientation }}>
      <View style={[timelineStyles[orientation], style]} {...props} />
    </TimelineContext.Provider>
  );
};

const timelineItemStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    flexView: {
      flex: 1,
    },
    horizontal: {
      flexDirection: 'column',
    },
    item: {
      flex: 1,
      gap: sizes.gap.xl,
    },
    vertical: {
      flexDirection: 'row',
    },
  });

type TimelineItemContextType = {
  side: 'start' | 'end';
};

const TimelineItemContext = createContext<TimelineItemContextType>({ side: 'start' });

function useTimelineItem() {
  const context = useContext(TimelineItemContext);
  if (!context) throw new Error('useTimeline must be used within a TimelineProvider.');
  return context;
}

type TimelineItemProps = React.ComponentPropsWithRef<typeof View> & {
  side?: 'start' | 'end';
};

const TimelineItem = ({ side = 'start', style, children, ...props }: TimelineItemProps) => {
  const { variant, orientation } = useTimeline();
  const styles = useStyles(timelineItemStyles);

  return (
    <TimelineItemContext.Provider value={{ side: orientation === 'horizontal' ? 'start' : side }}>
      <View style={[styles.item, styles[orientation], style]} {...props}>
        {variant === 'alternate' && side === 'start' && <View style={styles.flexView} />}
        {children}
        {variant === 'alternate' && side === 'end' && <View style={styles.flexView} />}
      </View>
    </TimelineItemContext.Provider>
  );
};

const timelineItemSeparatorStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    horizontal: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: sizes.gap.md,
      marginLeft: sizes.margin.md,
    },
    vertical: {
      alignItems: 'center',
      flexDirection: 'column',
      gap: sizes.gap.md,
      marginTop: sizes.margin.md,
    },
  });

const TimelineSeparator = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(timelineItemSeparatorStyles);
  const { orientation } = useTimeline();

  return <View style={[styles[orientation], style]} {...props} />;
};

type TimelineDotProps = React.ComponentPropsWithRef<typeof View> & {
  variant?: 'default' | 'outline';
};

const timelineItemDotStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    default: {
      backgroundColor: colors.foreground,
    },
    dot: {
      alignItems: 'center',
      borderRadius: sizes.radius.full,
      height: sizes.dimension.xs / 1.5,
      justifyContent: 'center',
      width: sizes.dimension.xs / 1.5,
    },
    outline: {
      backgroundColor: colors.transparent,
      borderColor: colors.foreground,
      borderWidth: sizes.border.md,
    },
  });

const TimelineDot = ({ variant = 'default', style, children, ...props }: TimelineDotProps) => {
  const styles = useStyles(timelineItemDotStyles);

  if (children) {
    return (
      <View style={[styles.dot, style]} {...props}>
        {children}
      </View>
    );
  }

  return <View style={[styles.dot, styles[variant], style]} {...props} />;
};

const timelineItemConnectorStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    connector: {
      backgroundColor: colors.border,
      flex: 1,
    },
    horizontal: {
      height: sizes.border.sm,
      marginHorizontal: sizes.margin.sm,
    },
    vertical: {
      marginVertical: sizes.margin.sm,
      width: sizes.border.sm,
    },
  });

const TimelineConnector = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(timelineItemConnectorStyles);
  const { orientation } = useTimeline();

  return <View style={[styles.connector, styles[orientation], style]} {...props} />;
};

const timelineContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      flex: 1,
      paddingBottom: sizes.padding['2xl'],
    },
    end: {
      alignItems: 'flex-end',
    },
    horizontal: {
      marginLeft: sizes.margin.md,
    },
    start: {
      alignItems: 'flex-start',
    },
  });

const TimelineContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { side } = useTimelineItem();
  const { orientation } = useTimeline();
  const styles = useStyles(timelineContentStyles);
  return (
    <View style={[styles.content, orientation === 'horizontal' && styles.horizontal, styles[side], style]} {...props} />
  );
};

const timelineItemTitleStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    end: {
      textAlign: 'right',
    },
    start: {
      textAlign: 'left',
    },
    title: {
      color: colors.foreground,
      fontSize: sizes.fontSize.md,
    },
  });

const TimelineTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const { side } = useTimelineItem();
  const styles = useStyles(timelineItemTitleStyles);

  return <Text style={[styles.title, styles[side], style]} {...props} />;
};

const descriptionStyles = ({ colors, sizes }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.sm,
    },
    end: {
      textAlign: 'right',
    },
    start: {
      textAlign: 'left',
    },
  });

const TimelineDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const { side } = useTimelineItem();
  const styles = useStyles(descriptionStyles);
  return <Text style={[styles.description, styles[side], style]} {...props} />;
};

export {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
};
