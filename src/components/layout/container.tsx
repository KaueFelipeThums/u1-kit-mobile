import { ScrollView, StyleSheet, View } from 'react-native';
import { useStyles } from '@/theme/hooks/use-styles';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

const containerStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: sizes.padding.xl,
    },
    containerList: {
      flex: 1,
    },
    contentContainerList: {
      paddingVertical: sizes.padding.xl,
    },
  });

const ContainerView = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(containerStyles);
  return <View style={[styles.container, style]} {...props} />;
};

const ContainerScrollView = ({ contentContainerStyle, ...props }: React.ComponentPropsWithRef<typeof ScrollView>) => {
  const styles = useStyles(containerStyles);
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      style={styles.containerList}
      contentContainerStyle={[styles.contentContainerList, contentContainerStyle]}
      {...props}
    />
  );
};

export { ContainerView, ContainerScrollView };
