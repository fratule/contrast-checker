import { useState, useEffect } from 'react'

export interface HistoryEntry {
  id: string
  color1: string
  color2: string
  contrast: number
  created_at: string
}

interface UseHistoryReturn {
  history: HistoryEntry[]
  isLoading: boolean
  error: string | null
  addToHistory: (textColor: string, backgroundColor: string, contrastRatio: number) => Promise<boolean>
  removeHistoryItem: (id: string) => Promise<boolean>
  clearHistory: () => Promise<boolean>
  retry: () => void
}

const STORAGE_KEY = 'contrast-ratio-history'

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const storedHistory = localStorage.getItem(STORAGE_KEY)
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory)
        setHistory(parsedHistory.sort((a: HistoryEntry, b: HistoryEntry) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
      } else {
        setHistory([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch history'
      setError(errorMessage)
      console.error('Error fetching history:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const saveToLocalStorage = (history: HistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (err) {
      console.error('Error saving to localStorage:', err)
    }
  }

  const addToHistory = async (textColor: string, backgroundColor: string, contrastRatio: number): Promise<boolean> => {
    try {
      setError(null)
      
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        color1: textColor,
        color2: backgroundColor,
        contrast: contrastRatio,
        created_at: new Date().toISOString()
      }
      
      const updatedHistory = [newEntry, ...history]
      setHistory(updatedHistory)
      saveToLocalStorage(updatedHistory)
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save to history'
      setError(errorMessage)
      console.error('Error adding to history:', err)
      return false
    }
  }

  const removeHistoryItem = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const updatedHistory = history.filter((item) => item.id !== id)
      setHistory(updatedHistory)
      saveToLocalStorage(updatedHistory)
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item'
      setError(errorMessage)
      console.error('Error removing history item:', err)
      return false
    }
  }

  const clearHistory = async (): Promise<boolean> => {
    try {
      setError(null)
      
      setHistory([])
      saveToLocalStorage([])
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear history'
      setError(errorMessage)
      console.error('Error clearing history:', err)
      return false
    }
  }

  const retry = () => {
    fetchHistory()
  }

  return {
    history,
    isLoading,
    error,
    addToHistory,
    removeHistoryItem,
    clearHistory,
    retry,
  }
}