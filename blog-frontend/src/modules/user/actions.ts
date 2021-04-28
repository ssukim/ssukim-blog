import { createAction, createAsyncAction } from 'typesafe-actions';
import { UserInfo } from '../../lib/api/auth';
import { AxiosError } from 'axios';

export const CHECK = 'user/CHECK';
export const CHECK_SUCCESS = 'user/CHECK_SUCCESS';
export const CHECK_FAILURE = 'user/CHECK_FAILURE';
export const LOGOUT = 'user/LOGOUT';
export const TEMP_SET_USER = 'user/TEMP_SET_USER'; // 새로고침 이후 임시 로그인 처리

export const getCheckStateAsync = createAsyncAction(
  CHECK,
  CHECK_SUCCESS,
  CHECK_FAILURE,
)<string, UserInfo, AxiosError>();

export const logout = createAction(LOGOUT)();
export const tempSetUser = createAction(TEMP_SET_USER)<string>();