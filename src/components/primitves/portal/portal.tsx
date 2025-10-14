import { memo, useContext, useEffect, useMemo, useRef, ReactNode, useCallback } from 'react';
import { PortalDispatchContext } from './portal-provider';
import { uuid } from '@/functions/uuid';

type Props = {
  name?: string;
  hostName?: string;
  children: ReactNode;
};

const Portal = memo(({ name: providedName, hostName = 'root', children }: Props) => {
  const dispatch = useContext(PortalDispatchContext);
  const name = useMemo(() => providedName || uuid(), [providedName]);

  const onMountRef = useRef<() => void>(null);
  const onUnmountRef = useRef<() => void>(null);
  const onUpdateRef = useRef<() => void>(null);

  const onMount = useCallback(() => {
    dispatch({ type: 'ADD', host: hostName, key: name, node: children });
  }, [dispatch, hostName, name, children]);

  const onUnmount = useCallback(() => {
    dispatch({ type: 'REMOVE', host: hostName, key: name });
  }, [dispatch, hostName, name]);

  const onUpdate = useCallback(() => {
    dispatch({ type: 'UPDATE', host: hostName, key: name, node: children });
  }, [dispatch, hostName, name, children]);

  onMountRef.current = onMount;
  onUnmountRef.current = onUnmount;
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    onMountRef.current?.();
    return () => {
      onUnmountRef.current?.();
      onMountRef.current = null;
      onUnmountRef.current = null;
      onUpdateRef.current = null;
    };
  }, []);

  useEffect(() => {
    onUpdateRef.current?.();
  }, [children]);

  return null;
});

Portal.displayName = 'Portal';

export { Portal };
