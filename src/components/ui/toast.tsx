'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const DEFAULT_DURATION = 5000

interface ToastContextType {
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastComponent({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const duration = toast.duration ?? DEFAULT_DURATION

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, duration)
    return () => clearTimeout(timer)
  }, [toast.id, duration, onRemove])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        'relative flex items-center gap-3 p-4 rounded-lg border shadow-lg w-full pointer-events-auto',
        bgColors[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, message, duration }])
  }, [])

  const success = useCallback((message: string, duration?: number) => addToast('success', message, duration), [addToast])
  const error = useCallback((message: string, duration?: number) => addToast('error', message, duration), [addToast])
  const info = useCallback((message: string, duration?: number) => addToast('info', message, duration), [addToast])

  return (
    <ToastContext.Provider value={{ success, error, info, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}
