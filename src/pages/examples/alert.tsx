import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
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

const AlertExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Alert</Text>
      <Alert variant="default">
        <AlertIcon name="TriangleAlert" />
        <AlertContent>
          <AlertTitle>Título Alerta Default</AlertTitle>
          <AlertDescription>Descrição do alerta</AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="destructive">
        <AlertIcon name="TriangleAlert" />
        <AlertContent>
          <AlertTitle>Título Alerta Destructive</AlertTitle>
          <AlertDescription>Descrição do alerta</AlertDescription>
        </AlertContent>
      </Alert>
    </View>
  );
};
export default AlertExample;
