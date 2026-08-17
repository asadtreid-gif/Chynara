'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Bell, Check, ChefHat, X } from 'lucide-react'
import type { Order, OrderStatus } from '@/entities/order'
import { fetchOrders, updateOrderStatus } from '@/shared/api/orders'

const statusLabel: Record<OrderStatus, string> = {
  new: 'Новый',
  preparing: 'Готовится',
  done: 'Готово',
  cancelled: 'Отменён',
}

const statusColor: Record<OrderStatus, string> = {
  new: 'bg-red-500',
  preparing: 'bg-amber-500',
  done: 'bg-garden-600',
  cancelled: 'bg-gray-400',
}

export default function StaffPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const list = await fetchOrders()
    setOrders(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
    const handler = (e: Event) => {
      const order = (e as CustomEvent<Order>).detail
      setToast(`Новый заказ! Столик ${order.tableNumber}`)
      reload()
      setTimeout(() => setToast(null), 4000)
    }
    window.addEventListener('chynara:new-order', handler)
    // poll every 5s as backup
    const t = setInterval(reload, 5000)
    return () => {
      window.removeEventListener('chynara:new-order', handler)
      clearInterval(t)
    }
  }, [reload])

  async function setStatus(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status)
    reload()
  }

  const newCount = orders.filter((o) => o.status === 'new').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <div className="w-10 h-10 border-4 border-garden-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <header className="bg-garden-900 text-white px-4 sm:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-white/10">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-lg flex items-center gap-2">
              <ChefHat size={20} /> Заказы
              {newCount > 0 && (
                <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-xs font-bold flex items-center justify-center">
                  {newCount}
                </span>
              )}
            </h1>
            <p className="text-xs text-white/50">Дашборд персонала</p>
          </div>
        </div>
        <Link href="/admin" className="px-3 py-2 rounded-xl text-sm bg-white/10 hover:bg-white/20">
          Админка блюд →
        </Link>
      </header>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-garden-700 text-white shadow-lg text-sm font-medium"
          >
            <Bell size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-[#6B7B6E] py-20">Заказов пока нет</p>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-black/5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${statusColor[order.status]}`} />
                  <span className="font-bold text-sm">Столик {order.tableNumber}</span>
                  <span className="text-xs text-[#6B7B6E]">
                    {new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-[#F7F5F0]">
                  {statusLabel[order.status]}
                </span>
              </div>

              <div className="px-4 py-3 space-y-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} <span className="text-[#6B7B6E]">×{item.qty}</span>
                    </span>
                    <span className="font-medium">{item.price * item.qty} с</span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 flex items-center justify-between border-t border-black/5 bg-[#F7F5F0]/50">
                <span className="font-bold text-garden-700">{order.total} с</span>
                <div className="flex gap-2">
                  {order.status === 'new' && (
                    <>
                      <button
                        onClick={() => setStatus(order.id, 'preparing')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold"
                      >
                        <ChefHat size={14} /> Готовить
                      </button>
                      <button
                        onClick={() => setStatus(order.id, 'cancelled')}
                        className="p-1.5 rounded-xl border text-red-500"
                        title="Отменить"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => setStatus(order.id, 'done')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-garden-700 text-white text-xs font-semibold"
                    >
                      <Check size={14} /> Готово
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  )
}
