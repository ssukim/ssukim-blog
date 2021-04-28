import { ActionType } from 'typesafe-actions';
import { UserInfo } from '../../lib/api/auth';
import * as actions from './actions';

export type UserAction = ActionType<typeof actions>;

export type UserState = {
  user: UserInfo | string | null;
  checkError: Error | null;
};
