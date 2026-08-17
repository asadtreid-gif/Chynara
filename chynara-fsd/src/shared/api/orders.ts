import type { Order, OrderItem, OrderStatus } from '@/entities/order'
import { load, save } from './storage'

function getOrders(): Order[] {
  return load<Order[]>('orders', [])
}

function setOrders(list: Order[]) {
  save('orders', list)
}

export async function fetchOrders(): Promise<Order[]> {
  return getOrders().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function createOrder(input: {
  tableId: string
  tableNumber: number
  items: OrderItem[]
  total: number
}): Promise<Order> {
  const order: Order = {
    id: 'o' + Date.now(),
    tableId: input.tableId,
    tableNumber: input.tableNumber,
    items: input.items,
    total: input.total,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  const list = getOrders()
  list.unshift(order)
  setOrders(list)
  // уведомление для staff (простой event)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chynara:new-order', { detail: order }))
  }
  return order
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const list = getOrders()
  const i = list.findIndex((o) => o.id === id)
  if (i < 0) return null
  list[i] = { ...list[i], status }
  setOrders(list)
  return list[i]
}
