// 简化的国际化配置，不依赖外部包
export type Language = 'zh' | 'en' | 'ja' | 'ko';

// 中文翻译
const zhTranslations = {
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    next: '下一步',
    submit: '提交',
    reset: '重置',
  },
  auth: {
    login: '登录',
    register: '注册',
    logout: '退出登录',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    forgotPassword: '忘记密码',
    rememberMe: '记住我',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    logoutSuccess: '退出登录成功',
    emailVerification: '邮箱验证',
    resendVerification: '重新发送验证邮件',
    verificationSent: '验证邮件已发送',
    verificationSuccess: '邮箱验证成功',
    verificationFailed: '邮箱验证失败',
    invalidToken: '无效的验证链接',
    networkError: '网络错误，请稍后重试',
  },
  validation: {
    required: '此字段为必填项',
    email: '请输入有效的邮箱地址',
    passwordLength: '密码至少需要6个字符',
    passwordMismatch: '密码不匹配',
    usernameLength: '用户名至少需要3个字符',
    usernameExists: '用户名已存在',
    emailExists: '邮箱已被注册',
    invalidCredentials: '用户名或密码错误',
    weakPassword: '密码强度太弱',
    invalidEmail: '邮箱格式不正确',
  },
  errors: {
    networkError: '网络连接错误，请检查网络连接',
    serverError: '服务器错误，请稍后重试',
    unauthorized: '未授权访问，请重新登录',
    forbidden: '权限不足',
    notFound: '请求的资源不存在',
    timeout: '请求超时，请稍后重试',
    unknown: '未知错误，请稍后重试',
    'Invalid credentials': '用户名或密码错误',
    'Email already registered': '邮箱已被注册',
    'Username already exists': '用户名已存在',
    'Invalid email format': '邮箱格式不正确',
    'Password too weak': '密码强度太弱',
    'Token expired': '验证链接已过期',
    'Invalid token': '无效的验证链接',
    'User not found': '用户不存在',
    'Email not verified': '邮箱未验证',
    'Account disabled': '账户已被禁用',
  },
  messages: {
    welcome: '欢迎使用 GenStoryAI',
    loginToContinue: '请登录以继续',
    registerToStart: '注册账户开始使用',
    emailVerificationRequired: '请验证您的邮箱地址',
    checkEmailForVerification: '请检查您的邮箱并点击验证链接',
    verificationEmailSent: '验证邮件已发送，请检查您的邮箱',
    accountCreated: '账户创建成功',
    loginSuccessful: '登录成功，正在跳转...',
    logoutSuccessful: '退出登录成功',
  },
};

// 英文翻译
const enTranslations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    reset: 'Reset',
  },
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password',
    rememberMe: 'Remember Me',
    loginSuccess: 'Login Successful',
    registerSuccess: 'Registration Successful',
    logoutSuccess: 'Logout Successful',
    emailVerification: 'Email Verification',
    resendVerification: 'Resend Verification Email',
    verificationSent: 'Verification Email Sent',
    verificationSuccess: 'Email Verification Successful',
    verificationFailed: 'Email Verification Failed',
    invalidToken: 'Invalid verification link',
    networkError: 'Network error, please try again later',
  },
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    passwordLength: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    usernameLength: 'Username must be at least 3 characters',
    usernameExists: 'Username already exists',
    emailExists: 'Email already registered',
    invalidCredentials: 'Invalid username or password',
    weakPassword: 'Password is too weak',
    invalidEmail: 'Invalid email format',
  },
  errors: {
    networkError: 'Network connection error, please check your connection',
    serverError: 'Server error, please try again later',
    unauthorized: 'Unauthorized access, please login again',
    forbidden: 'Insufficient permissions',
    notFound: 'Requested resource not found',
    timeout: 'Request timeout, please try again later',
    unknown: 'Unknown error, please try again later',
    'Invalid credentials': 'Invalid username or password',
    'Email already registered': 'Email already registered',
    'Username already exists': 'Username already exists',
    'Invalid email format': 'Invalid email format',
    'Password too weak': 'Password is too weak',
    'Token expired': 'Verification link has expired',
    'Invalid token': 'Invalid verification link',
    'User not found': 'User not found',
    'Email not verified': 'Email not verified',
    'Account disabled': 'Account has been disabled',
  },
  messages: {
    welcome: 'Welcome to GenStoryAI',
    loginToContinue: 'Please login to continue',
    registerToStart: 'Register an account to get started',
    emailVerificationRequired: 'Please verify your email address',
    checkEmailForVerification: 'Please check your email and click the verification link',
    verificationEmailSent: 'Verification email sent, please check your inbox',
    accountCreated: 'Account created successfully',
    loginSuccessful: 'Login successful, redirecting...',
    logoutSuccessful: 'Logout successful',
  },
};

