import { pick, types } from '@react-native-documents/picker';
import React from 'react';
import { PermissionsAndroid, Platform, Pressable, View } from 'react-native';
import { CameraType, launchCamera, MediaType, PhotoQuality } from 'react-native-image-picker';
import * as Slot from './slot';
import { uuid } from '@/functions/uuid';
import { useControllableState } from '@/hooks/use-controllable-state';
import { ComponentPropsWithAsChild } from '@/types/component-as-child';
import { AppFile } from '@/types/file';

type ErrorTypes = 'size' | 'type' | 'count' | 'permission';

type Error = {
  type: ErrorTypes;
  message: string;
};

type RootContext = {
  onValueChange: (files: AppFile[]) => void;
  value: AppFile[];
  disabled?: boolean;
  uploadAcceptedTypes: (keyof typeof types)[];
  maxFiles: number;
  loading?: boolean;
  setLoading: (loading: boolean) => void;
  /**
   * Bytes
   */
  maxSize?: number;
  isMaxFilesReached: boolean;
  onError?: (err: Error) => void;

  /**
   * Camera options
   */
  mediaQuality: PhotoQuality;
  mediaType: MediaType;
  cameraType: CameraType;
  durationLimit: number;
  imageMaxWidth?: number;
  imageMaxHeight?: number;
};

const RootContext = React.createContext<RootContext | null>(null);

function useRootContext() {
  const context = React.useContext(RootContext);
  if (!context) {
    throw new Error('Upload compound components cannot be rendered outside the Upload component');
  }
  return context;
}

type RootProps = React.ComponentPropsWithRef<typeof View> & {
  onValueChange?: (files: AppFile[]) => void;
  value?: AppFile[];
  uploadAcceptedTypes?: (keyof typeof types)[];
  /**
   * Bytes
   */
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  onError?: (err: Error) => void;

  /**
   * Camera options
   */
  mediaType?: MediaType;
  mediaQuality?: PhotoQuality;
  cameraType?: CameraType;
  durationLimit?: number;
  imageMaxWidth?: number;
  imageMaxHeight?: number;
};

const Root = ({
  value: valueProp,
  onValueChange: onValueChangeProp,
  uploadAcceptedTypes = [],
  onError,
  maxSize,
  maxFiles = 1,
  disabled,
  /**
   * Camera options
   */
  mediaQuality = 0.8,
  durationLimit = 60,
  mediaType = 'photo',
  cameraType = 'back',
  imageMaxWidth = 1800,
  imageMaxHeight = 1800,
  ...viewProps
}: RootProps) => {
  const [value, onValueChange] = useControllableState({
    prop: valueProp,
    defaultProp: [],
    onChange: onValueChangeProp,
  });
  const [loading, setLoading] = React.useState(false);

  return (
    <RootContext.Provider
      value={{
        value: value || [],
        onValueChange,
        uploadAcceptedTypes,
        maxFiles,
        onError,
        isMaxFilesReached: (value ?? []).length >= maxFiles,
        loading,
        setLoading,

        /**
         * Bytes
         */
        maxSize,
        disabled: disabled,

        /**
         * Camera options
         */
        mediaType,
        cameraType,
        mediaQuality,
        durationLimit,
        imageMaxWidth,
        imageMaxHeight,
      }}
    >
      <View {...viewProps} />
    </RootContext.Provider>
  );
};

type ValueProps = {
  renderItem: (value: AppFile[]) => React.ReactNode;
};

const Value = ({ renderItem }: ValueProps) => {
  const { value } = useRootContext();

  if (!value || value.length === 0) {
    return null;
  }

  return <>{renderItem?.(value)}</>;
};

type TriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const Trigger = ({ asChild, disabled, ...props }: TriggerProps) => {
  const {
    onValueChange,
    uploadAcceptedTypes,
    disabled: rootDisabled,
    maxSize,
    maxFiles,
    onError,
    value,
    isMaxFilesReached,
    setLoading,
    loading,
  } = useRootContext();
  const isDisabled = rootDisabled || disabled || isMaxFilesReached || loading;

  const handlePress = React.useCallback(async () => {
    if (isDisabled) return;
    setLoading(true);
    try {
      const result = await pick({
        allowMultiSelection: maxFiles > 1,
        type: uploadAcceptedTypes.length > 0 ? uploadAcceptedTypes.map((type) => types[type]) : undefined,
        presentationStyle: 'fullScreen',
        mode: 'open',
        requestLongTermAccess: true,
      });

      if (!result || result.length === 0) {
        return;
      }

      const newFiles = result.map((file) => {
        const name = file.name?.trim() || `file-${uuid()}`;
        const type = file.type || '';
        const uri = file.uri;
        const size = file.size ?? 0;
        return { name, type, uri, size };
      });

      if (maxSize && newFiles.some((f) => f.size > maxSize * 1024)) {
        onError?.({
          type: 'size',
          message: `Um ou mais arquivos excedem o tamanho máximo de ${maxSize} KB.`,
        });
        return;
      }

      const alreadyCount = value.length;
      const remainingSlots = maxFiles - alreadyCount;

      if (remainingSlots <= 0) {
        onError?.({
          type: 'count',
          message: `Você já atingiu o limite de ${maxFiles} arquivos.`,
        });
        return;
      }

      const accepted = newFiles.slice(0, remainingSlots);
      onValueChange?.([...value, ...accepted]);
    } catch (err: unknown) {
      onError?.({
        type: 'type',
        message: 'Não foi possível carregar o(s) arquivo(s).',
      });
    } finally {
      setLoading(false);
    }
  }, [uploadAcceptedTypes, maxFiles, maxSize, onValueChange, onError, value, isDisabled, setLoading]);

  const Component = asChild ? Slot.Pressable : Pressable;
  return <Component disabled={isDisabled} onPress={handlePress} role="button" {...props} />;
};

