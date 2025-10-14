import { RadioGroup } from '@/components/ui-presets/radio-group';
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

const RadioGroupExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Radio Group</Text>
      <RadioGroup options={options} />
    </View>
  );
};
export default RadioGroupExample;
