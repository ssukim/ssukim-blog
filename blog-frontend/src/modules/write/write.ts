import { ActionType, createAction } from 'typesafe-actions';

const INITIALIZE = 'write/INITIALIZE';
const CHANGE_FIELD = 'write/CHANGE_FIELD';

export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));

const actions = { initialize, changeField };
type WriteAction = ActionType<typeof actions>

type WriteState = {

}