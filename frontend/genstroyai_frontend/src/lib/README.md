# 错误处理和国际化使用说明

## 错误处理系统

### 核心功能

1. **用户友好的错误信息**：将后端英文错误信息转换为中文用户友好提示
2. **错误分类**：网络错误、服务器错误、验证错误、认证错误等
3. **统一处理**：所有 API 错误都通过统一的错误处理系统

### 使用方法

#### 1. 在组件中使用错误处理

```typescript
import { getErrorMessage } from '../lib/errorHandler';

try {
  const result = await apiCall();
} catch (error) {
  const userFriendlyMessage = getErrorMessage(error);
  setError(userFriendlyMessage);
}
```

#### 2. 表单验证

```typescript
import { handleValidationError } from '../lib/errorHandler';

const validateField = (field: string, value: string) => {
  const error = handleValidationError(field, value);
  if (error) {
    setFieldError(field, error);
  }
};
```

#### 3. 密码强度检查

```typescript
import { checkPasswordStrength } from '../lib/errorHandler';

const passwordCheck = checkPasswordStrength(password);
if (!passwordCheck.isValid) {
  setError(passwordCheck.message);
}
```

### 错误类型

- **NETWORK_ERROR**: 网络连接错误
- **SERVER_ERROR**: 服务器错误
- **VALIDATION_ERROR**: 表单验证错误
- **AUTH_ERROR**: 认证错误
- **UNKNOWN_ERROR**: 未知错误

## 国际化系统

### 支持的语言

- 中文 (zh)
- 英文 (en)
- 日文 (ja)
- 韩文 (ko)

### 使用方法

#### 1. 在组件中使用翻译

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('auth.login')}</h1>
      <p>{t('messages.welcome')}</p>
    </div>
  );
}
```

#### 2. 语言切换

```typescript
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <select onChange={(e) => changeLanguage(e.target.value)}>
      <option value="zh">中文</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
    </select>
  );
}
```

### 翻译键结构

```
common: {
  loading: '加载中...',
  error: '错误',
  success: '成功',
  // ...
}

auth: {
  login: '登录',
  register: '注册',
  username: '用户名',
  // ...
}

validation: {
  required: '此字段为必填项',
  email: '请输入有效的邮箱地址',
  // ...
}

errors: {
  networkError: '网络连接错误，请检查网络连接',
  serverError: '服务器错误，请稍后重试',
  // ...
}

messages: {
  welcome: '欢迎使用 GenStoryAI',
  loginToContinue: '请登录以继续',
  // ...
}
```

## 错误提示组件

### Alert 组件

```typescript
import { Alert } from '../components/ui/alert';

<Alert 
  type="error" 
  title="错误标题"
  message="错误信息"
/>
```

### 类型

- `error`: 错误提示（红色）
- `warning`: 警告提示（黄色）
- `info`: 信息提示（蓝色）
- `success`: 成功提示（绿色）

## 最佳实践

### 1. 错误处理

- 始终使用 `getErrorMessage()` 处理 API 错误
- 为用户提供具体的错误解决建议
- 避免显示技术性错误信息

### 2. 表单验证

- 实时验证用户输入
- 提供清晰的错误提示
- 使用统一的验证规则

### 3. 国际化

- 使用翻译键而不是硬编码文本
- 考虑不同语言的文本长度
- 提供完整的翻译覆盖

### 4. 用户体验

- 错误信息要友好易懂
- 提供解决错误的建议
- 保持界面的一致性

## 扩展指南

### 添加新的错误类型

1. 在 `errorHandler.ts` 中添加新的错误映射
2. 更新错误类型枚举
3. 在相应的 API 中处理新错误

### 添加新的语言

1. 在 `i18n.ts` 中添加新的翻译对象
2. 更新语言检测配置
3. 在语言切换组件中添加新选项

### 添加新的验证规则

1. 在 `errorHandler.ts` 中添加新的验证函数
2. 更新错误消息映射
3. 在表单组件中使用新规则 