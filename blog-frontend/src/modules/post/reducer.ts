import { call, put, takeEvery } from '@redux-saga/core/effects';
import { AxiosError } from 'axios';
import {
  ActionType,
  createAction,
  createAsyncAction,
  createReducer,
} from 'typesafe-actions';
import { readPost, ReadPostInfo } from '../../lib/api/posts';
import { finishLoading, startLoading } from '../loading/loading';

const READ_POST = 'post/READ_POST';
const READ_POST_SUCCESS = 'post/READ_POST_SUCCESS';
const READ_POST_FAILURE = 'post/READ_POST_FAILURE';
const UNLOAD_POST = 'post/UNLOAD_POST'; // 포스트 페이지에서 벗어날 때 데이터 비우기

export const readPostAsync = createAsyncAction(
  READ_POST,
  READ_POST_SUCCESS,
  READ_POST_FAILURE,
)<string, ReadPostInfo, AxiosError>();
export const unloadPost = createAction(UNLOAD_POST)();

const actions = { readPostAsync, unloadPost };
type ReadAction = ActionType<typeof actions>;

function* readPostSaga(action: ReturnType<typeof readPostAsync.request>) {
  yield put(startLoading(READ_POST)); // 로딩 시작
  try {
    const response: ReadPostInfo = yield call(readPost, action.payload);
    yield put(readPostAsync.success(response));
  } catch (e) {
    yield put(readPostAsync.failure(e));
  }
  yield put(finishLoading(READ_POST)); // 로딩 끝
}
export function* postSaga() {
  yield takeEvery(READ_POST, readPostSaga);
}

type ReadState = {
  post: ReadPostInfo | null;
  readError: Error | null;
  loading: boolean;
};

const initialState: ReadState = {
  post: null,
  readError: null,
  loading: false,
};

const post = createReducer<ReadState, ReadAction>(initialState, {
  [READ_POST]: state => ({
    ...state,
    loading:true
  }),
  [READ_POST_SUCCESS]: (state, { payload: post }) => ({
    ...state,
    post,
    loading: false,
  }),
  [READ_POST_FAILURE]: (state, { payload: error}) => ({
      ...state,
      error,
      loading: false,
  }),
  [UNLOAD_POST]: () => initialState,
});

export default post;
