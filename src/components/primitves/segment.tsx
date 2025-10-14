import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
};

interface RootContext extends RootProps {
  nativeID: string;
  selectedItemPosition: number | null;
  onItemPositionChange: (key: string, value: number) => void;
}

const SegmentContext = React.createContext<RootContext | null>(null);

const Root = ({
  defaultValue,
  onValueChange: onValueChangeProp,
  value: valueProp,
  disabled,
  ...viewProps
}: RootProps) => {
  const nativeID = React.useId();
  const [itemPositions, setItemPositions] = React.useState<Record<string, number>>({});
  const selectedItemPosition = valueProp ? itemPositions[valueProp] : null;

  const onItemPositionChange = React.useCallback((key: string, value: number) => {
    setItemPositions((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  const [value, onValueChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProp,
  });

  return (
    <SegmentContext.Provider
      value={{
        value,
        onValueChange,
        nativeID,
        disabled,
        selectedItemPosition,
        onItemPositionChange,
      }}
    >
      <View {...viewProps} />
    </SegmentContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(SegmentContext);
  if (!context) {
    throw new Error('Segment compound components cannot be rendered outside the Segment component');
  }
  return context;
}

type ListProps = React.ComponentPropsWithRef<typeof View>;

const List = ({ ...props }: ListProps) => {
  return <View role="tablist" {...props} />;
};

const TriggerContext = React.createContext<{ value: string } | null>(null);

type TriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable> & {
  value: string;
};

const Trigger = ({
  asChild,
  onPress: onPressProp,
  disabled: disabledProp,
  value: tabValue,
  onLayout,
  ...props
}: TriggerProps) => {
  const { onValueChange, value: rootValue, nativeID, disabled, onItemPositionChange } = useRootContext();
  const isDisabled = disabledProp || disabled;

  function onPress(ev: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    onValueChange?.(tabValue);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <TriggerContext.Provider value={{ value: tabValue }}>
      <Component
        onLayout={(event) => {
          onItemPositionChange(tabValue, event.nativeEvent.layout.x);
          onLayout?.(event);
        }}
        nativeID={`${nativeID}-tab-${tabValue}`}
        aria-disabled={!!isDisabled}
        aria-selected={rootValue === tabValue}
        role="tab"
        onPress={onPress}
        accessibilityState={{
          selected: rootValue === tabValue,
          disabled: !!isDisabled,
        }}
        disabled={!!disabled}
        {...props}
      />
    </TriggerContext.Provider>
  );
};

export { List, Root, Trigger, useRootContext };
