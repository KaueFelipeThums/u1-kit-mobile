import { SafeAreaContent } from '@/components/ui/safe-area-content';
import InputExample from '../examples/input-example';
import { KeyboardAvoidingContent } from '@/components/ui/keyboard-avoid-content';
import { ContainerScrollView } from '@/components/layout/container';
import { StyleSheet } from 'react-native';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';
import { useStyles } from '@/theme/hooks/use-styles';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import CheckboxGroupExample from '../examples/checkbox-group-example';
import SelectExample from '../examples/select-example';
import SelectMultipleExample from '../examples/select-multiple-example';
import AlertExample from '../examples/alert';
import ButtonExample from '../examples/button-example';
import DialogExample from '../examples/dialog-example';
import AlertDialogExample from '../examples/alert-dialog-example';
import SheetExample from '../examples/sheet-example';
import AccordionExample from '../examples/accordion';
import RadioGroupExample from '../examples/radio-group-example';
import BreadcrumbExample from '../examples/breadcrumb';

const homeStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: sizes.padding.xl,
      gap: sizes.padding.xl,
    },
    title: {
      color: colors.foreground,
      fontSize: sizes.fontSize['3xl'],
      marginBottom: sizes.margin.xl,
    },
  });

const Home = () => {
  const styles = useStyles(homeStyles);

  return (
    <SafeAreaContent>
      <KeyboardAvoidingContent>
        <ContainerScrollView contentContainerStyle={styles.content}>
          <Text weight="bold" style={styles.title}>
            U1 Kit Mobile
          </Text>

          <Separator />
          <InputExample />
          <Separator />
          <CheckboxGroupExample />
          <Separator />
          <RadioGroupExample />
          <Separator />
          <SelectExample />
          <Separator />
          <SelectMultipleExample />
          <Separator />
          <AlertExample />
          <Separator />
          <ButtonExample />
          <Separator />
          <DialogExample />
          <Separator />
          <AlertDialogExample />
          <Separator />
          <SheetExample />
          <Separator />
          <BreadcrumbExample />
          <Separator />
          <AccordionExample />
        </ContainerScrollView>
      </KeyboardAvoidingContent>
    </SafeAreaContent>
  );
};

export default Home;
