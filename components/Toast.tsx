'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in max-w-md`}>
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 text-xl">
        ×
      </button>
    </div>
  );
}
