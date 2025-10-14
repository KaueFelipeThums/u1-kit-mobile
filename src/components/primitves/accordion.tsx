import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootContext = {
  type: 'single' | 'multiple';
  value: (string | undefined) | string[];
  onValueChange: (value: string | string[] | undefined) => void | ((value: string[]) => void);
  collapsible: boolean;
  disabled?: boolean;
};

const AccordionContext = React.createContext<RootContext | null>(null);

type SingleRootProps = {
  type: 'single';
  defaultValue?: string | undefined;
  value?: string | undefined;
  onValueChange?: (value: string | undefined) => void;
};

type MultipleRootProps = {
  type: 'multiple';
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

type RootProps = (SingleRootProps | MultipleRootProps) & {
  defaultValue?: string | string[];
  disabled?: boolean;
  collapsible?: boolean;
} & React.ComponentPropsWithRef<typeof View>;

const Root = ({
  type,
  disabled,
  collapsible = true,
  value: valueProp,
  onValueChange: onValueChangeProps,
  defaultValue,
  ...viewProps
}: RootProps) => {
  const [value = type === 'multiple' ? [] : undefined, onValueChange] = useControllableState<
    (string | undefined) | string[]
  >({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProps as (state: string | string[] | undefined) => void,
  });

  return (
    <AccordionContext.Provider
      value={{
        type,
        disabled,
        collapsible,
        value,
        onValueChange,
      }}
    >
      <View {...viewProps} />
    </AccordionContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion compound components cannot be rendered outside the Accordion component');
  }
  return context;
}

type ItemProps = {
  value: string;
  disabled?: boolean;
} & React.ComponentPropsWithRef<typeof View>;

type AccordionItemContext = ItemProps & {
  nativeID: string;
  isExpanded: boolean;
};

const AccordionItemContext = React.createContext<AccordionItemContext | null>(null);

const Item = ({ value, disabled, ...viewProps }: ItemProps) => {
  const { value: rootValue } = useRootContext();
  const nativeID = React.useId();

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        disabled,
        nativeID,
        isExpanded: isItemExpanded(rootValue, value),
      }}
    >
      <View {...viewProps} />
    </AccordionItemContext.Provider>
  );
};

function useItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem compound components cannot be rendered outside the AccordionItem component');
  }
  return context;
}

type HeaderProps = React.ComponentPropsWithRef<typeof View>;

const Header = ({ ...props }: HeaderProps) => {
  const { disabled: rootDisabled } = useRootContext();
  const { disabled: itemDisabled, isExpanded } = useItemContext();

  return <View role="heading" aria-expanded={isExpanded} aria-disabled={rootDisabled ?? itemDisabled} {...props} />;
};

type TriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Trigger = ({ asChild, onPress: onPressProp, disabled: disabledProp, ...props }: TriggerProps) => {
  const { disabled: rootDisabled, type, onValueChange, value: rootValue, collapsible } = useRootContext();
  const { nativeID, disabled: itemDisabled, value, isExpanded } = useItemContext();

  function onPress(ev: GestureResponderEvent) {
    if (rootDisabled || itemDisabled) {
      return;
    }
    if (type === 'single') {
      const newValue = collapsible ? (value === rootValue ? undefined : value) : value;
      onValueChange(newValue);
    }
    if (type === 'multiple') {
      const rootToArray = toStringArray(rootValue);
      const newValue = collapsible
        ? rootToArray.includes(value)
          ? rootToArray.filter((val) => val !== value)
          : rootToArray.concat(value)
        : [...new Set(rootToArray.concat(value))];
      onValueChange(newValue);
    }
    onPressProp?.(ev);
  }

  const isDisabled = disabledProp || rootDisabled || itemDisabled;
  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      nativeID={nativeID}
      aria-disabled={isDisabled}
      role="button"
      onPress={onPress}
      accessibilityState={{
        expanded: isExpanded,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      {...props}
    />
  );
};

type ContentProps = React.ComponentPropsWithRef<typeof View> & {
  forceMount?: boolean;
};

const Content = ({ forceMount, ...props }: ContentProps) => {
  const { type } = useRootContext();
  const { nativeID, isExpanded } = useItemContext();

  if (!forceMount) {
    if (!isExpanded) {
      return null;
    }
  }

  return (
    <View
      aria-hidden={!(forceMount || isExpanded)}
      aria-labelledby={nativeID}
      role={type === 'single' ? 'region' : 'summary'}
      {...props}
    />
  );
};

export { Content, Header, Item, Root, Trigger, useItemContext, useRootContext };

function toStringArray(value?: string | string[]) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function isItemExpanded(rootValue: string | string[] | undefined, value: string) {
  return Array.isArray(rootValue) ? rootValue.includes(value) : rootValue === value;
}
