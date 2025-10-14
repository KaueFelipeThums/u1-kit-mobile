import { StyleSheet } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider as SafeAreaContextProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const safeAreaContentStyles = ({ colors }: ThemeValue) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.transparent,
      flex: 1,
    },
  });

const SafeAreaProvider = ({ children, ...props }: React.ComponentPropsWithRef<typeof SafeAreaContextProvider>) => {
  return (
    <SafeAreaContextProvider initialMetrics={initialWindowMetrics} {...props}>
      {children}
    </SafeAreaContextProvider>
  );
};

const SafeAreaContent = ({ style, children, ...props }: React.ComponentPropsWithRef<typeof SafeAreaView>) => {
  const styles = useStyles(safeAreaContentStyles);

  return (
    <SafeAreaView style={[styles.content, style]} {...props}>
      {children}
    </SafeAreaView>
  );
};

export { SafeAreaProvider, SafeAreaContent };
