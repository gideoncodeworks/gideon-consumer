/**
 * ErrorToast - User-friendly error notification component
 */

'use client';

import { X, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function ErrorToast({
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: ErrorToastProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] animate-[slideIn_0.3s_ease-out]">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-xl p-4 pr-12 max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-900 dark:text-red-100 font-medium mb-1">
              Something went wrong
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-red-100 dark:hover:bg-red-800/50 rounded transition-colors"
            aria-label="Close error"
          >
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
