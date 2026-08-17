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

export function CategoryNav({ categories, activeId, onChange }: Props) {
  return (
    <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
      {categories.map((cat) => {
        const active = activeId === cat.id
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(cat.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              active
                ? 'bg-garden-700 text-white shadow-lg shadow-green-900/30'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            )}
          >
            <span className={active ? 'text-garden-300' : 'text-white/50'}>
              {iconMap[cat.icon]}
            </span>
            {cat.name}
          </motion.button>
        )
      })}
    </nav>
  )
}
