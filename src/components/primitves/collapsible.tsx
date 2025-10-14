import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootContext = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
};

const CollapsibleContext = React.createContext<(RootContext & { nativeID: string }) | null>(null);

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

const Root = ({
  disabled = false,
  open: openProp,
  defaultOpen,
  onOpenChange: onOpenChangeProp,
  ...viewProps
}: RootProps) => {
  const nativeID = React.useId();
  const [open = false, onOpenChange] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  });

  return (
    <CollapsibleContext.Provider
      value={{
        disabled,
        open,
        onOpenChange,
        nativeID,
      }}
    >
      <View {...viewProps} />
    </CollapsibleContext.Provider>
  );
};

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible compound components cannot be rendered outside the Collapsible component');
  }
  return context;
}

type TriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Trigger = ({ asChild, onPress: onPressProp, disabled: disabledProp = false, ...props }: TriggerProps) => {
  const { disabled, open, onOpenChange, nativeID } = useCollapsibleContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled || disabledProp) {
      return;
    }
    onOpenChange(!open);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      nativeID={nativeID}
      aria-disabled={(disabled || disabledProp) ?? undefined}
      role="button"
      onPress={onPress}
      accessibilityState={{
        expanded: open,
        disabled: (disabled || disabledProp) ?? undefined,
      }}
      disabled={disabled || disabledProp}
      {...props}
    />
  );
};

type ContentProps = React.ComponentPropsWithRef<typeof View>;

const Content = ({ ...props }: ContentProps) => {
  const { nativeID, open } = useCollapsibleContext();

  if (!open) {
    return null;
  }

  return <View aria-hidden={!open} aria-labelledby={nativeID} role={'region'} {...props} />;
};

export { Content, Root, Trigger };
