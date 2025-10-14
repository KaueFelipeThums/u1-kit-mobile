import * as React from 'react';
import { BackHandler, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { Portal as PRender } from './portal/portal';
import * as Slot from './slot';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';

type RootContext = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const ImageViewerContext = React.createContext<(RootContext & { nativeID: string }) | null>(null);

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
};

const Root = ({ open: openProp, defaultOpen, onOpenChange: onOpenChangeProp, ...viewProps }: RootProps) => {
  const nativeID = React.useId();
  const [open = false, onOpenChange] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  });

  return (
    <ImageViewerContext.Provider
      value={{
        open,
        onOpenChange,
        nativeID,
      }}
    >
      <View {...viewProps} />
    </ImageViewerContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(ImageViewerContext);
  if (!context) {
    throw new Error('ImageViewer compound components cannot be rendered outside the ImageViewer component');
  }
  return context;
}

type TriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Trigger = ({ asChild, onPress: onPressProp, disabled = false, ...props }: TriggerProps) => {
  const { open, onOpenChange } = useRootContext();

  function onPress(ev: GestureResponderEvent) {
    if (disabled) {
      return;
    }
    const newValue = !open;
    onOpenChange(newValue);
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
      <ImageViewerContext.Provider value={value}>{children}</ImageViewerContext.Provider>
    </PRender>
  );
}

type OverlayProps = React.ComponentPropsWithRef<typeof Pressable> & {
  closeOnPress?: boolean;
};

const Overlay = ({ closeOnPress = true, onPress: OnPressProp, style, ...props }: OverlayProps) => {
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

type ContentProps = React.ComponentPropsWithRef<typeof View>;

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

export { Close, Content, Overlay, Portal, Root, Trigger, useRootContext };
