import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AxiosError } from 'axios';
import { ActionType, createAsyncAction, createReducer } from 'typesafe-actions';
import { ListPostInfo, listPosts, ReadPostInfo } from '../../lib/api/posts';
import { finishLoading, startLoading } from '../loading/loading';

let g_lastPage: number = 0;

const LIST_POSTS = 'posts/LIST_POSTS';
const LIST_POSTS_SUCCESS = 'posts/LIST_POSTS_SUCCESS';
const LIST_POSTS_FAILURE = 'posts/LIST_POSTS_FAILURE';

export const listPostsAsync = createAsyncAction(
  LIST_POSTS,
  LIST_POSTS_SUCCESS,
  LIST_POSTS_FAILURE,
)<ListPostInfo, ReadPostInfo[], AxiosError>();

const actions = { listPostsAsync };
type ListAction = ActionType<typeof actions>;

function* listPostsSaga(action: ReturnType<typeof listPostsAsync.request>) {
  yield put(startLoading(LIST_POSTS));
  try {
    const response: {
      data: ReadPostInfo[];
      headers: { ['last-page']: string };
    } = yield call(listPosts, action.payload);

    // console.log(response.headers['last-page']);
    // console.log(response.headers);
    g_lastPage = parseInt(response.headers['last-page'], 10);
    yield put(listPostsAsync.success(response.data));
  } catch (e) {
    yield put(listPostsAsync.failure(e as any));
  }
  yield put(finishLoading(LIST_POSTS));
}
export function* postsSaga() {
  yield takeLatest(LIST_POSTS, listPostsSaga);
}

type ListState = {
  posts: ReadPostInfo[];
  listPostsError: Error | null;
  loading: boolean;
  lastPage: number | null;
};

const initialState: ListState = {
  posts: [],
  listPostsError: null,
  loading: false,
  lastPage: null,
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
    lastPage: g_lastPage,
  }),
  [LIST_POSTS_FAILURE]: (state, { payload: error }) => ({
    ...state,
    error,
    loading: false,
  }),
});

export default posts;
