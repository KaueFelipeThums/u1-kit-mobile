import { Segment, SegmentList, SegmentTrigger } from '@/components/ui/segment';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const SegmentExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Segment</Text>

      <Segment defaultValue="apple">
        <SegmentList>
          <SegmentTrigger value="apple">Apple</SegmentTrigger>
          <SegmentTrigger value="banana">Banana</SegmentTrigger>
          <SegmentTrigger value="cherry">Cherry</SegmentTrigger>
          <SegmentTrigger value="date">Date</SegmentTrigger>
        </SegmentList>
      </Segment>
    </View>
  );
};
export default SegmentExample;
