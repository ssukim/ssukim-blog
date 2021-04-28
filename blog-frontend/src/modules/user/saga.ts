import { call, put, takeLatest } from 'redux-saga/effects';
import { check, logout, UserInfo } from '../../lib/api/auth';
import {
  LOGOUT,
  CHECK,
  CHECK_FAILURE,
  getCheckStateAsync,
} from './actions';

function* getUserCheckSaga(
  action: ReturnType<typeof getCheckStateAsync.request>,
) {
  try {
    const userProfile: UserInfo = yield call(check, action.payload);
    yield put(getCheckStateAsync.success(userProfile));
  } catch (e) {}
}

function checkFailureSaga() {
  try {
    localStorage.removeItem('user'); // localStorage에서 user를 제거
  } catch (e) {
    console.log('localStorage is not working');
  }
}

function* logoutSaga() {
  try {
    yield call(logout); // logout API 호출
    localStorage.removeItem('user'); // localStorage에서 user를 제거
  } catch (e) {
    console.log(e);
  }
}

export function* userSaga() {
  yield takeLatest(CHECK, getUserCheckSaga);
  yield takeLatest(CHECK_FAILURE, checkFailureSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
