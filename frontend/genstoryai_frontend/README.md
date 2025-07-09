# GenStoryAI Frontend

## 功能特性

- ✅ 用户注册
- ✅ 用户登录（支持用户名或邮箱登录）
- ✅ 路由保护
- ✅ 状态管理（Zustand）
- ✅ 响应式设计
- ✅ 错误处理

## 安装依赖

```bash
npm install
# 或者
pnpm install
```

## 启动开发服务器

```bash
npm run dev
# 或者
pnpm dev
```

## 项目结构

```
src/
├── api/
│   └── auth.ts          # 认证相关 API
├── app/
│   ├── login/
│   │   └── page.tsx     # 登录页面
│   ├── register/
│   │   └── page.tsx     # 注册页面
│   ├── home/
│   │   └── page.tsx     # 首页
│   └── test/
│       └── page.tsx     # 测试页面
├── components/
│   └── ui/              # shadcn-ui 组件
├── lib/
│   ├── store.ts         # Zustand 状态管理
│   └── utils.ts         # 工具函数
└── router.tsx           # 路由配置
```

## 使用说明

1. **注册新用户**：访问 `/register` 页面
2. **登录**：访问 `/login` 页面
3. **首页**：登录成功后自动跳转到 `/home`
4. **测试页面**：访问 `/test` 查看认证状态

## API 配置

后端 API 地址：`http://localhost:80`

### 主要 API 端点

- `POST /user/register` - 用户注册
- `POST /user/token` - 用户登录
- `GET /user/users/me/` - 获取当前用户信息

## 技术栈

- React 19
- TypeScript
- Vite
- React Router DOM
- Zustand (状态管理)
- Tailwind CSS
- shadcn/ui 组件库

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
