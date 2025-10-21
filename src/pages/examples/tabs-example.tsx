import { Tabs, TabsContent, TabsTrigger, TabsListScroll } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { StyleSheet, View } from 'react-native';

const exampleStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      gap: sizes.gap.md,
    },
  });

const TabsExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Tabs</Text>

      <Tabs defaultValue="login">
        <TabsListScroll>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
          <TabsTrigger value="extra-1">Extra 1</TabsTrigger>
          <TabsTrigger value="extra-2">Extra 2</TabsTrigger>
          <TabsTrigger value="extra-3">Extra 3</TabsTrigger>
        </TabsListScroll>
        <TabsContent value="login">
          <Text>Login</Text>
        </TabsContent>
        <TabsContent value="register">
          <Text>Register</Text>
        </TabsContent>
        <TabsContent value="forgot-password">
          <Text>Forgot Password</Text>
        </TabsContent>
      </Tabs>
    </View>
  );
};
export default TabsExample;
