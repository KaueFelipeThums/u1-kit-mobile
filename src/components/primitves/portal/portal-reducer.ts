import { Action, PortalItem } from './portal-types';

const reducer = (state: Record<string, PortalItem[]>, action: Action) => {
  const { host, key } = action;
  const current = state[host] || [];

  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        [host]: [...current, { key, node: action.node }],
      };
    case 'UPDATE':
      return {
        ...state,
        [host]: current.map((item) => (item.key === key ? { key, node: action.node } : item)),
      };
    case 'REMOVE':
      return {
        ...state,
        [host]: current.filter((item) => item.key !== key),
      };
    default:
      return state;
  }
};

export { reducer };
