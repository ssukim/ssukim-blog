import {
  ActionType,
  createAction,
  createAsyncAction,
  createReducer,
} from 'typesafe-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import * as authAPI from '../../lib/api/auth';
import { UserInfo } from '../../lib/api/auth';
import { finishLoading, startLoading } from '../loading/loading';

const CHECK = 'user/CHECK';
const CHECK_SUCCESS = 'user/CHECK_SUCCESS';
const CHECK_FAILURE = 'user/CHECK_FAILURE';
const LOGOUT = 'user/LOGOUT';
const TEMP_SET_USER = 'user/TEMP_SET_USER'; // 새로고침 이후 임시 로그인 처리

export const checkAsync = createAsyncAction(
  CHECK,
  CHECK_SUCCESS,
  CHECK_FAILURE,
)<string, UserInfo, AxiosError>();

export const logout = createAction(LOGOUT)();
export const tempSetUser = createAction(TEMP_SET_USER)<string | null>();

const actions = { checkAsync, logout, tempSetUser };
type UserAction = ActionType<typeof actions>;

//saga 생성
function* checkSaga(action: ReturnType<typeof checkAsync.request>) {
  yield put(startLoading(CHECK)); // 로딩 시작
  try {
    const response: UserInfo = yield call(authAPI.check, action.payload);
    yield put(checkAsync.success(response));
  } catch (error) {
    yield put(checkAsync.failure(error as any));
  }
  yield put(finishLoading(CHECK)); // 로딩 시작
}

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

//리듀서 초기화
type UserState = {
  user: UserInfo | null;
  tempUser: string | null;
  checkError: Error | null;
};

const initialState: UserState = {
  user: null,
  tempUser: null,
  checkError: null,
};

//리듀서 정의
const reducer = createReducer<UserState, UserAction>(initialState, {
  [TEMP_SET_USER]: (state, { payload: tempUser }) => ({
    ...state,
    tempUser,
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
