import {
  createAction,
  createReducer,
  ActionType,
} from 'typesafe-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../../lib/createRequestSaga';
import * as authAPI from '../../lib/api/auth';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

// const REGISTER = 'auth/REGISTER';
// const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
// const REGISTER_FAILURE = 'auth/REGISTER_FAILURE';

// const LOGIN = 'auth/LOGIN';
// const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
// const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes(
  'auth/REGISTER',
);

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
  'auth/LOGIN',
);

export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({
    form, // register , login
    key, // username, password, passwordConfirm
    value, // 실제 바꾸려는 값
  }),
)();
export const initializeForm = createAction(INITIALIZE_FORM, (form) => form)(); // register / login
export const register = createAction(REGISTER, ({ username, password }) => ({
  username,
  password,
}))();
export const login = createAction(LOGIN, ({ username, password }) => ({
  username,
  password,
}))();

const actions = { changeField, initializeForm, register, login };
type AuthAction = ActionType<typeof actions>;

// saga 생성
// console.log(authAPI.register+'..'+authAPI.login);
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

type AuthState = {
  register: {
    username: string;
    password: string;
    passwordConfirm: string;
  };
  login: {
    username: string;
    password: string;
  };
  auth: string | null;
  authError: {
    response: {
      status: number;
    };
  } | null;
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
};

const auth = createReducer<AuthState, AuthAction>(initialState, {
  [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
    produce(state, (draft: any) => {
      draft[form][key] = value; // 예: state.register.username을 바꾼다
    }),
  [INITIALIZE_FORM]: (state, { payload: form }) => ({
    ...state,
    form: form,
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
