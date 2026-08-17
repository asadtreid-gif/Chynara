import type { Table } from '@/entities/table'
import { load, save } from './storage'

const DEFAULT_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: 't' + (i + 1),
  number: i + 1,
  name: `Столик ${i + 1}`,
  isActive: true,
}))

export async function fetchTables(): Promise<Table[]> {
  return load<Table[]>('tables', DEFAULT_TABLES).filter((t) => t.isActive)
}

export function getSelectedTable(): Table | null {
  return load<Table | null>('selected_table', null)
}

export function setSelectedTable(table: Table | null) {
  save('selected_table', table)
}
