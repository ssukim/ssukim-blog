import client from './client';
import qs from 'qs';
import { UserInfo } from './auth';

export interface WritePostInfo {
  id?: string;
  title: string;
  body: string;
  tags: string[];
}

export interface ReadPostInfo {
  title: string;
  body: string;
  tags: string[];
  publishedDate: Date;
  user: UserInfo;
  _id?: string;
}

export interface ListPostInfo {
  page: string;
  tag: string;
  username: string;
}

export async function writePost({ title, body, tags }: WritePostInfo) {
  const response = await client.post('/api/posts', { title, body, tags });
  return response.data;
}

export async function readPost(id: string) {
  const response = await client.get(`/api/posts/${id}`);
  return response.data;
}

export async function listPosts({ page, username, tag }: ListPostInfo) {
  const queryString = qs.stringify({
    page,
    username,
    tag,
  });
  const response = await client.get(`/api/posts?${queryString}`);
  return response;
}

export async function updatePost({ id, title, body, tags }: WritePostInfo) {
  const response = await client.patch(`/api/posts/${id}`, {
    title,
    body,
    tags,
  });
  return response.data;
}

export const removePost = (id: string) => client.delete(`/api/posts/${id}`);
