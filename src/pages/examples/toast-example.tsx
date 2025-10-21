import { Button } from '@/components/ui-presets/button';
import { Text } from '@/components/ui/text';
import { toast } from '@/components/ui/toast';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const ToastExample = () => {
  const styles = useStyles(exampleStyles);
  return (
    <View style={styles.content}>
      <Text weight="medium">Toast</Text>
      <Button
        variant="outline"
        onPress={() => toast.success({ title: 'Eu sou um toast!', description: 'Detalhes do toast' })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onPress={() => toast.error({ title: 'Eu sou um toast!', description: 'Detalhes do toast' })}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onPress={() => toast.warning({ title: 'Eu sou um toast!', description: 'Detalhes do toast' })}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onPress={() => toast.info({ title: 'Eu sou um toast!', description: 'Detalhes do toast' })}
      >
        Info
      </Button>
    </View>
  );
};
export default ToastExample;
