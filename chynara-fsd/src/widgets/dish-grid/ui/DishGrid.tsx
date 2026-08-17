'use client'

import { AnimatePresence } from 'motion/react'
import { DishCard, type Dish } from '@/entities/dish'

type Props = {
  dishes: Dish[]
  qtyOf: (id: string) => number
  onAdd: (id: string) => void
  onRemove: (id: string) => void
}

export function DishGrid({ dishes, qtyOf, onAdd, onRemove }: Props) {
  if (dishes.length === 0) {
    return <p className="text-center text-[#6B7B6E] py-16">Ничего не найдено</p>
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
      <AnimatePresence mode="popLayout">
        {dishes.map((dish, i) => (
          <DishCard
            key={dish.id}
            dish={dish}
            qty={qtyOf(dish.id)}
            index={i}
            onAdd={() => onAdd(dish.id)}
            onRemove={() => onRemove(dish.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