async function requestCameraPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Permissão para usar a câmera',
      message: 'Precisamos de acesso à sua câmera para tirar fotos.',
      buttonPositive: 'Permitir',
      buttonNegative: 'Negar',
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
}

type CameraTriggerProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const CameraTrigger = ({ asChild, disabled, ...props }: CameraTriggerProps) => {
  const {
    onValueChange,
    disabled: rootDisabled,
    maxSize,
    maxFiles,
    onError,
    value,
    isMaxFilesReached,
    mediaQuality,
    mediaType,
    cameraType,
    durationLimit,
    imageMaxHeight,
    imageMaxWidth,
    setLoading,
    loading,
  } = useRootContext();
  const isDisabled = rootDisabled || disabled || isMaxFilesReached || loading;

  const handlePress = React.useCallback(async () => {
    if (isDisabled) return;
    setLoading(true);
    try {
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        onError?.({
          type: 'permission',
          message: `Permissão negada! Ative a câmera nas configurações.`,
        });
        return;
      }

      const result = await launchCamera({
        mediaType: mediaType,
        quality: mediaQuality,
        cameraType: cameraType,
        durationLimit: durationLimit,
        maxHeight: imageMaxHeight,
        maxWidth: imageMaxWidth,
      });

      if (!result.assets || result.assets.length === 0) {
        return;
      }

      const newFiles = result.assets.map((file) => {
        const name = file.fileName?.trim() || `file-${uuid()}`;
        const type = file.type || '';
        const uri = file.uri ?? '';
        const size = file.fileSize ?? 0;
        return { name, type, uri, size };
      });

      if (maxSize && newFiles.some((f) => f.size > maxSize * 1024)) {
        onError?.({
          type: 'size',
          message: `Um ou mais arquivos excedem o tamanho máximo de ${maxSize} KB.`,
        });
        return;
      }

      const alreadyCount = value.length;
      const remainingSlots = maxFiles - alreadyCount;

      if (remainingSlots <= 0) {
        onError?.({
          type: 'count',
          message: `Você já atingiu o limite de ${maxFiles} arquivos.`,
        });
        return;
      }

      const accepted = newFiles.slice(0, remainingSlots);
      onValueChange?.([...value, ...accepted]);
    } catch (err: unknown) {
      onError?.({
        type: 'type',
        message: 'Não foi possível carregar o(s) arquivo(s).',
      });
    } finally {
      setLoading(false);
    }
  }, [
    isDisabled,
    mediaType,
    mediaQuality,
    cameraType,
    durationLimit,
    imageMaxHeight,
    imageMaxWidth,
    maxSize,
    value,
    maxFiles,
    onValueChange,
    onError,
    setLoading,
  ]);

  const Component = asChild ? Slot.Pressable : Pressable;
  return <Component disabled={isDisabled} onPress={handlePress} role="button" {...props} />;
};

const ItemContext = React.createContext<{
  index: number;
  disabled?: boolean;
} | null>(null);

type ItemProps = React.ComponentPropsWithRef<typeof View> & {
  index: number;
  disabled?: boolean;
};

function useItemContext() {
  const context = React.useContext(ItemContext);
  if (!context) {
    throw new Error('Item compound components cannot be rendered outside of an Item component');
  }
  return context;
}

const Item = ({ index, disabled, ...props }: ItemProps) => {
  const { disabled: disabledRoot } = useRootContext();
  const isDisabled = disabledRoot || disabled;

  return (
    <ItemContext.Provider value={{ index, disabled: isDisabled }}>
      <View {...props} />
    </ItemContext.Provider>
  );
};

type ItemRemoveProps = ComponentPropsWithAsChild<typeof Slot.Pressable>;

const ItemRemove = ({ asChild, disabled, ...props }: ItemRemoveProps) => {
  const { onValueChange, value } = useRootContext();
  const { index, disabled: disabledItem } = useItemContext();
  const isDisabled = disabledItem || disabled;

  const onPress = React.useCallback(() => {
    onValueChange?.(value.filter((_, arrayIndex) => arrayIndex !== index));
  }, [index, onValueChange, value]);

  const Component = asChild ? Slot.Pressable : Pressable;
  return <Component onPress={onPress} disabled={isDisabled} {...props} />;
};

export { Root, Trigger, CameraTrigger, Item, Value, ItemRemove, useRootContext, useItemContext };
