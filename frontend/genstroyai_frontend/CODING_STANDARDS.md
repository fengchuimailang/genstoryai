# 编码规范和文件命名标准

## 文件命名规范

### 组件文件 (Components)
- **React 组件**: 使用 PascalCase
  ```
  UserProfile.tsx
  LoginForm.tsx
  NavigationBar.tsx
  ```

### 页面文件 (Pages)
- **页面组件**: 使用 kebab-case
  ```
  login-page.tsx
  register-page.tsx
  verify-email-page.tsx
  home-page.tsx
  ```

### Hook 文件 (Hooks)
- **自定义 Hooks**: 使用 camelCase，以 `use` 开头
  ```
  useAuth.ts
  useLocalStorage.ts
  useDebounce.ts
  useApi.ts
  ```

### API 文件 (API)
- **API 相关**: 使用 kebab-case
  ```
  auth-api.ts
  user-api.ts
  story-api.ts
  api-client.ts
  ```

### 工具文件 (Utils)
- **工具函数**: 使用 kebab-case
  ```
  error-handler.ts
  validation-utils.ts
  date-utils.ts
  string-utils.ts
  ```

### 类型文件 (Types)
- **类型定义**: 使用 kebab-case
  ```
  user-types.ts
  api-types.ts
  common-types.ts
  ```

### 样式文件 (Styles)
- **CSS/SCSS**: 使用 kebab-case
  ```
  button-styles.css
  layout-styles.css
  theme-styles.css
  ```

## 目录结构规范

```
src/
├── components/          # 可复用组件
│   ├── ui/            # UI 基础组件
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   └── common/        # 通用组件
│       ├── header.tsx
│       ├── footer.tsx
│       └── navigation.tsx
├── pages/             # 页面组件
│   ├── login-page.tsx
│   ├── register-page.tsx
│   └── home-page.tsx
├── hooks/             # 自定义 Hooks
│   ├── use-auth.ts
│   ├── use-api.ts
│   └── use-local-storage.ts
├── api/               # API 相关
│   ├── auth-api.ts
│   ├── user-api.ts
│   └── api-client.ts
├── utils/             # 工具函数
│   ├── error-handler.ts
│   ├── validation-utils.ts
│   └── date-utils.ts
├── types/             # 类型定义
│   ├── user-types.ts
│   ├── api-types.ts
│   └── common-types.ts
├── styles/            # 样式文件
│   ├── global-styles.css
│   └── theme-styles.css
└── constants/         # 常量定义
    ├── api-constants.ts
    └── app-constants.ts
```

## 代码风格规范

### 导入顺序
1. React 相关导入
2. 第三方库导入
3. 内部模块导入
4. 类型导入
5. 样式导入

```typescript
// React 相关
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 第三方库
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 内部模块
import { useAuth } from '@/hooks/use-auth';
import { loginUser } from '@/api/auth-api';

// 类型导入
import type { User } from '@/types/user-types';

// 样式导入
import './login-page.css';
```

### 组件命名
- **函数组件**: 使用 PascalCase
- **Props 接口**: 使用 PascalCase + Props
- **事件处理函数**: 使用 camelCase，以 `handle` 开头

```typescript
interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    // 处理逻辑
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 处理逻辑
  };

  return (
    // JSX
  );
}
```

### 变量命名
- **常量**: 使用 UPPER_SNAKE_CASE
- **变量**: 使用 camelCase
- **布尔值**: 使用 is/has/can 前缀

```typescript
const API_BASE_URL = 'http://localhost:8000';
const MAX_RETRY_COUNT = 3;

const userData = { name: 'John', email: 'john@example.com' };
const isLoading = false;
const hasError = true;
const canSubmit = true;
```

### 函数命名
- **事件处理**: handle + 事件名
- **工具函数**: 动词 + 名词
- **异步函数**: 动词 + 名词 + Async

```typescript
const handleSubmit = () => {};
const handleInputChange = () => {};
const validateEmail = (email: string) => {};
const fetchUserData = async () => {};
const saveUserDataAsync = async () => {};
```

## ESLint 规则

### 强制规则
- 使用单引号
- 使用分号
- 使用 2 空格缩进
- 对象和数组使用尾随逗号
- 使用 const 和 let，避免 var
- 使用箭头函数
- 使用模板字符串

### 警告规则
- 避免使用 console.log
- 避免使用 alert
- 避免使用 any 类型
- 未使用的变量

## Prettier 配置

- **printWidth**: 80
- **tabWidth**: 2
- **useTabs**: false
- **semi**: true
- **singleQuote**: true
- **trailingComma**: es5
- **bracketSpacing**: true
- **arrowParens**: avoid

## 提交规范

### 提交信息格式
```
type(scope): description

[optional body]

[optional footer]
```

### 类型 (type)
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例
```
feat(auth): add login functionality
fix(api): resolve user data fetching issue
docs(readme): update installation instructions
style(components): format button component
```

## 运行命令

```bash
# 代码检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 代码格式化
npm run format

# 检查格式化
npm run format:check

# 类型检查
npm run type-check
```

## IDE 配置

### VS Code 推荐设置
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 推荐扩展
- ESLint
- Prettier
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer 