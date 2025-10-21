import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
    flexContent: {
      gap: sizes.gap.sm,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    descriptionContent: {
      gap: sizes.gap.md,
      flex: 1,
    },
    skeletonAvatar: {
      width: 40,
      height: 40,
      borderRadius: sizes.radius.full,
    },
    skeletonTtitle: {
      height: 14,
      borderRadius: sizes.radius.md,
    },
    skeletonText: {
      width: '60%',
      height: 14,
      borderRadius: sizes.radius.md,
    },
  });

const SkeletonExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Skeleton</Text>

      <View style={styles.flexContent}>
        <Skeleton style={styles.skeletonAvatar} />
        <View style={styles.descriptionContent}>
          <Skeleton style={styles.skeletonTtitle} />
          <Skeleton style={styles.skeletonText} />
        </View>
      </View>
    </View>
  );
};
export default SkeletonExample;
