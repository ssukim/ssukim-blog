import client from './client';

// 로그인
export async function login({ username, password }: UserInfo) {
  const response = await client.post('/api/auth/login', { username, password });
  return response.data;
}

// 회원가입
export async function register({ username, password }: UserInfo) {
  const response = await client.post('/api/auth/register', {
    username,
    password,
  });
  return response.data;
}

// 로그인 상태 확인
export async function check(context: unknown) {
  const response = await client.get('/api/auth/check');
  // console.log(response)
  return response.data;
}

// 로그아웃
export const logout = () => client.post('/api/auth/logout');

export interface UserInfo {
  username: string;
  password: string;
  passwordConfirm?: string;
}
