import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '../modules/loading/loading';

type response = {
  data: string;
};

export const createRequestActionTypes = (type: string) => {
  // console.log('createRequestActionTypes type: '+type);
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

export default function createRequestSaga(type: string, request: any) {
  // console.log('createRequestSaga type: '+type);
  // console.log('createRequestSaga request: ' + request);
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action: any) {
    yield put(startLoading(type)); // 로딩 시작
    try {
      // console.log('response: '+JSON.stringify(action.payload));
      const response: response = yield call(request, action.payload);
      yield put({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    yield put(finishLoading(type)); // 로딩 끝
  };
}
