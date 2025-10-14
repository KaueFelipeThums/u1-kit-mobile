import { Button } from '@/components/ui-presets/button';
import { RadioGroup } from '@/components/ui-presets/radio-group';
import { Sheet } from '@/components/ui-presets/sheet';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const options = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const SheetExample = () => {
  const styles = useStyles(exampleStyles);
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('bottom');

  return (
    <View style={styles.content}>
      <Text weight="medium">Sheet</Text>

      <RadioGroup
        orientation="horizontal"
        options={options}
        value={position}
        onValueChange={(value) => setPosition(value as 'left' | 'right' | 'top' | 'bottom')}
      />

      <Sheet
        title="Sheet Dialog"
        description="Sheet description"
        side={position}
        trigger={<Button variant="default">Open Sheet</Button>}
      >
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Text>
      </Sheet>
    </View>
  );
};
export default SheetExample;
