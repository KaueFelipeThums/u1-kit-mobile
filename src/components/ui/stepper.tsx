import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, IconName } from './icon';
import { Text } from './text';
import { useStyles } from '@/theme/hooks/use-styles';
import { useTheme } from '@/theme/theme-provider/theme-provider';
import { ThemeValue } from '@/theme/theme-provider/theme-provider-types';

type StepperContext = {
  orientation: 'horizontal' | 'vertical';
};

const StepperContext = React.createContext<StepperContext>({
  orientation: 'vertical',
});

function useStepper() {
  const context = React.useContext(StepperContext);
  if (!context) throw new Error('useStepper must be used within a StepperProvider.');
  return context;
}

type StepperProps = React.ComponentPropsWithRef<typeof View> & {
  orientation?: 'horizontal' | 'vertical';
};

const stepperStyles = StyleSheet.create({
  stepper: {
    flexDirection: 'column',
    width: '100%',
  },
});

const Stepper = ({ style, orientation = 'vertical', ...props }: StepperProps) => (
  <StepperContext.Provider value={{ orientation }}>
    <View style={[stepperStyles.stepper, style]} {...props} />
  </StepperContext.Provider>
);

const stepperHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  horizontal: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
});

const StepperHeader = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { orientation } = useStepper();
  return <View style={[stepperHeaderStyles.header, stepperHeaderStyles[orientation], style]} {...props} />;
};

type StepperStepContext = {
  isLast?: boolean;
  state: 'active' | 'completed' | 'incomplete';
};

const StepperStepContext = React.createContext<StepperStepContext>({
  state: 'incomplete',
});

function useStepperStep() {
  const context = React.useContext(StepperStepContext);
  if (!context) {
    throw new Error('useStepperStep must be used within a StepperProvider.');
  }
  return context;
}

type StepperStepProps = React.ComponentPropsWithRef<typeof View> & {
  state?: 'active' | 'completed' | 'incomplete';
  isLast?: boolean;
};

const stepperStepStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    horizontal: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    step: {
      flex: 1,
      gap: sizes.gap.md,
    },
    vertical: {
      flexDirection: 'row',
    },
  });

const StepperStep = ({ style, state = 'incomplete', isLast, ...props }: StepperStepProps) => {
  const { orientation } = useStepper();
  const styles = useStyles(stepperStepStyles);

  return (
    <StepperStepContext.Provider value={{ state, isLast }}>
      <View style={[styles.step, styles[orientation], style]} {...props} />
    </StepperStepContext.Provider>
  );
};

const stepperSeparatorStyles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  separator: {
    alignItems: 'center',
    position: 'relative',
  },
  vertical: {
    flexDirection: 'column',
  },
});

const StepperSeparator = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { orientation } = useStepper();
  return <View style={[stepperSeparatorStyles.separator, stepperSeparatorStyles[orientation], style]} {...props} />;
};

type StepperIconProps = React.ComponentPropsWithRef<typeof View> & {
  icon?: IconName;
};

const stepperIconStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    active: {
      backgroundColor: colors.primary,
    },
    completed: {
      backgroundColor: `${colors.primary}20`,
    },
    dot: {
      backgroundColor: colors.mutedForeground,
      borderRadius: sizes.radius.full,
      height: sizes.dimension.xs,
      width: sizes.dimension.xs,
    },
    dotActive: {
      backgroundColor: colors.white,
    },
    dotCompleted: {
      backgroundColor: colors.primary,
    },
    icon: {
      alignItems: 'center',
      backgroundColor: colors.muted,
      borderRadius: sizes.radius.full,
      height: sizes.dimension.lg,
      justifyContent: 'center',
      width: sizes.dimension.lg,
    },
    vertical: {
      marginTop: sizes.margin.sm,
    },
  });

