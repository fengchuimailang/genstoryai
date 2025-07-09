import { getErrorMessage } from '../lib/error-handler';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:80';

export interface ApiError {
  detail: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: '网络请求失败'
        }));
        
        // 使用用户友好的错误信息
        const userFriendlyMessage = getErrorMessage(errorData.detail);
        throw new Error(userFriendlyMessage);
      }

      // 如果响应为空，返回空对象
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        // 使用用户友好的错误信息
        const userFriendlyMessage = getErrorMessage(error.message);
        throw new Error(userFriendlyMessage);
      }
      throw new Error('网络请求失败');
    }
  }

  // GET 请求
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  // POST 请求
  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 请求
  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 请求
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  // 表单数据 POST 请求
  async postForm<T>(
    endpoint: string,
    formData: FormData,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...headers,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: '网络请求失败'
        }));
        
        // 使用用户友好的错误信息
        const userFriendlyMessage = getErrorMessage(errorData.detail);
        throw new Error(userFriendlyMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        // 使用用户友好的错误信息
        const userFriendlyMessage = getErrorMessage(error.message);
        throw new Error(userFriendlyMessage);
      }
      throw new Error('网络请求失败');
    }
  }
}

// 创建默认的 API 客户端实例
export const apiClient = new ApiClient();

// 导出类以便自定义配置
export { ApiClient }; 