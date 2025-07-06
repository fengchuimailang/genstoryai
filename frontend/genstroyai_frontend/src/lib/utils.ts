import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// 请求锁类
export class RequestLock {
  private isLocked = false;
  private lockTimeout: number;

  constructor(timeout = 5000) {
    this.lockTimeout = timeout;
  }

  async acquire(): Promise<boolean> {
    if (this.isLocked) {
      return false;
    }
    
    this.isLocked = true;
    
    // 设置自动解锁超时
    setTimeout(() => {
      this.release();
    }, this.lockTimeout);
    
    return true;
  }

  release(): void {
    this.isLocked = false;
  }

  isRequestLocked(): boolean {
    return this.isLocked;
  }
}
