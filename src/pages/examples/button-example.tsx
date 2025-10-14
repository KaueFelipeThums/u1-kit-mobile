import { Button } from '@/components/ui-presets/button';
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

const ButtonExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Button</Text>
      <Button variant="default">Button</Button>
      <Button variant="destructive">Button Destructive</Button>
      <Button variant="outline" icon="Sun">
        Button Outline
      </Button>
      <Button variant="outline" size="icon" icon="Sun" />
    </View>
  );
};
export default ButtonExample;
