import { AnyAction, combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { roomsReducer } from './slices/roomsSlice';
import { userReducer } from './slices/userSlice';
import { RootState } from './types';

export const rootReducer = combineReducers({
  rooms: roomsReducer,
  user: userReducer,
});

const store = (): Store<RootState, AnyAction> =>
  configureStore({
    reducer: rootReducer,
  });

export const wrapper = createWrapper(store, { debug: true });
