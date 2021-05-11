import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AxiosError } from 'axios';
import { ActionType, createAsyncAction, createReducer } from 'typesafe-actions';
import { ListPostInfo, listPosts, ReadPostInfo } from '../../lib/api/posts';
import { finishLoading, startLoading } from '../loading/loading';

const LIST_POSTS = 'posts/LIST_POSTS';
const LIST_POSTS_SUCCESS = 'posts/LIST_POSTS_SUCCESS';
const LIST_POSTS_FAILURE = 'posts/LIST_POSTS_FAILURE';

export const listPostsAsync = createAsyncAction(
  LIST_POSTS,
  LIST_POSTS_SUCCESS,
  LIST_POSTS_FAILURE,
)<ListPostInfo, Array<ReadPostInfo>, AxiosError>();

const actions = { listPostsAsync };
type ListAction = ActionType<typeof actions>;

function* listPostsSaga(action: ReturnType<typeof listPostsAsync.request>) {
  yield put(startLoading(LIST_POSTS));
  try {
    const response: Array<ReadPostInfo> = yield call(listPosts, action.payload);
    yield put(listPostsAsync.success(response));
  } catch (e) {
    yield put(listPostsAsync.failure(e));
  }
  yield put(finishLoading(LIST_POSTS));
}
export function* postsSaga() {
  yield takeLatest(LIST_POSTS, listPostsSaga);
}

type ListState = {
  posts: Array<ReadPostInfo>;
  listPostsError: Error | null;
  loading: boolean;
};

const initialState: ListState = {
  posts: [],
  listPostsError: null,
  loading: false,
};

const posts = createReducer<ListState, ListAction>(initialState, {
  [LIST_POSTS]: (state) => ({
    ...state,
    loading: true,
  }),
  [LIST_POSTS_SUCCESS]: (state, { payload: posts }) => ({
    ...state,
    posts,
    loading: false,
  }),
  [LIST_POSTS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
      loading: false,
  }),
});

export default posts;
