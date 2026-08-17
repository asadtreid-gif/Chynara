'use client'

import { motion } from 'motion/react'
import { Plus, Minus } from 'lucide-react'
import type { Dish } from '../model/types'
import { Badge } from '@/shared/ui'

type Props = {
  dish: Dish
  qty: number
  index?: number
  onAdd: () => void
  onRemove: () => void
}

export function DishCard({ dish, qty, index = 0, onAdd, onRemove }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl overflow-hidden shadow-soft border border-black/5"
    >
      <div className="relative h-32 sm:h-44 overflow-hidden">
        {dish.image ? (
          <motion.img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <div className="w-full h-full bg-garden-100 flex items-center justify-center text-4xl opacity-30">🍽</div>
        )}
        {dish.badge && (
          <Badge variant={dish.badge}>{dish.badge === 'hit' ? 'Хит' : 'Новинка'}</Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[15px] leading-snug">{dish.name}</h3>
        <p className="text-xs text-[#6B7B6E] mt-1 line-clamp-2 leading-relaxed">{dish.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-garden-700">{dish.price} с</span>

          {qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onAdd}
              className="w-9 h-9 rounded-xl bg-garden-700 text-white flex items-center justify-center shadow-md"
            >
              <Plus size={18} />
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.9 }} onClick={onRemove} className="w-8 h-8 rounded-lg border flex items-center justify-center">
                <Minus size={14} />
              </motion.button>
              <span className="font-semibold text-sm min-w-[1.25rem] text-center">{qty}</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onAdd} className="w-8 h-8 rounded-lg bg-garden-700 text-white flex items-center justify-center">
                <Plus size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