// 日文翻译
const jaTranslations = {
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    delete: '削除',
    edit: '編集',
    back: '戻る',
    next: '次へ',
    submit: '送信',
    reset: 'リセット',
  },
  auth: {
    login: 'ログイン',
    register: '登録',
    logout: 'ログアウト',
    username: 'ユーザー名',
    email: 'メールアドレス',
    password: 'パスワード',
    confirmPassword: 'パスワード確認',
    forgotPassword: 'パスワードを忘れた',
    rememberMe: 'ログイン状態を保持',
    loginSuccess: 'ログイン成功',
    registerSuccess: '登録成功',
    logoutSuccess: 'ログアウト成功',
    emailVerification: 'メール認証',
    resendVerification: '認証メールを再送信',
    verificationSent: '認証メールを送信しました',
    verificationSuccess: 'メール認証成功',
    verificationFailed: 'メール認証失敗',
    invalidToken: '無効な認証リンク',
    networkError: 'ネットワークエラー、後でもう一度お試しください',
  },
  validation: {
    required: 'この項目は必須です',
    email: '有効なメールアドレスを入力してください',
    passwordLength: 'パスワードは6文字以上である必要があります',
    passwordMismatch: 'パスワードが一致しません',
    usernameLength: 'ユーザー名は3文字以上である必要があります',
    usernameExists: 'ユーザー名は既に存在します',
    emailExists: 'メールアドレスは既に登録されています',
    invalidCredentials: 'ユーザー名またはパスワードが正しくありません',
    weakPassword: 'パスワードが弱すぎます',
    invalidEmail: 'メールアドレスの形式が正しくありません',
  },
  errors: {
    networkError: 'ネットワーク接続エラー、接続を確認してください',
    serverError: 'サーバーエラー、後でもう一度お試しください',
    unauthorized: '認証されていません、再度ログインしてください',
    forbidden: '権限が不足しています',
    notFound: '要求されたリソースが見つかりません',
    timeout: 'リクエストがタイムアウトしました、後でもう一度お試しください',
    unknown: '不明なエラー、後でもう一度お試しください',
    'Invalid credentials': 'ユーザー名またはパスワードが正しくありません',
    'Email already registered': 'メールアドレスは既に登録されています',
    'Username already exists': 'ユーザー名は既に存在します',
    'Invalid email format': 'メールアドレスの形式が正しくありません',
    'Password too weak': 'パスワードが弱すぎます',
    'Token expired': '認証リンクの有効期限が切れています',
    'Invalid token': '無効な認証リンク',
    'User not found': 'ユーザーが見つかりません',
    'Email not verified': 'メールアドレスが認証されていません',
    'Account disabled': 'アカウントが無効になっています',
  },
  messages: {
    welcome: 'GenStoryAI へようこそ',
    loginToContinue: '続行するにはログインしてください',
    registerToStart: 'アカウントを登録して開始してください',
    emailVerificationRequired: 'メールアドレスを認証してください',
    checkEmailForVerification: 'メールを確認して認証リンクをクリックしてください',
    verificationEmailSent: '認証メールを送信しました、受信トレイを確認してください',
    accountCreated: 'アカウントが正常に作成されました',
    loginSuccessful: 'ログイン成功、リダイレクト中...',
    logoutSuccessful: 'ログアウト成功',
  },
};

