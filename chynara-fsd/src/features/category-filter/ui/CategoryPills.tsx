'use client'

import { motion } from 'motion/react'
import {
  Leaf, Coffee, Salad, Soup, UtensilsCrossed, CupSoda, CakeSlice,
} from 'lucide-react'
import type { Category } from '@/entities/dish'
import { cn } from '@/shared/lib/cn'

const iconMap: Record<string, React.ReactNode> = {
  leaf: <Leaf size={18} />,
  coffee: <Coffee size={18} />,
  salad: <Salad size={18} />,
  soup: <Soup size={18} />,
  utensils: <UtensilsCrossed size={18} />,
  cup: <CupSoda size={18} />,
  cake: <CakeSlice size={18} />,
}

type Props = {
  categories: Category[]
  activeId: string
  onChange: (id: string) => void
}

export function CategoryPills({ categories, activeId, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      {categories.map((cat) => {
        const active = activeId === cat.id
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(cat.id)}
            className={cn(
              'shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all',
              active
                ? 'bg-garden-700 text-white shadow-md'
                : 'bg-white text-[#1A2A1C] border border-black/5 hover:border-garden-300'
            )}
          >
            <span className={active ? 'text-garden-300' : 'text-[#6B7B6E]'}>
              {iconMap[cat.icon]}
            </span>
            {cat.name}
          </motion.button>
        )
      })}
    </div>
  )
}
