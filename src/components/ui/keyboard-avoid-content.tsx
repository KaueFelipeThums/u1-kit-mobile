import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

const keyboardAvoidingContentStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexGrow: 1,
  },
});

const KeyboardAvoidingContent = ({ ...props }: React.ComponentPropsWithRef<typeof KeyboardAvoidingView>) => {
  // const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : -insets.top - insets.bottom}
      contentContainerStyle={keyboardAvoidingContentStyles.content}
      style={keyboardAvoidingContentStyles.container}
      enabled
      {...props}
    />
  );
};

export { KeyboardAvoidingContent };
