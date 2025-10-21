import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const SwitchExample = () => {
  const styles = useStyles(exampleStyles);
  const [checked, setChecked] = useState(true);

  return (
    <View style={styles.content}>
      <Text weight="medium">Switch</Text>

      <Switch checked={checked} onCheckedChange={setChecked} />
    </View>
  );
};
export default SwitchExample;
