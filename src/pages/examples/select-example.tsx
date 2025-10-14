import { Select } from '@/components/ui-presets/select';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const SelectExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Select</Text>
      <Select options={options} placeholder="Selecione um valor..." />
    </View>
  );
};
export default SelectExample;