// 韩文翻译
const koTranslations = {
  common: {
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    back: '뒤로',
    next: '다음',
    submit: '제출',
    reset: '재설정',
  },
  auth: {
    login: '로그인',
    register: '회원가입',
    logout: '로그아웃',
    username: '사용자명',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    forgotPassword: '비밀번호 찾기',
    rememberMe: '로그인 상태 유지',
    loginSuccess: '로그인 성공',
    registerSuccess: '회원가입 성공',
    logoutSuccess: '로그아웃 성공',
    emailVerification: '이메일 인증',
    resendVerification: '인증 이메일 재전송',
    verificationSent: '인증 이메일이 전송되었습니다',
    verificationSuccess: '이메일 인증 성공',
    verificationFailed: '이메일 인증 실패',
    invalidToken: '잘못된 인증 링크',
    networkError: '네트워크 오류, 나중에 다시 시도해 주세요',
  },
  validation: {
    required: '이 필드는 필수입니다',
    email: '유효한 이메일 주소를 입력해 주세요',
    passwordLength: '비밀번호는 최소 6자 이상이어야 합니다',
    passwordMismatch: '비밀번호가 일치하지 않습니다',
    usernameLength: '사용자명은 최소 3자 이상이어야 합니다',
    usernameExists: '사용자명이 이미 존재합니다',
    emailExists: '이메일이 이미 등록되어 있습니다',
    invalidCredentials: '사용자명 또는 비밀번호가 올바르지 않습니다',
    weakPassword: '비밀번호가 너무 약합니다',
    invalidEmail: '이메일 형식이 올바르지 않습니다',
  },
  errors: {
    networkError: '네트워크 연결 오류, 연결을 확인해 주세요',
    serverError: '서버 오류, 나중에 다시 시도해 주세요',
    unauthorized: '인증되지 않은 접근, 다시 로그인해 주세요',
    forbidden: '권한이 부족합니다',
    notFound: '요청한 리소스를 찾을 수 없습니다',
    timeout: '요청 시간 초과, 나중에 다시 시도해 주세요',
    unknown: '알 수 없는 오류, 나중에 다시 시도해 주세요',
    'Invalid credentials': '사용자명 또는 비밀번호가 올바르지 않습니다',
    'Email already registered': '이메일이 이미 등록되어 있습니다',
    'Username already exists': '사용자명이 이미 존재합니다',
    'Invalid email format': '이메일 형식이 올바르지 않습니다',
    'Password too weak': '비밀번호가 너무 약합니다',
    'Token expired': '인증 링크가 만료되었습니다',
    'Invalid token': '잘못된 인증 링크',
    'User not found': '사용자를 찾을 수 없습니다',
    'Email not verified': '이메일이 인증되지 않았습니다',
    'Account disabled': '계정이 비활성화되었습니다',
  },
  messages: {
    welcome: 'GenStoryAI에 오신 것을 환영합니다',
    loginToContinue: '계속하려면 로그인해 주세요',
    registerToStart: '계정을 등록하여 시작하세요',
    emailVerificationRequired: '이메일 주소를 인증해 주세요',
    checkEmailForVerification: '이메일을 확인하고 인증 링크를 클릭해 주세요',
    verificationEmailSent: '인증 이메일이 전송되었습니다, 받은 편지함을 확인해 주세요',
    accountCreated: '계정이 성공적으로 생성되었습니다',
    loginSuccessful: '로그인 성공, 리디렉션 중...',
    logoutSuccessful: '로그아웃 성공',
  },
};

// 翻译资源
const resources = {
  zh: zhTranslations,
  en: enTranslations,
  ja: jaTranslations,
  ko: koTranslations,
};

// 获取当前语言
function getCurrentLanguage(): Language {
  // 从 localStorage 获取语言设置
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang && resources[savedLang]) {
    return savedLang;
  }
  
  // 从浏览器语言检测
  const browserLang = navigator.language.split('-')[0] as Language;
  if (browserLang && resources[browserLang]) {
    return browserLang;
  }
  
  // 默认返回中文
  return 'zh';
}

// 设置语言
function setLanguage(lang: Language) {
  localStorage.setItem('language', lang);
  window.location.reload(); // 简单的方式：刷新页面
}

// 翻译函数
function t(key: string, lang?: Language): string {
  const currentLang = lang || getCurrentLanguage();
  const translations = resources[currentLang];
  
  // 支持嵌套键，如 'auth.login'
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 如果找不到翻译，返回键名
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// 导出国际化工具
export const i18n = {
  t,
  getCurrentLanguage,
  setLanguage,
  resources,
};

// 默认导出
export default i18n; 