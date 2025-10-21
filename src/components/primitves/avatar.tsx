import * as React from 'react';
import { ImageErrorEvent, ImageLoadEvent, type NativeSyntheticEvent, Image as RNImage, View } from 'react-native';

type AvatarState = 'loading' | 'error' | 'loaded';

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  alt: string;
};

type IRootContext = RootProps & {
  status: AvatarState;
  setStatus: (status: AvatarState) => void;
};

const RootContext = React.createContext<IRootContext | null>(null);

const Root = ({ alt, ...props }: RootProps) => {
  const [status, setStatus] = React.useState<AvatarState>('error');
  return (
    <RootContext.Provider value={{ alt, status, setStatus }}>
      <View {...props} />
    </RootContext.Provider>
  );
};

function useRootContext() {
  const context = React.useContext(RootContext);
  if (!context) {
    throw new Error('Avatar compound components cannot be rendered outside the Avatar component');
  }
  return context;
}

type ImageProps = Omit<React.ComponentPropsWithRef<typeof RNImage>, 'alt'> & {
  children?: React.ReactNode;
  onLoadingStatusChange?: (status: 'error' | 'loaded') => void;
};

const Image = ({ onLoad: onLoadProps, onError: onErrorProps, onLoadingStatusChange, ...props }: ImageProps) => {
  const { alt, setStatus, status } = useRootContext();

  const onLoad = React.useCallback(
    (e: ImageLoadEvent) => {
      setStatus('loaded');
      onLoadingStatusChange?.('loaded');
      onLoadProps?.(e);
    },
    [onLoadProps, onLoadingStatusChange, setStatus],
  );

  const onError = React.useCallback(
    (e: ImageErrorEvent) => {
      setStatus('error');
      onLoadingStatusChange?.('error');
      onErrorProps?.(e);
    },
    [onErrorProps, onLoadingStatusChange, setStatus],
  );

  if (status === 'error') {
    return null;
  }

  return <RNImage alt={alt} onLoad={onLoad} onError={onError} {...props} />;
};

type FallbackProps = React.ComponentPropsWithRef<typeof View>;

const Fallback = ({ ...props }: FallbackProps) => {
  const { status } = useRootContext();

  if (status !== 'error') {
    return null;
  }
  return <View role="img" {...props} />;
};

export { Fallback, Image, Root };
