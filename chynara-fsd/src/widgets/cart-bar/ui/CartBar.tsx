'use client'

import { motion, AnimatePresence } from 'motion/react'
import type { CartApi } from '@/features/cart'

type Props = {
  cart: CartApi
  tableLabel?: string
}

export function CartBar({ cart, tableLabel }: Props) {
  return (
    <AnimatePresence>
      {cart.totalCount > 0 && !cart.isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-2 lg:left-[260px]"
        >
          <button
            onClick={cart.open}
            className="w-full max-w-lg mx-auto flex items-center justify-between gap-3 rounded-2xl bg-garden-700 text-white px-5 py-3.5 shadow-2xl"
          >
            <div className="text-left min-w-0">
              <p className="text-xs opacity-80">
                {cart.totalCount}{' '}
                {cart.totalCount === 1 ? 'блюдо' : cart.totalCount < 5 ? 'блюда' : 'блюд'}
                {tableLabel ? ` · ${tableLabel}` : ''}
              </p>
              <p className="text-lg font-bold leading-tight">{cart.totalPrice} с</p>
            </div>
            <span className="shrink-0 px-4 py-2 rounded-xl bg-white text-garden-700 text-sm font-semibold">
              Заказ
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
