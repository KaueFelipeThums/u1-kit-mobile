import { InputDate } from '@/components/ui-presets/input-date';
import { InputPassword } from '@/components/ui-presets/input-password';
import { InputText } from '@/components/ui-presets/input-text';
import { InputTime } from '@/components/ui-presets/input-time';
import { TextArea } from '@/components/ui-presets/text-area';
import { Icon } from '@/components/ui/icon';
import { InputBaseAdornment } from '@/components/ui/input';
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

const InputExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Input</Text>
      <InputText
        placeholder="0000 0000 0000 0000"
        leftAdornment={
          <InputBaseAdornment>
            <Icon name="CreditCard" />
          </InputBaseAdornment>
        }
      />
      <InputPassword placeholder="Input Password Example..." />
      <TextArea placeholder="Text Area Example..." />

      <InputDate />

      <InputTime />
    </View>
  );
};
export default InputExample;
