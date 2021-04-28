import { createReducer } from 'typesafe-actions';
import {UserState, UserAction} from './types'
import { TEMP_SET_USER, CHECK_SUCCESS, CHECK_FAILURE, LOGOUT } from './actions';

const initialState: UserState = {
  user: null,
  checkError: null,
};

const reducer = createReducer<UserState, UserAction>(initialState, {
  [TEMP_SET_USER]: (state, { payload: user }) => ({
    ...state,
    user,
  }),
  [CHECK_SUCCESS]: (state, { payload: user }) => ({
    ...state,
    user,
    checkError: null,
  }),
  [CHECK_FAILURE]: (state, { payload: error }) => ({
    ...state,
    user: null,
    checkError: error,
  }),
  [LOGOUT]: (state) => ({
    ...state,
    user: null,
  }),
});

export default reducer;
