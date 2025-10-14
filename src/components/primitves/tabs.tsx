import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

interface RootContext extends RootProps {
  nativeID: string;
  selectedItemPosition: number | null;
  onItemPositionChange: (key: string, value: number) => void;
}

const TabsContext = React.createContext<RootContext | null>(null);

const Root = ({ defaultValue, onValueChange: onValueChangeProp, value: valueProp, ...viewProps }: RootProps) => {
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
    <TabsContext.Provider
      value={{
        value,
        onValueChange,
        nativeID,
        selectedItemPosition,
        onItemPositionChange,
      }}
    >
      <View {...viewProps} />
    </TabsContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components cannot be rendered outside the Tabs component');
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

const Trigger = ({ asChild, onPress: onPressProp, onLayout, disabled, value: tabValue, ...props }: TriggerProps) => {
  const { onValueChange, value: rootValue, nativeID, onItemPositionChange } = useRootContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled) {
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
        aria-disabled={!!disabled}
        aria-selected={rootValue === tabValue}
        role="tab"
        onPress={onPress}
        accessibilityState={{
          selected: rootValue === tabValue,
          disabled: !!disabled,
        }}
        disabled={!!disabled}
        {...props}
      />
    </TriggerContext.Provider>
  );
};

function useTriggerContext() {
  const context = React.useContext(TriggerContext);
  if (!context) {
    throw new Error('Tabs.Trigger compound components cannot be rendered outside the Tabs.Trigger component');
  }
  return context;
}

type ContentProps = React.ComponentPropsWithRef<typeof View> & {
  value: string;
};

const Content = ({ value: tabValue, ...props }: ContentProps) => {
  const { value: rootValue, nativeID } = useRootContext();

  if (rootValue !== tabValue) {
    return null;
  }

  return (
    <View
      aria-hidden={!(rootValue === tabValue)}
      aria-labelledby={`${nativeID}-tab-${tabValue}`}
      role="tabpanel"
      {...props}
    />
  );
};

export { Content, List, Root, Trigger, useRootContext, useTriggerContext };
