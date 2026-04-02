import { useState, useCallback } from 'react'

const STORAGE_KEY = 'olympics-watchlist'

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function save(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function exportWatchlist(ids: Set<string>): string {
  const json = JSON.stringify([...ids])
  return btoa(json)
}

export function importWatchlist(blob: string): Set<string> {
  const json = atob(blob.trim())
  const arr = JSON.parse(json)
  if (!Array.isArray(arr) || !arr.every(v => typeof v === 'string')) {
    throw new Error('Invalid watchlist data')
  }
  return new Set(arr as string[])
}

export function useWatchlist() {
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(load)

  const toggle = useCallback((id: string) => {
    setWatchlistIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      save(next)
      return next
    })
  }, [])

  const replaceAll = useCallback((ids: Set<string>) => {
    save(ids)
    setWatchlistIds(ids)
  }, [])

  const addMany = useCallback((ids: Set<string>) => {
    setWatchlistIds(prev => {
      const next = new Set([...prev, ...ids])
      save(next)
      return next
    })
  }, [])

  const isWatched = useCallback(
    (id: string) => watchlistIds.has(id),
    [watchlistIds]
  )

  return { watchlistIds, toggle, replaceAll, addMany, isWatched }
}
