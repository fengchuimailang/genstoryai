# API 封装说明

本项目使用统一的 API 封装来管理所有的后端请求，提供更好的错误处理、类型安全和代码复用。

## 文件结构

```
src/api/
├── client.ts      # API 客户端核心类
├── auth.ts        # 认证相关 API
├── index.ts       # 统一导出文件
└── README.md      # 说明文档
```

## 核心组件

### ApiClient 类

`ApiClient` 是核心的 HTTP 客户端类，提供以下功能：

- **统一的错误处理**：自动处理 HTTP 错误和网络异常
- **类型安全**：支持 TypeScript 泛型
- **请求方法**：支持 GET、POST、PUT、DELETE 和表单提交
- **自动 JSON 处理**：自动序列化和反序列化 JSON 数据

#### 基本用法

```typescript
import { apiClient } from './api';

// GET 请求
const user = await apiClient.get<User>('/user/users/me/', {
  'Authorization': `Bearer ${token}`
});

// POST 请求
const newUser = await apiClient.post<User>('/user/register', {
  username: 'test',
  email: 'test@example.com',
  password: 'password'
});

// 表单提交
const formData = new FormData();
formData.append('username', 'test');
formData.append('password', 'password');
const loginResponse = await apiClient.postForm<LoginResponse>('/user/token', formData);
```

### 认证 API

`auth.ts` 包含所有认证相关的 API 函数：

```typescript
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  verifyEmail, 
  resendVerificationEmail 
} from './api';

// 用户注册
const user = await registerUser({
  username: 'test',
  email: 'test@example.com',
  password: 'password'
});

// 用户登录
const loginResponse = await loginUser({
  username: 'test',
  password: 'password'
});

// 验证邮箱
const verificationResult = await verifyEmail(token);

// 重新发送验证邮件
await resendVerificationEmail('test@example.com');
```

## 错误处理

所有 API 函数都会抛出 `Error` 对象，包含详细的错误信息：

```typescript
try {
  const user = await getCurrentUser(token);
} catch (error) {
  if (error instanceof Error) {
    console.error('API 错误:', error.message);
  }
}
```

## 类型定义

所有 API 响应都有对应的 TypeScript 类型定义：

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface VerificationResponse {
  message: string;
  user_id: number;
  email: string;
}
```

## 最佳实践

1. **统一导入**：使用 `src/api/index.ts` 进行统一导入
2. **错误处理**：始终使用 try-catch 包装 API 调用
3. **类型安全**：使用 TypeScript 类型定义确保类型安全
4. **错误信息**：为用户提供友好的错误提示

## 扩展新的 API

要添加新的 API 端点，请按以下步骤操作：

1. 在相应的 API 文件中添加新的函数
2. 在 `index.ts` 中导出新的函数和类型
3. 确保有适当的错误处理和类型定义

示例：

```typescript
// 在 auth.ts 中添加新函数
export const updateProfile = async (userId: number, data: Partial<User>): Promise<User> => {
  return apiClient.put<User>(`/user/users/${userId}`, data);
};

// 在 index.ts 中导出
export { updateProfile } from './auth';
``` 