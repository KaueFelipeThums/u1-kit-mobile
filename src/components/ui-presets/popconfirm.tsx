import { createContext, ReactElement, ReactNode, useCallback, useContext, useState } from 'react';
import { AlertDialog } from './alert-dialog';

type ConfirmStateProps = Pick<
  React.ComponentProps<typeof AlertDialog>,
  | 'onConfirm'
  | 'onCancel'
  | 'title'
  | 'description'
  | 'cancelText'
  | 'confirmText'
  | 'variant'
  | 'hideCancelButton'
  | 'onOpenChange'
> & {
  isOpen?: boolean;
};

type PopConfirmProviderProps = {
  children: ReactNode;
};

type PopConfirmProviderType = {
  open: (config: Omit<ConfirmStateProps, 'isOpen'>) => void;
};

const PopConfirmContext = createContext<PopConfirmProviderType>({
  open: () => {},
});

const defaultValues: ConfirmStateProps = {
  isOpen: false,
  onConfirm: () => {},
  onCancel: () => {},
  onOpenChange: () => {},
  title: '',
  description: undefined,
  cancelText: 'Cancelar',
  confirmText: 'Sim',
  hideCancelButton: false,
  variant: 'default',
};

const PopConfirmProvider = ({ children }: PopConfirmProviderProps): ReactElement => {
  const [confirmState, setConfirmState] = useState<ConfirmStateProps>(defaultValues);

  const open = useCallback((config: Omit<ConfirmStateProps, 'isOpen'>) => {
    setConfirmState({
      ...defaultValues,
      isOpen: true,
      ...config,
    });
  }, []);

  const close = useCallback(() => {
    setConfirmState((state) => ({ ...state, isOpen: false }));
  }, []);

  const handleCancel = useCallback(() => {
    confirmState.onCancel?.();
    close();
  }, [confirmState, close]);

  const handleConfirm = useCallback(() => {
    confirmState.onConfirm?.();
    close();
  }, [confirmState, close]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      confirmState.onOpenChange?.(open);
      if (!open) close();
    },
    [confirmState, close],
  );

  return (
    <PopConfirmContext.Provider value={{ open }}>
      <AlertDialog
        open={confirmState.isOpen}
        title={confirmState.title ?? ''}
        description={confirmState.description}
        onOpenChange={onOpenChange}
        cancelText={confirmState.cancelText}
        confirmText={confirmState.confirmText}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        variant={confirmState.variant}
        hideCancelButton={confirmState.hideCancelButton}
      />
      {children}
    </PopConfirmContext.Provider>
  );
};

const usePopConfirm = () => {
  const context = useContext(PopConfirmContext);
  if (!context) {
    throw new Error('usePopConfirm must be used within a PopConfirmProvider');
  }
  return context;
};

export type { PopConfirmProviderType };
export { usePopConfirm };
export default PopConfirmProvider;
