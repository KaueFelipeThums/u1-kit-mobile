import { Badge, BadgeTitle } from '@/components/ui/badge';
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
  });

const BadgeExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Badge</Text>

      <View style={styles.flexContent}>
        <Badge>
          <BadgeTitle>Default Badge</BadgeTitle>
        </Badge>
        <Badge variant="destructive">
          <BadgeTitle>Destructive Badge</BadgeTitle>
        </Badge>
        <Badge variant="outline">
          <BadgeTitle>Outline Badge</BadgeTitle>
        </Badge>
        <Badge variant="secondary">
          <BadgeTitle>Secondary Badge</BadgeTitle>
        </Badge>
      </View>
    </View>
  );
};
export default BadgeExample;
