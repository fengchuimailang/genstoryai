import { memo, useMemo } from 'react';
import { Button } from './ui/button';
import { i18n, type Language } from '@/lib/i18n';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export const LanguageSwitcher = memo(() => {
  const currentLanguage = useMemo(() => i18n.getCurrentLanguage(), []);

  const handleLanguageChange = (lang: Language) => {
    i18n.setLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border p-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLanguage === lang.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleLanguageChange(lang.code)}
          className="text-xs px-2 py-1 h-8"
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.name}
        </Button>
      ))}
    </div>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher'; 