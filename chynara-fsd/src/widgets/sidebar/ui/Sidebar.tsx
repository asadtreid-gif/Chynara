'use client'

import { Leaf } from 'lucide-react'
import { CategoryNav } from '@/features/category-filter'
import type { Category } from '@/entities/dish'
import { SITE } from '@/shared/config/site'
import { cn } from '@/shared/lib/cn'

type Props = {
  categories: Category[]
  activeId: string
  onChange: (id: string) => void
  open: boolean
  onClose: () => void
}

export function Sidebar({ categories, activeId, onChange, open, onClose }: Props) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-[260px] bg-garden-900 text-white flex flex-col',
        'transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="px-6 pt-8 pb-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-garden-300/40 flex items-center justify-center bg-white/5">
            <Leaf size={22} className="text-garden-300" />
          </div>
          <div>
            <p className="font-bold text-lg tracking-wide">{SITE.name.toUpperCase()}</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50">Кафе Ресторан</p>
          </div>
        </div>
      </div>

      <CategoryNav
        categories={categories}
        activeId={activeId}
        onChange={(id) => {
          onChange(id)
          onClose()
        }}
      />

      <div className="p-4 shrink-0 mt-auto">
        <div className="rounded-2xl bg-garden-700 p-4 text-center">
          <Leaf size={20} className="mx-auto text-garden-300 mb-2" />
          <p className="text-sm font-semibold">Свежие ингредиенты</p>
          <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
            Мы используем только свежие и натуральные продукты каждый день
          </p>
        </div>
      </div>
    </aside>
  )
}
