// import { createAction, handleActions } from 'redux-actions';
import { createAction, ActionType, createReducer } from 'typesafe-actions';

const START_LOADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';

/*
 요청을 위한 액션 타입을 payload로 설정합니다 (예: "sample/GET_POST")
*/
export const startLoading = createAction(START_LOADING)<string>();
export const finishLoading = createAction(FINISH_LOADING)<string>();

const actions = { startLoading, finishLoading };
type LoadingAction = ActionType<typeof actions>;

type LoadingState = {};

const initialState: LoadingState = {};

const loading = createReducer<LoadingState, LoadingAction>(initialState, {
  [START_LOADING]: (state, action) => ({
    ...state,
    [action.payload]: true,
  }),
  [FINISH_LOADING]: (state, action) => ({
    ...state,
    [action.payload]: false,
  }),
});

export default loading;
