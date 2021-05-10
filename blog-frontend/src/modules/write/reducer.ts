import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import {
  ActionType,
  createAction,
  createAsyncAction,
  createReducer,
} from 'typesafe-actions';
import { WritePostInfo, writePost } from '../../lib/api/posts';
import { finishLoading, startLoading } from '../loading/loading';

const INITIALIZE = 'write/INITIALIZE';
const CHANGE_FIELD = 'write/CHANGE_FIELD';
const WRITE_POST = 'write/WRITE_POST';
const WRITE_POST_SUCCESS = 'write/WRITE_POST_SUCCESS';
const WRITE_POST_FAILURE = 'write/WRITE_POST_FAILURE';

export const initialize = createAction(INITIALIZE)();
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}))();
export const writeAsync = createAsyncAction(
  WRITE_POST,
  WRITE_POST_SUCCESS,
  WRITE_POST_FAILURE,
)<WritePostInfo, WritePostInfo, AxiosError>();

const actions = { initialize, changeField, writeAsync };
type WriteAction = ActionType<typeof actions>;

//saga 생성
function* writePostSaga(action: ReturnType<typeof writeAsync.request>) {
  yield put(startLoading(WRITE_POST)); // 로딩 시작
  try {
    const response: WritePostInfo = yield call(writePost, action.payload);
    yield put(writeAsync.success(response));
  } catch (e) {
    yield put(writeAsync.failure(e));
  }
  yield put(finishLoading(WRITE_POST)); // 로딩 끝
}
export function* writeSaga() {
  yield takeLatest(WRITE_POST, writePostSaga);
}

type WriteState = {
  title: string;
  body: string;
  tags: string[];
  post: WritePostInfo | null;
  postError: Error | null;
};

const initialState: WriteState = {
  title: '',
  body: '',
  tags: [],
  post: null,
  postError: null,
};

const write = createReducer<WriteState, WriteAction>(initialState, {
  [INITIALIZE]: (state) => initialState,
  [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
    ...state,
    [key]: value,
  }),
  [WRITE_POST]: (state) => ({
    ...state,
    // post, postError 초기화
    post:null,
    postError:null
  }),
  [WRITE_POST_SUCCESS]: (state, {payload: post}) => ({
    ...state,
    post
  }),
  [WRITE_POST_FAILURE]: (state, {payload: postError}) => ({
    ...state,
    postError
  })
});

export default write;
