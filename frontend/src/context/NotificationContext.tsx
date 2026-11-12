import React, { createContext, useContext, useState, useCallback } from 'react';
import { soundEffects } from '../utils/soundEffects';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'download';

export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  playSound?: boolean;
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  createdAt: number;
}

interface NotificationContextType {
  toasts: ToastItem[];
  showToast: (type: ToastType, options: ToastOptions) => string;
  dismissToast: (id: string) => void;
  success: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
  error: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
  warning: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
  info: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
  download: (title: string, message?: string, options?: Partial<ToastOptions>) => string;
  isSoundEnabled: boolean;
  toggleSound: () => boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => soundEffects.isSoundEnabled());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, options: ToastOptions): string => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const duration = options.duration ?? (type === 'error' ? 5500 : 4200);

      const newToast: ToastItem = {
        id,
        type,
        title: options.title,
        message: options.message,
        duration,
        playSound: options.playSound ?? true,
        createdAt: Date.now(),
      };

      // Play corresponding sound effect if sound is enabled
      if (options.playSound !== false) {
        switch (type) {
          case 'success':
            soundEffects.playSuccess();
            break;
          case 'download':
            soundEffects.playDownload();
            break;
          case 'error':
            soundEffects.playError();
            break;
          case 'warning':
            soundEffects.playNotification();
            break;
          case 'info':
          default:
            soundEffects.playNotification();
            break;
        }
      }

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Max 5 toasts visible

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const success = useCallback(
    (title: string, message?: string, opts?: Partial<ToastOptions>) =>
      showToast('success', { title, message, ...opts }),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, opts?: Partial<ToastOptions>) =>
      showToast('error', { title, message, ...opts }),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, opts?: Partial<ToastOptions>) =>
      showToast('warning', { title, message, ...opts }),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, opts?: Partial<ToastOptions>) =>
      showToast('info', { title, message, ...opts }),
    [showToast]
  );

  const download = useCallback(
    (title: string, message?: string, opts?: Partial<ToastOptions>) =>
      showToast('download', { title, message, ...opts }),
    [showToast]
  );

  const toggleSound = useCallback(() => {
    const newState = soundEffects.toggleSound();
    setIsSoundEnabled(newState);
    return newState;
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        success,
        error,
        warning,
        info,
        download,
        isSoundEnabled,
        toggleSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

