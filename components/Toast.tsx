'use client'

import { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimes, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastListeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

function addToast(message: string, type: ToastType = 'success') {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast: Toast = { id, message, type }
  
  toasts = [...toasts, newToast]
  toastListeners.forEach(listener => listener(toasts))

  // Auto remove after 4 seconds
  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id)
  toastListeners.forEach(listener => listener(toasts))
}

export function showToast(message: string, type: ToastType = 'success') {
  addToast(message, type)
}

export function showSuccess(message: string) {
  showToast(message, 'success')
}

export function showError(message: string) {
  showToast(message, 'error')
}

export function showInfo(message: string) {
  showToast(message, 'info')
}

export function showWarning(message: string) {
  showToast(message, 'warning')
}

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts)
    }
    
    toastListeners.push(listener)
    setCurrentToasts(toasts)

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="w-5 h-5" />
      case 'error':
        return <FaExclamationCircle className="w-5 h-5" />
      case 'warning':
        return <FaExclamationCircle className="w-5 h-5" />
      case 'info':
        return <FaInfoCircle className="w-5 h-5" />
      default:
        return <FaCheckCircle className="w-5 h-5" />
    }
  }

  const getColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-green-50 border-green-200 text-green-800'
    }
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {currentToasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md toast-animation ${getColors(toast.type)}`}
          >
            <div className="flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .toast-animation {
          animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

