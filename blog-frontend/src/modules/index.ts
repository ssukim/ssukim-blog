import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import auth, { authSaga } from './auth/auth';
import loading from './loading/loading';
import user ,{ userSaga }from './user/'

const rootReducer = combineReducers({
  auth,
  loading,
  user,
});

export default rootReducer;

// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.
export type RootState = ReturnType<typeof rootReducer>;

// 루트 사가를 만들어서 내보내주세요.
export function* rootSaga() {
  // console.log('rootSaga Call');
  yield all([authSaga(), userSaga()]);
}
