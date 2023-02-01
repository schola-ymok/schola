import { createContext, Dispatch, useReducer } from 'react';

import { Action } from './action';
import { reducer } from './reducer';

export interface Store {
  isLoggedin: boolean;
  userId: string;
  displayName: string;
  accountName: string;
  banned: boolean;
  photoId: string;
  emailVerified: boolean;
  email: string;
  logTagID: String;
}

const initialState: Store = {
  isLoggedin: false,
  userId: null,
  displayName: null,
  accountName: null,
  photoId: null,
  emailVerified: false,
  banned: false,
  logTagID: Math.random().toString(32).substring(2),
};

const initState = (initialState) => {
  return initialState;
};

export const AppContext = createContext(
  {} as {
    state: Store;
    dispatch: Dispatch<Action>;
  },
);

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, initState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
