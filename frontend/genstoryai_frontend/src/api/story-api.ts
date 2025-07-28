import { apiClient } from './api-client';

export async function getStoryList({ skip = 0, limit = 10, search = '' }) {
  try {
    const params: { skip: number; limit: number; search?: string } = { skip, limit };
    if (search) params.search = search;
    const res = await apiClient.get('/api/story/', { params });
    return res.data;
  } catch (e: any) {
    throw e?.response?.data?.detail || e?.response?.data?.message || e.message || e;
  }
}

export async function createStory(data: any) {
  const res = await apiClient.post('/api/story/create/', data);
  return res.data;
}
/**
 * 
 * @param story_id | 替换真实id
 * @param outline_level 
 * @returns 
 */
export async function generateOutline(story_id: string | number, outline_level: number = 1) {
  const res = await apiClient.post(`/api/story/generate_outline/?story_id=${1}&outline_level=${outline_level}`);
  return res.data;
}

/**
 * 获取角色列表
 * @param params { skip: number; limit: number }
 */
export async function getCharacterList(params: { skip?: number; limit?: number }) {
  const res = await apiClient.get('/api/character/', { params });
  return res.data;
}

/**
 * 更新角色信息
 * @param character_id 角色ID
 * @param data 角色数据
 */
export async function updateCharacter(character_id: string | number, data: any) {
  const res = await apiClient.put(`/api/character/${character_id}`, data);
  return res.data;
}

/**
 * 删除角色
 * @param character_id 角色ID
 */
export async function deleteCharacter(character_id: string | number) {
  const res = await apiClient.delete(`/api/character/${character_id}`, { data: { character_id } });
  return res.data;
} 

/**
 * 更新故事信息
 * @param story_id 故事ID
 * @param data 故事数据
 */
export async function updateStory(story_id: string | number, data: any) {
  try {
    const res = await apiClient.put(`/api/story/${story_id}`, data);
    return res.data;
  } catch (e: any) {
    throw e?.response?.data?.detail || e?.response?.data?.message || e.message || e;
  }
} 

export async function getStoryById(story_id: string | number) {
  try {
    const res = await apiClient.get(`/api/story/${story_id}`);
    return res.data;
  } catch (e: any) {
    throw e?.response?.data?.detail || e?.response?.data?.message || e.message || e;
  }
} 

export async function deleteStory(story_id: string | number) {
  try {
    const res = await apiClient.delete(`/api/story/${story_id}`);
    return res.data;
  } catch (e: any) {
    throw e?.response?.data?.detail || e?.response?.data?.message || e.message || e;
  }
} 

export async function createStoryContent(data: { story_id: number; outline_title: string; content: string }) {
  try {
    const res = await apiClient.post('/api/story_content/create/', data);
    return res.data;
  } catch (e: any) {
    throw e?.response?.data?.detail || e?.response?.data?.message || e.message || e;
  }
} 

export async function getStoryContent(story_content_id: string | number) {
  try {
    const res = await apiClient.get(`/api/story_content/${story_content_id}`);
    return res.data;
  } catch (e: any) {
    throw e?.response?.data?.detail || e?.response?.data?.message || e.message || e;
  }
} 

export async function updateStoryContent(story_content_id: string | number, data: { outline_title: string; content: string }) {
  try {
    const res = await apiClient.put(`/api/story_content/${story_content_id}`, data);
    return res.data;
  } catch (e: any) {
    throw e?.response?.data?.detail || e?.response?.data?.message || e.message || e;
  }
} 