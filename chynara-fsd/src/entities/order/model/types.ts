export type OrderItem = {
  id: string
  name: string
  price: number
  qty: number
}

export type OrderStatus = 'new' | 'preparing' | 'done' | 'cancelled'

export type Order = {
  id: string
  tableId: string
  tableNumber: number
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
}
