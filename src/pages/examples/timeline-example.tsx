import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const TimelineExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Timeline</Text>

      <Timeline orientation="vertical" variant="alternate">
        <TimelineItem side="start">
          <TimelineSeparator>
            <TimelineDot variant="outline" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Eat</TimelineTitle>
            <TimelineDescription>Because you need strength</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem side="end">
          <TimelineContent>
            <TimelineTitle>Code</TimelineTitle>
            <TimelineDescription>Because it's awesome!</TimelineDescription>
          </TimelineContent>
          <TimelineSeparator>
            <TimelineDot variant="outline" />
            <TimelineConnector />
          </TimelineSeparator>
        </TimelineItem>
        <TimelineItem side="start">
          <TimelineSeparator>
            <TimelineDot variant="outline" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Sleep</TimelineTitle>
            <TimelineDescription>Because you need rest</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem side="end">
          <TimelineContent>
            <TimelineTitle>Repeat</TimelineTitle>
            <TimelineDescription>Because this is the life you love!</TimelineDescription>
          </TimelineContent>
          <TimelineSeparator>
            <TimelineDot variant="outline" />
          </TimelineSeparator>
        </TimelineItem>
      </Timeline>
    </View>
  );
};
export default TimelineExample;
