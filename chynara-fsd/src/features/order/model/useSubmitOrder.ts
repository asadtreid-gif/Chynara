'use client'

import { useState, useCallback } from 'react'
import { createOrder } from '@/shared/api/orders'
import type { Dish } from '@/entities/dish'
import type { Table } from '@/entities/table'

export function useSubmitOrder() {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = useCallback(
    async (
      lines: { dish: Dish; qty: number }[],
      total: number,
      table: Table | null
    ) => {
      if (!table) {
        setError('Выберите столик')
        return false
      }
      if (lines.length === 0) {
        setError('Корзина пуста')
        return false
      }
      setSending(true)
      setError('')
      setSuccess(false)
      try {
        await createOrder({
          tableId: table.id,
          tableNumber: table.number,
          items: lines.map(({ dish, qty }) => ({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            qty,
          })),
          total,
        })
        setSuccess(true)
        return true
      } catch (e: any) {
        setError(e?.message || 'Ошибка отправки')
        return false
      } finally {
        setSending(false)
      }
    },
    []
  )

  return { submit, sending, error, success, setSuccess, setError }
}
