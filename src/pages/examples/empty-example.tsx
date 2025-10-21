import { Empty, EmptyIcon, EmptyTitle } from '@/components/ui/empty';
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

const EmptyExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Empty</Text>

      <Empty>
        <EmptyIcon />
        <EmptyTitle>No registers found</EmptyTitle>
      </Empty>
    </View>
  );
};
export default EmptyExample;
