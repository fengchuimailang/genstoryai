import type { ReactNode } from 'react';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface AppLayoutProps {
  children: ReactNode;
  showLanguageSwitcher?: boolean;
  className?: string;
}

export const AppLayout = ({ 
  children, 
  showLanguageSwitcher = true,
  className = ''
}: AppLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showLanguageSwitcher && (
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>
      )}
      
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}; 