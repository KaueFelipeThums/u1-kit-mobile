import { AlertDialog } from '@/components/ui-presets/alert-dialog';
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

const AlertDialogExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Alert Dialog</Text>

      <AlertDialog title="Alert Dialog" description="Alert Dialog Description">
        <Button variant="outline">Open Alert Dialog</Button>
      </AlertDialog>
    </View>
  );
};
export default AlertDialogExample;
