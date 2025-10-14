import * as React from 'react';
import { View } from 'react-native';

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  value?: number | null | undefined;
  max?: number;
  getValueLabel?(value: number, max: number): string;
};

const Root = ({ ...props }: RootProps) => {
  return <View role="progressbar" {...props} />;
};

type IndicatorProps = React.ComponentPropsWithRef<typeof View>;

const Indicator = ({ ...props }: IndicatorProps) => {
  return <View role="presentation" {...props} />;
};

export { Indicator, Root };
