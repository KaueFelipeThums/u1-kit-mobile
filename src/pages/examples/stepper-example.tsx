import { Icon } from '@/components/ui/icon';
import {
  Stepper,
  StepperConnector,
  StepperContent,
  StepperDescription,
  StepperHeader,
  StepperIcon,
  StepperSeparator,
  StepperStep,
  StepperStepContentWrapper,
  StepperTitle,
} from '@/components/ui/stepper';
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

const StepperExample = () => {
  const styles = useStyles(exampleStyles);

  return (
    <View style={styles.content}>
      <Text weight="medium">Stepper</Text>
      <Stepper orientation="horizontal">
        <StepperHeader>
          <StepperStep state="completed">
            <StepperSeparator>
              <StepperIcon icon="Bus" />
              <StepperConnector />
            </StepperSeparator>

            <StepperContent>
              <StepperTitle>Step 1</StepperTitle>
              <StepperDescription>Step 1 Description</StepperDescription>
            </StepperContent>
          </StepperStep>

          <StepperStep state="active">
            <StepperSeparator>
              <StepperIcon icon="Wallet" />
              <StepperConnector />
            </StepperSeparator>

            <StepperContent>
              <StepperTitle>Step 1</StepperTitle>
              <StepperDescription>Step 1 Description</StepperDescription>
            </StepperContent>
          </StepperStep>

          <StepperStep>
            <StepperSeparator>
              <StepperIcon icon="Truck" />
            </StepperSeparator>

            <StepperContent>
              <StepperTitle>Step 1</StepperTitle>
              <StepperDescription>Step 1 Description</StepperDescription>
            </StepperContent>
          </StepperStep>
        </StepperHeader>
      </Stepper>
    </View>
  );
};
export default StepperExample;
