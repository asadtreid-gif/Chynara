'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight } from 'lucide-react'

import { fetchMenu } from '@/shared/api/menu'
import type { Category, Dish } from '@/entities/dish'
import { useCart } from '@/features/cart'
import { useTableSelect } from '@/features/table-select'
import { CategoryPills } from '@/features/category-filter'
import { SearchInput } from '@/features/search'
import { Sidebar } from '@/widgets/sidebar'
import { Header } from '@/widgets/header'
import { DishGrid } from '@/widgets/dish-grid'
import { PromoBanner } from '@/widgets/promo-banner'
import { CartDrawer } from '@/widgets/cart-drawer'
import { CartBar } from '@/widgets/cart-bar'
import { TableModal } from '@/widgets/table-modal'
import { AboutModal } from '@/widgets/about-modal'

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const cart = useCart(dishes)
  const tableSelect = useTableSelect()

  useEffect(() => {
    fetchMenu().then(({ categories, dishes }) => {
      setCategories(categories)
      setDishes(dishes)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      const matchCat = activeCat === 'all' || d.categoryId === activeCat
      const q = search.toLowerCase()
      const matchSearch =
        !q || d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [dishes, activeCat, search])

  const tableLabel = tableSelect.selected
    ? tableSelect.selected.name || `Столик ${tableSelect.selected.number}`
    : undefined

  if (loading || !tableSelect.ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-garden-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#6B7B6E]">Загружаем меню...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#F7F5F0]">
      <Sidebar
        categories={categories}
        activeId={activeCat}
        onChange={setActiveCat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* main shifted on desktop for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        <Header
          totalCount={cart.totalCount}
          tableLabel={tableLabel}
          onOpenCart={cart.open}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAbout={() => setAboutOpen(true)}
          onChangeTable={tableSelect.openModal}
        />

        <main
          className={`flex-1 px-4 sm:px-8 py-6 overflow-y-auto ${
            cart.totalCount > 0 && !cart.isOpen ? 'pb-28' : 'pb-10'
          }`}
        >
          <div className="mb-6">
            <SearchInput value={search} onChange={setSearch} />
          </div>
          <div className="mb-8">
            <CategoryPills categories={categories} activeId={activeCat} onChange={setActiveCat} />
          </div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1A2A1C]">
              {activeCat === 'all'
                ? 'Популярные блюда'
                : categories.find((c) => c.id === activeCat)?.name}
            </h2>
            <button className="text-sm text-garden-700 font-medium flex items-center gap-1 hover:underline">
              Смотреть все <ChevronRight size={16} />
            </button>
          </div>
          <DishGrid
            dishes={filtered}
            qtyOf={cart.qtyOf}
            onAdd={cart.add}
            onRemove={cart.remove}
          />
          <PromoBanner />
        </main>
      </div>

      {/* маленькое окно снизу */}
      <CartBar cart={cart} tableLabel={tableLabel} />

      <CartDrawer
        cart={cart}
        table={tableSelect.selected}
        onNeedTable={tableSelect.openModal}
      />

      <TableModal
        open={tableSelect.showModal}
        tables={tableSelect.tables}
        selectedId={tableSelect.selected?.id}
        onSelect={tableSelect.select}
        canClose={!!tableSelect.selected}
        onClose={() => tableSelect.setShowModal(false)}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
