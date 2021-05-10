import client from './client';

export async function writePost({ title, body, tags }: WritePostInfo) {
  const response = await client.post('/api/posts', { title, body, tags });
  return response.data;
}

export async function readPost(id: string) {
  const response = await client.get(`/api/posts/${id}`);
  return response.data;
}

export interface WritePostInfo {
  title: string;
  body: string;
  tags: string[];
}

export interface ReadPostInfo {
  title: string;
  body: string;
  tags: string[];
  publishedDate: Date;
  user: {
    username: string
  };
}
