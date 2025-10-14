import React, { memo, useContext } from 'react';
import { PortalStateContext } from './portal-provider';

type Props = {
  name: string;
};

const PortalHost = memo(({ name }: Props) => {
  const state = useContext(PortalStateContext);
  const portals = state[name] || [];

  return (
    <>
      {portals.map(({ key, node }) => (
        <React.Fragment key={key}>{node}</React.Fragment>
      ))}
    </>
  );
});

PortalHost.displayName = 'PortalHost';

export { PortalHost };
