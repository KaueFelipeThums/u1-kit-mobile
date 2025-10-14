import * as React from 'react';
import {
  BackHandler,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  type GestureResponderEvent,
} from 'react-native';
import { Portal as PRender } from './portal/portal';
import * as Slot from './slot';
import { matchString } from '@/functions/filter';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type Option = {
  adornment?: React.ReactNode;
  description?: string;
  value: string;
  label: string;
  disabled?: boolean;
};

type IRootContext = {
  value?: string;
  onValueChange: (option: string) => void;
  disabled?: boolean;
  open: boolean;
  options?: Option[];
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  nativeID: string;
  filter?: boolean;
};

const RootContext = React.createContext<IRootContext | null>(null);

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  value?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  options?: Option[];
  onValueChange?: (option: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  defaultInputValue?: string;
  disabled?: boolean;
  filter?: boolean;
};

const Root = ({
  value: valueProp,
  defaultValue,
  defaultOpen,
  open: openProp,
  onValueChange: onValueChangeProp,
  onOpenChange: onOpenChangeProp,
  inputValue: inputValueProp,
  onInputChange: onInputChangeProp,
  defaultInputValue,
  disabled,
  filter = true,
  options,
  ...viewProps
}: RootProps) => {
  const nativeID = React.useId();
  const [value, onValueChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProp,
  });
  const [open, onOpenChange] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  });
  const [inputValue, onInputChange] = useControllableState({
    prop: inputValueProp,
    defaultProp: defaultInputValue,
    onChange: onInputChangeProp,
  });

  const handleOpenChange = (openValue: boolean) => {
    onOpenChange(openValue);
    if (!openValue) {
      onInputChange('');
    }
  };

  return (
    <RootContext.Provider
      value={{
        onInputChange,
        inputValue: inputValue ?? '',
        value,
        onValueChange,
        open: open ?? false,
        options,
        onOpenChange: handleOpenChange,
        disabled,
        nativeID,
        filter,
      }}
    >
      <View {...viewProps} />
    </RootContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(RootContext);
  if (!context) {
    throw new Error('Select compound components cannot be rendered outside the Select component');
  }
  return context;
}

type TriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;
const Trigger = ({ asChild, onPress: onPressProp, disabled, ...props }: TriggerProps) => {
  const { open, onOpenChange, disabled: disabledRoot } = useRootContext();
  const isDisabled = disabledRoot || disabled;

  function onPress(ev: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    onOpenChange(!open);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      aria-disabled={isDisabled ?? undefined}
      onPress={onPress}
      disabled={isDisabled}
      aria-expanded={open}
      {...props}
    />
  );
};

type CloseProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Close = ({ asChild, onPress: onPressProp, disabled, ...props }: CloseProps) => {
  const { open, onOpenChange } = useRootContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled) {
      return;
    }
    onOpenChange(false);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      aria-disabled={disabled ?? undefined}
      onPress={onPress}
      disabled={disabled}
      aria-expanded={open}
      {...props}
    />
  );
};

type ValueProps = React.ComponentPropsWithRef<typeof Text>;

const Value = ({ ...props }: ValueProps) => {
  const { value, options } = useRootContext();

  if (!value) {
    return null;
  }

  return <Text {...props}>{options?.find((option) => option.value === value)?.label}</Text>;
};

type PlaceholderProps = React.ComponentPropsWithRef<typeof Text>;

const Placeholder = ({ ...props }: PlaceholderProps) => {
  const { value } = useRootContext();

  if (value) {
    return null;
  }

  return <Text {...props} />;
};

type ValueContentProps = React.ComponentPropsWithRef<typeof View>;

const ValueContent = ({ ...props }: ValueContentProps) => {
  return <View {...props} />;
};

type PortalProps = {
  forceMount?: true | undefined;
  visible?: boolean;
  children: React.ReactNode;
};

