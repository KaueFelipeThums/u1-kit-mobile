import { Button } from '@/components/ui-presets/button';
import { Dialog } from '@/components/ui-presets/dialog';
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

const DialogExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Dialog</Text>

      <Dialog
        title="Dialog"
        description="Dialog description"
        footer={
          <>
            <Button variant="outline" iconPlacement="right" icon="Send">
              Submit
            </Button>
            <Button variant="destructive" iconPlacement="right" icon="RefreshCcw">
              Reset
            </Button>
          </>
        }
        trigger={<Button variant="default">Open Dialog</Button>}
      >
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
          sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </Text>
      </Dialog>
    </View>
  );
};
export default DialogExample;
