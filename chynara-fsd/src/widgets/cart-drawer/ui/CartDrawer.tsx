'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, Plus, Minus } from 'lucide-react'
import type { CartApi } from '@/features/cart'
import type { Table } from '@/entities/table'
import { useSubmitOrder } from '@/features/order'

type Props = {
  cart: CartApi
  table: Table | null
  onNeedTable: () => void
}

export function CartDrawer({ cart, table, onNeedTable }: Props) {
  const { submit, sending, error, success, setSuccess } = useSubmitOrder()

  async function handleOrder() {
    if (!table) {
      onNeedTable()
      return
    }
    const ok = await submit(cart.lines, cart.totalPrice, table)
    if (ok) {
      cart.clear()
      setTimeout(() => {
        setSuccess(false)
        cart.close()
      }, 2000)
    }
  }

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={cart.close}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-lg font-bold">Корзина</h2>
                {table && (
                  <p className="text-xs text-[#6B7B6E] mt-0.5">
                    {table.name || `Столик ${table.number}`}
                  </p>
                )}
              </div>
              <button onClick={cart.close} className="p-2 rounded-xl hover:bg-black/5">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.totalCount === 0 ? (
                <p className="text-center text-[#6B7B6E] py-16">Корзина пуста</p>
              ) : (
                cart.lines.map(({ dish, qty }) => (
                  <div key={dish.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F5F0]">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{dish.name}</p>
                      <p className="text-xs text-[#6B7B6E] mt-0.5">
                        {dish.price} с × {qty}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-garden-700">{dish.price * qty} с</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => cart.remove(dish.id)}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        onClick={() => cart.add(dish.id)}
                        className="w-8 h-8 rounded-lg bg-garden-700 text-white flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.totalCount > 0 && (
              <div className="px-6 py-5 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Итого</span>
                  <span className="text-xl font-bold text-garden-700">{cart.totalPrice} с</span>
                </div>
                {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                {success && (
                  <p className="text-xs text-garden-700 text-center font-medium">
                    ✓ Заказ отправлен на кухню!
                  </p>
                )}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={sending}
                  onClick={handleOrder}
                  className="w-full py-3.5 rounded-2xl bg-garden-700 text-white font-semibold text-sm disabled:opacity-60"
                >
                  {sending ? 'Отправка...' : 'Отправить заказ'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
