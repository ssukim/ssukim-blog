import { ActionType, createAction, createReducer } from 'typesafe-actions';

const INITIALIZE = 'write/INITIALIZE';
const CHANGE_FIELD = 'write/CHANGE_FIELD';

export const initialize = createAction(INITIALIZE)();
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}))();

const actions = { initialize, changeField };
type WriteAction = ActionType<typeof actions>;

type WriteState = {
  title: string;
  body: string;
  tags: string[];
};

const initialState: WriteState = {
  title: '',
  body: '',
  tags: [],
};

const write = createReducer<WriteState, WriteAction>(initialState, {
  [INITIALIZE]: (state) => initialState,
  [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
    ...state,
    [key]: value,
  }),
});

export default write;
