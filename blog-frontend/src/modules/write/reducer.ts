import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosError } from 'axios';
import {
  ActionType,
  createAction,
  createAsyncAction,
  createReducer,
} from 'typesafe-actions';
import { WritePostInfo, writePost, updatePost } from '../../lib/api/posts';
import { finishLoading, startLoading } from '../loading/loading';

const INITIALIZE = 'write/INITIALIZE';
const CHANGE_FIELD = 'write/CHANGE_FIELD';
const WRITE_POST = 'write/WRITE_POST';
const WRITE_POST_SUCCESS = 'write/WRITE_POST_SUCCESS';
const WRITE_POST_FAILURE = 'write/WRITE_POST_FAILURE';
const UPDATE_POST = 'write/UPDATE_POST';
const UPDATE_POST_SUCCESS = 'write/UPDATE_POST_SUCCESS';
const UPDATE_POST_FAILURE = 'write/UPDATE_POST_FAILURE';
const SET_ORIGINAL_POST = 'write/SET_ORIGINAL_POST';

export const initialize = createAction(INITIALIZE)();
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}))();
export const setOriginalPost = createAction(
  SET_ORIGINAL_POST,
  (post) => post,
)();
export const writeAsync = createAsyncAction(
  WRITE_POST,
  WRITE_POST_SUCCESS,
  WRITE_POST_FAILURE,
)<WritePostInfo, WritePostInfo, AxiosError>();
export const updateAsync = createAsyncAction(
  UPDATE_POST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
)<WritePostInfo, WritePostInfo, AxiosError>();

const actions = {
  initialize,
  changeField,
  setOriginalPost,
  writeAsync,
  updateAsync,
};
type WriteAction = ActionType<typeof actions>;

//saga 생성
function* writePostSaga(action: ReturnType<typeof writeAsync.request>) {
  yield put(startLoading(WRITE_POST)); // 로딩 시작
  try {
    const response: WritePostInfo = yield call(writePost, action.payload);
    yield put(writeAsync.success(response));
  } catch (e) {
    yield put(writeAsync.failure(e as any));
  }
  yield put(finishLoading(WRITE_POST)); // 로딩 끝
}

function* updatePostSaga(action: ReturnType<typeof updateAsync.request>) {
  yield put(startLoading(UPDATE_POST)); // 로딩 시작
  try {
    const response: WritePostInfo = yield call(updatePost, action.payload);
    yield put(updateAsync.success(response));
  } catch (e) {
    yield put(updateAsync.failure(e as any));
  }
  yield put(finishLoading(UPDATE_POST)); // 로딩 끝
}

export function* writeSaga() {
  yield takeLatest(WRITE_POST, writePostSaga);
  yield takeLatest(UPDATE_POST, updatePostSaga);
}

type WriteState = {
  title: string;
  body: string;
  tags: string[];
  post: WritePostInfo | null;
  postError: Error | null;
  originalPostId: string | null;
};

const initialState: WriteState = {
  title: '',
  body: '',
  tags: [],
  post: null,
  postError: null,
  originalPostId: null,
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
    post: null,
    postError: null,
  }),
  [WRITE_POST_SUCCESS]: (state, { payload: post }) => ({
    ...state,
    post,
  }),
  [WRITE_POST_FAILURE]: (state, { payload: postError }) => ({
    ...state,
    postError,
  }),
  [SET_ORIGINAL_POST]: (state, { payload: post }) => ({
    ...state,
    title: post.title,
    body: post.body,
    tags: post.tags,
    originalPostId: post._id,
  }),
  [UPDATE_POST_SUCCESS]: (state, { payload: post }) => ({
    ...state,
    post,
  }),
  [UPDATE_POST_FAILURE]: (state, { payload: postError }) => ({
    ...state,
    postError,
  }),
});

export default write;
