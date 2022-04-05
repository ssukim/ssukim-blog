import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../modules';
import Header from '../../components/common/Header';
import { logout } from '../../modules/user';

const HeaderContainer = () => {
  const { user } = useSelector((state: RootState) => ({
    user: state.user.user,
  }));
  // console.log(user);

  const dispatch = useDispatch();
  const onLogout = () => {
    console.log(
      '🚀 ~ file: HeaderContainer.tsx ~ line 17 ~ onLogout ~ onLogout',
      onLogout,
    );
    dispatch(logout());
  };
  return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;
