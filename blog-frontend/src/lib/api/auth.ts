import client from './client';

// 로그인
export const login = ({username, password} : UserInfo) =>
    client.post('/api/auth/login', {username, password});

// 회원가입
export const register = ({username, password} : UserInfo) =>
    client.post('/api/auth/register', {username, password});

// 로그인 상태 확인
export async function check (context: unknown) {
    const response = await client.get<UserInfo>('/api/auth/check');
    return response.data;
} 

// 로그아웃
export const logout = () => client.post('/api/auth/logout');

export interface UserInfo {
    username : string
    password : string
}