import * as React from 'react';
import { uuid } from '@/functions/uuid';

const MAX_TOASTS = 3;

export type ItemOptions = {
  duration?: number;
};

export type Item = {
  id: string;
  title: string;
  description?: string;
  options?: ItemOptions;
  type: 'success' | 'error' | 'warning' | 'info';
};

export type ToastContextType = {
  show: (toast: Omit<Item, 'id'>) => void;
  success: (toast: Omit<Item, 'id' | 'type'>) => void;
  error: (toast: Omit<Item, 'id' | 'type'>) => void;
  warning: (toast: Omit<Item, 'id' | 'type'>) => void;
  info: (toast: Omit<Item, 'id' | 'type'>) => void;
  dismiss: (id: string) => void;
};

const ListContext = React.createContext<{ toasts: Item[] } | null>(null);

let toastRef: ToastContextType | null = null;

export const setToastRef = (ref: ToastContextType | null) => {
  toastRef = ref;
};

const toastPrimitive = {
  show: (args: Omit<Item, 'id'>) => toastRef?.show(args),
  success: (args: Omit<Item, 'id' | 'type'>) => toastRef?.success(args),
  error: (args: Omit<Item, 'id' | 'type'>) => toastRef?.error(args),
  warning: (args: Omit<Item, 'id' | 'type'>) => toastRef?.warning(args),
  info: (args: Omit<Item, 'id' | 'type'>) => toastRef?.info(args),
  dismiss: (id: string) => toastRef?.dismiss(id),
};

const Root = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Item[]>([]);

  const show = React.useCallback((toast: Omit<Item, 'id'>) => {
    const id = `toast-${uuid()}`;
    setToasts((prev) => [...prev.slice(-(MAX_TOASTS - 1)), { id, ...toast }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const success = React.useCallback((toast: Omit<Item, 'id' | 'type'>) => show({ ...toast, type: 'success' }), [show]);
  const error = React.useCallback((toast: Omit<Item, 'id' | 'type'>) => show({ ...toast, type: 'error' }), [show]);
  const warning = React.useCallback((toast: Omit<Item, 'id' | 'type'>) => show({ ...toast, type: 'warning' }), [show]);
  const info = React.useCallback((toast: Omit<Item, 'id' | 'type'>) => show({ ...toast, type: 'info' }), [show]);

  React.useEffect(() => {
    setToastRef({ show, dismiss, success, error, warning, info });
    return () => setToastRef(null);
  }, [show, dismiss, success, error, warning, info]);

  return <ListContext.Provider value={{ toasts }}>{children}</ListContext.Provider>;
};

const useListContext = () => {
  const context = React.useContext(ListContext);
  if (!context) throw new Error('useListContext must be used within a ListContext.');
  return context;
};

export { Root, useListContext, toastPrimitive };
