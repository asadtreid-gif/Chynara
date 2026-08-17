'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Dish } from '@/entities/dish'

export function useCart(dishes: Dish[]) {
  const [items, setItems] = useState<Record<string, number>>({})
  const [isOpen, setIsOpen] = useState(false)

  const add = useCallback((id: string) => {
    setItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = { ...prev }
      if (!next[id]) return prev
      if (next[id] <= 1) delete next[id]
      else next[id] -= 1
      return next
    })
  }, [])

  const clear = useCallback(() => setItems({}), [])

  const totalCount = useMemo(
    () => Object.values(items).reduce((s, n) => s + n, 0),
    [items]
  )

  const totalPrice = useMemo(
    () =>
      Object.entries(items).reduce((s, [id, qty]) => {
        const dish = dishes.find((d) => d.id === id)
        return s + (dish ? dish.price * qty : 0)
      }, 0),
    [items, dishes]
  )

  const lines = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => {
          const dish = dishes.find((d) => d.id === id)
          if (!dish) return null
          return { dish, qty }
        })
        .filter(Boolean) as { dish: Dish; qty: number }[],
    [items, dishes]
  )

  return {
    items,
    lines,
    totalCount,
    totalPrice,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add,
    remove,
    clear,
    qtyOf: (id: string) => items[id] || 0,
  }
}

export type CartApi = ReturnType<typeof useCart>
