import * as React from 'react';
import { BackHandler, Pressable, Text, View, type GestureResponderEvent } from 'react-native';
import { Portal as PRender } from './portal/portal';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootContext = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

type RootProps = {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  defaultOpen?: boolean;
} & React.ComponentPropsWithRef<typeof View>;

const AlertDialogContext = React.createContext<(RootContext & { nativeID: string }) | null>(null);

const Root = ({ open: openProp, defaultOpen, onOpenChange: onOpenChangeProp, ...viewProps }: RootProps) => {
  const nativeID = React.useId();
  const [open = false, onOpenChange] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  });
  return (
    <AlertDialogContext.Provider
      value={{
        open,
        onOpenChange,
        nativeID,
      }}
    >
      <View {...viewProps} />
    </AlertDialogContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog compound components cannot be rendered outside the AlertDialog component');
  }
  return context;
}

type TriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Trigger = ({ asChild, onPress: onPressProp, disabled = false, ...props }: TriggerProps) => {
  const { open: value, onOpenChange } = useRootContext();

  function onPress(ev: GestureResponderEvent) {
    onOpenChange(!value);
    onPressProp?.(ev);
  }

  const Component = asChild ? Slot.Pressable : Pressable;
  return (
    <Component
      aria-disabled={disabled ?? undefined}
      role="button"
      onPress={onPress}
      disabled={disabled ?? undefined}
      {...props}
    />
  );
};

type PortalProps = {
  forceMount?: true | undefined;
  visible?: boolean;
  children: React.ReactNode;
};

function Portal({ forceMount, children, visible }: PortalProps) {
  const value = useRootContext();
  const isVisible = visible !== undefined ? visible : value.open;

  if (!forceMount) {
    if (!isVisible) {
      return null;
    }
  }

  return (
    <PRender name={`${value.nativeID}_portal`}>
      <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>
    </PRender>
  );
}

type OverlayProps = React.ComponentPropsWithRef<typeof Pressable> & {
  closeOnPress?: boolean;
};

const Overlay = ({ closeOnPress = true, onPress: OnPressProp, ...props }: OverlayProps) => {
  const { onOpenChange } = useRootContext();

  function onPress(ev: GestureResponderEvent) {
    if (closeOnPress) {
      onOpenChange(false);
    }
    OnPressProp?.(ev);
  }
  return <Pressable onPress={onPress} {...props} />;
};

type ContentProps = React.ComponentPropsWithRef<typeof View> & {
  visible?: boolean;
};

const Content = ({ ...props }: ContentProps) => {
  const { nativeID, onOpenChange } = useRootContext();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onOpenChange(false);
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [onOpenChange]);

  return (
    <View
      role="dialog"
      nativeID={nativeID}
      aria-labelledby={`${nativeID}_label`}
      aria-describedby={`${nativeID}_desc`}
      aria-modal={true}
      {...props}
    />
  );
};

type CloseProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Close = ({ asChild, onPress: onPressProp, disabled = false, ...props }: CloseProps) => {
  const { onOpenChange } = useRootContext();

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
      role="button"
      onPress={onPress}
      disabled={disabled ?? undefined}
      {...props}
    />
  );
};

type CancelProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Cancel = ({ asChild, onPress: onPressProp, disabled = false, ...props }: CancelProps) => {
  const { onOpenChange } = useRootContext();

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
      role="button"
      onPress={onPress}
      disabled={disabled ?? undefined}
      {...props}
    />
  );
};

type ActionProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Action = ({ asChild, onPress: onPressProp, disabled = false, ...props }: ActionProps) => {
  const { onOpenChange } = useRootContext();

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
      role="button"
      onPress={onPress}
      disabled={disabled ?? undefined}
      {...props}
    />
  );
};

type TitleProps = React.ComponentPropsWithRef<typeof Text>;

const Title = (props: TitleProps) => {
  const { nativeID } = useRootContext();
  return <Text role="heading" nativeID={`${nativeID}_label`} {...props} />;
};

type DescriptionProps = React.ComponentPropsWithRef<typeof Text>;

const Description = (props: DescriptionProps) => {
  const { nativeID } = useRootContext();
  return <Text nativeID={`${nativeID}_desc`} {...props} />;
};

Description.displayName = 'DescriptionNativeAlertDialog';

export { Action, Cancel, Content, Description, Overlay, Portal, Root, Title, Trigger, useRootContext, Close };
