import React, { useReducer, memo } from 'react';
import { PortalHost } from './portal-host';
import { reducer } from './portal-reducer';
import { Action, PortalItem } from './portal-types';

type State = Record<string, PortalItem[]>;

const PortalStateContext = React.createContext<State>({});
const PortalDispatchContext = React.createContext<React.Dispatch<Action>>(() => null);

type Props = {
  children: React.ReactNode;
};

const PortalProvider = memo(({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <PortalDispatchContext.Provider value={dispatch}>
      <PortalStateContext.Provider value={state}>
        {children}
        <PortalHost name="root" />
      </PortalStateContext.Provider>
    </PortalDispatchContext.Provider>
  );
});

PortalProvider.displayName = 'PortalProvider';

export { PortalProvider, PortalStateContext, PortalDispatchContext };
