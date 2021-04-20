import {
  createAction,
  createAsyncAction,
  createReducer,
  ActionType,
} from 'typesafe-actions';
import { takeLatest, call } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';

const TEMP_SET_USER = 'user/TEMP_SET_USER'; // 새로고침 이후 임시 로그인 처리
// 회원 정보 확인
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes(
  'user/CHECK',
);
const LOGOUT = 'user/LOGOUT';

export const tempSetUser = createAction(TEMP_SET_USER)<string>();
export const check = createAction(CHECK)<any>();
export const logout = createAction(LOGOUT)<any>();

// const testAsync = createAsyncAction(
//     TEMP_SET_USER,
//     CHECK,
//     LOGOUT
// )<any, any, any>();

const actions = { tempSetUser, check, logout };
type UserAction = ActionType<typeof actions>;

const checkSaga = createRequestSaga(CHECK, authAPI.check);

function checkFailureSaga() {
  try {
    localStorage.removeItem('user'); // localStorage에서 user를 제거
  } catch (e) {
    console.log('localStorage is not working');
  }
}

function* logoutSaga() {
  try {
    yield call(authAPI.logout); // logout API 호출
    localStorage.removeItem('user'); // localStorage에서 user를 제거
  } catch (e) {
    console.log(e);
  }
}

export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
  yield takeLatest(CHECK_FAILURE, checkFailureSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}

type UserState = {
  user: any;
  checkError: any;
};
const initialState: UserState = {
  user: null,
  checkError: null,
};


const user = createReducer<UserState, UserAction>(initialState, {
    [TEMP_SET_USER]: (state, {payload: user}) => ({
        ...state,
        user
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
})


// export default createReducer<UserState, UserAction>(
//   initialState,
//   {
//     [TEMP_SET_USER]: (state, { payload: user }) => ({
//       ...state,
//       user,
//     }),
//     [CHECK_SUCCESS]: (state, { payload: user }) => ({
//       ...state,
//       user,
//       checkError: null,
//     }),
//     [CHECK_FAILURE]: (state, { payload: error }) => ({
//       ...state,
//       user: null,
//       checkError: error,
//     }),
//     [LOGOUT]: (state) => ({
//       ...state,
//       user: null,
//     }),
//   }
// );

export default user;
