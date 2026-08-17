'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Table } from '@/entities/table'
import { fetchTables, getSelectedTable, setSelectedTable } from '@/shared/api/tables'

export function useTableSelect() {
  const [tables, setTables] = useState<Table[]>([])
  const [selected, setSelected] = useState<Table | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetchTables().then((list) => {
      setTables(list)
      const saved = getSelectedTable()
      const stillValid = saved && list.some((t) => t.id === saved.id)
      if (stillValid) {
        setSelected(saved)
      } else {
        setShowModal(true)
      }
      setReady(true)
    })
  }, [])

  const select = useCallback((table: Table) => {
    setSelected(table)
    setSelectedTable(table)
    setShowModal(false)
  }, [])

  const openModal = useCallback(() => setShowModal(true), [])

  return { tables, selected, showModal, ready, select, openModal, setShowModal }
}
