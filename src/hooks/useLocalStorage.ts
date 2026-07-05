'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, fallback: T) {
  const [stored, setStored] = useState<T>(fallback)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) setStored(JSON.parse(item) as T)
    } catch {
      // storage indisponível
    }
  }, [key])

  const persist = (newValue: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue))
    } catch {
      // storage indisponível
    }
    setStored(newValue)
  }

  return [stored, persist] as const
}