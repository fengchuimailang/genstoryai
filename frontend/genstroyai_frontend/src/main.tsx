import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './lib/i18n' // 导入国际化配置

createRoot(document.getElementById('root')!).render(
  <App />
)