const StepperIcon = ({ style, ...props }: StepperIconProps) => {
  const { orientation } = useStepper();
  const styles = useStyles(stepperIconStyles);
  const { state } = useStepperStep();
  const { colors, sizes } = useTheme();

  const iconColor = {
    completed: colors.primary,
    incomplete: colors.mutedForeground,
    active: colors.white,
  };

  return (
    <View
      style={[
        styles.icon,
        orientation === 'vertical' && styles.vertical,
        state === 'completed' && styles.completed,
        state === 'active' && styles.active,
        style,
      ]}
      {...props}
    >
      {props.icon ? (
        <Icon
          size={sizes.dimension.xs * 1.2}
          color={iconColor[state]}
          name={state === 'completed' ? 'Check' : props.icon}
        />
      ) : (
        <View
          style={[styles.dot, state === 'completed' && styles.dotCompleted, state === 'active' && styles.dotActive]}
        />
      )}
    </View>
  );
};

const stepperConnectorStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    completed: {
      backgroundColor: colors.primary,
    },

    horizontal: {
      height: sizes.border.sm,
      width: '100%',
      left: '50%',
      marginHorizontal: sizes.dimension.lg / 2,
      position: 'absolute',
      right: '-50%',
    },

    separator: {
      backgroundColor: colors.border,
    },
    vertical: {
      width: sizes.border.sm,
      height: '100%',
    },
  });

const StepperConnector = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(stepperConnectorStyles);
  const { orientation } = useStepper();
  const { state, isLast } = useStepperStep();

  if (isLast) {
    return null;
  }

  return (
    <View
      style={[styles.separator, styles[orientation], state === 'completed' && styles.completed, style]}
      {...props}
    />
  );
};

const stepperContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    horizontal: {
      minWidth: sizes.dimension.md,
      paddingHorizontal: sizes.padding.sm,
    },
    vertical: {
      paddingBottom: sizes.padding['2xl'],
    },
  });

const StepperContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { orientation } = useStepper();
  const styles = useStyles(stepperContentStyles);

  return <View style={[styles.content, styles[orientation], style]} {...props} />;
};

const stepperDescriptionContentStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    horizontal: {
      marginLeft: sizes.padding.sm,
    },
  });

const StepperDescriptionContent = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const { orientation } = useStepper();
  const styles = useStyles(stepperDescriptionContentStyles);

  return <View style={[orientation === 'horizontal' && styles.horizontal, style]} {...props} />;
};

const stepperTitleStyles = StyleSheet.create({
  horizontal: {
    textAlign: 'center',
  },
});

const StepperTitle = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const { orientation } = useStepper();

  return <Text style={[orientation === 'horizontal' && stepperTitleStyles.horizontal, style]} {...props} />;
};

const stepperDescriptionStyles = ({ sizes, colors }: ThemeValue) =>
  StyleSheet.create({
    description: {
      color: colors.mutedForeground,
      fontSize: sizes.fontSize.xs,
    },
    horizontal: {
      textAlign: 'center',
    },
  });

const StepperDescription = ({ style, ...props }: React.ComponentPropsWithRef<typeof Text>) => {
  const { orientation } = useStepper();
  const styles = useStyles(stepperDescriptionStyles);

  return <Text style={[styles.description, orientation === 'horizontal' && styles.horizontal, style]} {...props} />;
};

const stepperStepContentWrapperStyles = ({ sizes }: ThemeValue) =>
  StyleSheet.create({
    contentWrapper: {
      marginTop: sizes.margin.md,
    },
  });

const StepperStepContentWrapper = ({ style, ...props }: React.ComponentPropsWithRef<typeof View>) => {
  const styles = useStyles(stepperStepContentWrapperStyles);

  return <View style={[styles.contentWrapper, style]} {...props} />;
};

export {
  Stepper,
  StepperStep,
  StepperConnector,
  StepperContent,
  StepperDescriptionContent,
  StepperTitle,
  StepperDescription,
  StepperStepContentWrapper,
  StepperSeparator,
  StepperIcon,
  StepperHeader,
};
