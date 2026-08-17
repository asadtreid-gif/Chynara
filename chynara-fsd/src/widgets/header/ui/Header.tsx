'use client'

import { Menu, ShoppingCart } from 'lucide-react'
import { motion } from 'motion/react'

type Props = {
  totalCount: number
  tableLabel?: string
  onOpenCart: () => void
  onOpenSidebar: () => void
  onOpenAbout: () => void
  onChangeTable?: () => void
}

export function Header({
  totalCount,
  tableLabel,
  onOpenCart,
  onOpenSidebar,
  onOpenAbout,
  onChangeTable,
}: Props) {
  return (
    <header className="sticky top-0 z-20 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-black/5 px-4 sm:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button className="lg:hidden p-2 rounded-xl hover:bg-black/5 shrink-0" onClick={onOpenSidebar}>
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-[#1A2A1C] truncate">Наше меню</h1>
            <p className="text-xs text-[#6B7B6E] hidden sm:block">
              Блюда, приготовленные с любовью из свежих ингредиентов
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {tableLabel && (
            <button
              onClick={onChangeTable}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-black/10 text-[11px] sm:text-xs font-medium hover:bg-white transition max-w-[7.5rem] sm:max-w-none truncate"
            >
              <span className="truncate">{tableLabel}</span>
            </button>
          )}
          <button
            onClick={onOpenAbout}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 text-sm font-medium hover:bg-white transition"
          >
            О ресторане
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-garden-700 text-white text-sm font-semibold shadow-soft"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Корзина</span>
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-garden-300 text-garden-900 text-[11px] font-bold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  )
}
