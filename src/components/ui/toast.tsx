'use client'

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const TOAST_EXIT_MS = 250
const DEFAULT_DURATION = 5000

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  const [mounted, setMounted] = useState(false)
  const [exiting, setExiting] = useState(false)
  const removeRef = useRef(onRemove)
  removeRef.current = onRemove

  const triggerRemove = useCallback(() => setExiting(true), [])

  useLayoutEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const duration = toast.duration ?? DEFAULT_DURATION
  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), duration)
    return () => clearTimeout(timer)
  }, [toast.id, duration])

  useEffect(() => {
    if (!exiting) return
    const id = toast.id
    const t = setTimeout(() => {
      removeRef.current(id)
    }, TOAST_EXIT_MS)
    return () => clearTimeout(t)
  }, [exiting, toast.id])

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
    <div
      className={cn(
        'relative flex items-center gap-3 p-4 rounded-lg border shadow-lg',
        exiting ? 'toast-animate-out' : mounted ? 'toast-animate-in' : 'opacity-0',
        bgColors[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={triggerRemove}
        className="text-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, type, message, duration }
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = (message: string, duration?: number) => addToast('success', message, duration)
  const error = (message: string, duration?: number) => addToast('error', message, duration)
  const info = (message: string, duration?: number) => addToast('info', message, duration)

  const ToastContainer = () => {
    if (toasts.length === 0) return null

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    )
  }

  return {
    ToastContainer,
    success,
    error,
    info,
  }
}