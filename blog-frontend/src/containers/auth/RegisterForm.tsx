import React, {
    FormEvent,
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useState,
  } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { RootState } from '../../modules';
  import { changeField, initializeForm, register } from '../../modules/auth/auth';
  import AuthForm from '../../components/auth/AuthForm';
  import { getCheckStateAsync } from '../../modules/user';
  import { withRouter, RouteComponentProps } from 'react-router-dom';
  
  const RegisterForm: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const [error, setError] = useState<string>('');
    const dispatch = useDispatch();
    const { form, auth, authError, user } = useSelector((state: RootState) => ({
      form: state.auth.register,
      auth: state.auth.auth,
      authError: state.auth.authError,
      user: state.user.user,
    }));
  
    //인풋 변경 이벤트 핸들러
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;
      dispatch(
        changeField({
          form: 'register',
          key: name,
          value,
        }),
      );
    };
  
    //폼 등록 이벤트 핸들러
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { username, password, passwordConfirm } = form;
      // 하나라도 비어 있다면
      if ([username, password, passwordConfirm].includes('')) {
        setError('빈 칸을 모두 입력하세요.');
        return;
      }
      // 비밀번호가 일치하지 않는다면)
      if (password !== passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        dispatch(changeField({ form: 'register', key: 'password', value: '' }));
        dispatch(
          changeField({ form: 'register', key: 'passwordConfirm', value: '' }),
        );
        return;
      }
      dispatch(register({ username, password }));
    };
  
    //컴포넌트가 처음 렌더링될 때 form을 초기화함
    useEffect(() => {
      dispatch(initializeForm('register'));
    }, [dispatch]);
  
    // 회원가입 성공/실패 처리
    useEffect(() => {
      if (authError) {
        // 계정명이 이미 존재할 때
        if (authError.response.status === 409) {
          setError('이미 존재하는 계정명입니다.');
          return;
        }
        // 기타 이유
        setError('회원가입 실패');
        return;
      }
      if (auth) {
        console.log('회원가입 성공');
        // console.log(auth);
        dispatch(getCheckStateAsync.request(''));
      }
    }, [auth, authError, dispatch]);
  
    // user 값이 잘 성정되었는지 확인
    useEffect(() => {
      if (user) {
        console.log('check API 성공');
        console.log(user);
        history.push('/'); // 홈 화면으로 이동
        try {
          localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.log('localStorage is not working');
        }
      }
    }, [history, user]);
  
    return (
      <AuthForm
        type="register"
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
        error={error}
      />
    );
  };
  
  export default withRouter(RegisterForm);
  