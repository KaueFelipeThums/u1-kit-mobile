import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';
import { ToggleGroupUtils } from '@/utils/toggle-group';

type SingleRootProps = {
  type: 'single';
  value: string | undefined;
  onValueChange: (val: string | undefined) => void;
};

type MultipleRootProps = {
  type: 'multiple';
  value: string[];
  onValueChange: (val: string[]) => void;
};

type RootProps = (SingleRootProps | MultipleRootProps) & {
  disabled?: boolean;
} & React.ComponentPropsWithRef<typeof View>;

const ToggleGroupContext = React.createContext<RootProps | null>(null);

const Root = ({ type, value, onValueChange, disabled = false, ...viewProps }: RootProps) => {
  return (
    <ToggleGroupContext.Provider
      value={
        {
          type,
          value,
          disabled,
          onValueChange,
        } as RootProps
      }
    >
      <View role="group" {...viewProps} />
    </ToggleGroupContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('ToggleGroup compound components cannot be rendered outside the ToggleGroup component');
  }
  return context;
}

type ItemProps = ComponentPropsWithAsChild<typeof Slot.Pressable> & {
  value: string;
};

const ItemContext = React.createContext<ItemProps | null>(null);

const Item = ({
  asChild,
  value: itemValue,
  disabled: disabledProp = false,
  onPress: onPressProp,
  ...props
}: ItemProps) => {
  const { type, disabled, value, onValueChange } = useRootContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled || disabledProp) {
      return;
    }
    if (type === 'single') {
      onValueChange(ToggleGroupUtils.getNewSingleValue(value, itemValue));
    }
    if (type === 'multiple') {
      onValueChange(ToggleGroupUtils.getNewMultipleValue(value, itemValue));
    }
    onPressProp?.(ev);
  }

  const isChecked = type === 'single' ? ToggleGroupUtils.getIsSelected(value, itemValue) : undefined;
  const isSelected = type === 'multiple' ? ToggleGroupUtils.getIsSelected(value, itemValue) : undefined;

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <ItemContext.Provider value={{ value: itemValue }}>
      <Component
        aria-disabled={disabled}
        role={type === 'single' ? 'radio' : 'checkbox'}
        onPress={onPress}
        aria-selected={isSelected}
        disabled={(disabled || disabledProp) ?? false}
        accessibilityState={{
          disabled: (disabled || disabledProp) ?? false,
          checked: isChecked,
          selected: isSelected,
        }}
        {...props}
      />
    </ItemContext.Provider>
  );
};

function useItemContext() {
  const context = React.useContext(ItemContext);
  if (!context) {
    throw new Error('ToggleGroupItem compound components cannot be rendered outside the ToggleGroupItem component');
  }
  return context;
}

const utils = ToggleGroupUtils;

export { Item, Root, useItemContext, useRootContext, utils };
