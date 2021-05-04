import {
  createAction,
  createReducer,
  ActionType,
  createAsyncAction,
} from 'typesafe-actions';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as authAPI from '../../lib/api/auth';
import { UserInfo } from '../../lib/api/auth';
import { AxiosError } from 'axios';
import { finishLoading, startLoading } from '../loading/loading';

//액션타입
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const REGISTER = 'auth/REGISTER';
const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
const REGISTER_FAILURE = 'auth/REGISTER_FAILURE';

const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

//액션생성함수
export const registerAsync = createAsyncAction(
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
)<UserInfo, UserInfo, AxiosError>();

export const loginAsync = createAsyncAction(
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
)<UserInfo, UserInfo, AxiosError>();
export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({
    form, // register , login
    key, // username, password, passwordConfirm
    value, // 실제 바꾸려는 값
  }),
)();
export const initializeForm = createAction(INITIALIZE_FORM)(); // register / login

const actions = { registerAsync, loginAsync, changeField, initializeForm };
type AuthAction = ActionType<typeof actions>;

// saga 생성
function* registerSaga(action: ReturnType<typeof registerAsync.request>) {
  yield put (startLoading(REGISTER));
  try {
    const response: UserInfo = yield call(authAPI.register, action.payload);
    yield put(registerAsync.success(response));
  } catch (e) {
    yield put(registerAsync.failure(e));
  }
  yield put (finishLoading(REGISTER));
}

function* loginSaga(action: ReturnType<typeof loginAsync.request>) {
  yield put (startLoading(LOGIN));
  try {
    const response: UserInfo = yield call(authAPI.login, action.payload);
    yield put(loginAsync.success(response));
  } catch (e) {
    yield put(loginAsync.failure(e));
  }
  yield put (finishLoading(LOGIN));
}

export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

//초기화
type AuthState = {
  register: UserInfo;
  login: UserInfo;
  auth: UserInfo | null;
  authError: Error | null;
  form: string;
};

const initialState: AuthState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: '',
  },
  login: {
    username: '',
    password: '',
  },
  auth: null,
  authError: null,
  form: '',
};

//리듀서 생성
const auth = createReducer<AuthState, AuthAction>(initialState, {
  [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
    produce(state, (draft: any) => {
      draft[form][key] = value; // 예: state.register.username을 바꾼다
    }),
  [INITIALIZE_FORM]: (state) => ({
    ...state,
    register: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    login: {
      username: '',
      password: '',
    },
    authError: null, // 폼 전환 시 회원 인증 에러 초기화
  }),
  // 회원가입 성공
  [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
    ...state,
    authError: null,
    auth,
  }),
  // 회원가입 실패
  [REGISTER_FAILURE]: (state, { payload: error }) => ({
    ...state,
    authError: error,
  }),
  // 로그인 성공
  [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
    ...state,
    authError: null,
    auth,
  }),
  // 로그인 실패
  [LOGIN_FAILURE]: (state, { payload: error }) => ({
    ...state,
    authError: error,
  }),
});

export default auth;
