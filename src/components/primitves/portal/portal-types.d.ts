type PortalItem = {
  key: string;
  node: React.ReactNode;
};

type Action =
  | { type: 'ADD'; host: string; key: string; node: React.ReactNode }
  | { type: 'UPDATE'; host: string; key: string; node: React.ReactNode }
  | { type: 'REMOVE'; host: string; key: string };

export { Action, PortalItem };