function Portal({ forceMount, visible, children }: PortalProps) {
  const value = useRootContext();
  const isVisible = visible !== undefined ? visible : value.open;

  if (!forceMount) {
    if (!isVisible) {
      return null;
    }
  }

  return (
    <PRender name={`${value.nativeID}_portal`}>
      <RootContext.Provider value={value}>{children}</RootContext.Provider>
    </PRender>
  );
}

type OverlayProps = React.ComponentPropsWithRef<typeof Pressable> & {
  closeOnPress?: boolean;
};

const Overlay = ({ onPress: OnPressProp, closeOnPress = true, style, ...props }: OverlayProps) => {
  const { onOpenChange } = useRootContext();

  function onPress(ev: GestureResponderEvent) {
    if (closeOnPress) {
      onOpenChange(false);
    }
    OnPressProp?.(ev);
  }
  return (
    <Pressable
      onPress={onPress}
      style={(styleState) => [StyleSheet.absoluteFill, typeof style === 'function' ? style(styleState) : style]}
      {...props}
    />
  );
};

type ContentProps = React.ComponentPropsWithRef<typeof View> & {
  forceMount?: true | undefined;
};

const Content = ({ ...props }: ContentProps) => {
  const { onOpenChange } = useRootContext();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onOpenChange(false);
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [onOpenChange]);

  return <View role="list" aria-modal={true} {...props} />;
};

const ItemContext = React.createContext<{
  itemValue: string;
} | null>(null);

type ItemProps = React.ComponentPropsWithRef<typeof Pressable> & {
  value: string;
  closeOnPress?: boolean;
};

const Item = ({ value: itemValue, onPress: onPressProp, disabled, closeOnPress = true, ...props }: ItemProps) => {
  const { onOpenChange, onValueChange, disabled: disabledRoot } = useRootContext();
  const isDisabled = disabledRoot || disabled;

  function onPress(ev: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    if (closeOnPress) {
      onOpenChange(false);
    }

    onValueChange(itemValue);
    onPressProp?.(ev);
  }

  return (
    <ItemContext.Provider value={{ itemValue }}>
      <Pressable role="option" onPress={onPress} disabled={isDisabled} aria-disabled={!!isDisabled} {...props} />
    </ItemContext.Provider>
  );
};

function useItemContext() {
  const context = React.useContext(ItemContext);
  if (!context) {
    throw new Error('Item compound components cannot be rendered outside of an Item component');
  }
  return context;
}

type ItemIndicatorProps = ComponentPropsWithAsChild<typeof View>;

const ItemIndicator = ({ ...props }: ItemIndicatorProps) => {
  const { itemValue } = useItemContext();
  const { value } = useRootContext();

  if (value !== itemValue) {
    return null;
  }

  return <View role="presentation" {...props} />;
};

type FlatListGroupProps = Omit<React.ComponentPropsWithRef<typeof FlatList<Option>>, 'data' | 'renderItem'> & {
  renderItem: ListRenderItem<Option>;
};

const FlatListGroup = ({ renderItem, ...props }: FlatListGroupProps) => {
  const { options, filter, inputValue } = useRootContext();

  const filteredData = React.useMemo(
    () => (!filter ? options : options?.filter((option) => matchString(option.label, inputValue ?? ''))),
    [inputValue, options, filter],
  );

  return (
    <FlatList keyboardShouldPersistTaps="always" data={filteredData} renderItem={renderItem} role="group" {...props} />
  );
};

type InputProps = Omit<React.ComponentPropsWithRef<typeof TextInput>, 'onChangeText' | 'value'>;

const Input = ({ editable, ...props }: InputProps) => {
  const { inputValue, onInputChange, disabled: disabledRoot } = useRootContext();

  return <TextInput editable={editable || !disabledRoot} {...props} value={inputValue} onChangeText={onInputChange} />;
};

export {
  Content,
  FlatListGroup,
  Item,
  ItemIndicator,
  Overlay,
  Portal,
  Root,
  Trigger,
  useItemContext,
  useRootContext,
  Value,
  Close,
  Input,
  Placeholder,
  ValueContent,
};
