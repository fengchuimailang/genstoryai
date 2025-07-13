import { apiClient } from './api-client';

export async function getStoryList({ skip = 0, limit = 10, search = '' }) {
  const params: { skip: number; limit: number; search?: string } = { skip, limit };
  if (search) params.search = search;
  const res = await apiClient.get('/api/story/', { params });
  return res.data;
}

export async function createStory(data: any) {
  const res = await apiClient.post('/api/story/create/', data);
  return res.data;
} 