'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, Save, X } from 'lucide-react'
import type { Dish, Category } from '@/entities/dish'
import {
  fetchAllDishes,
  fetchCategories,
  createDish,
  updateDish,
  deleteDish,
  toggleDishVisibility,
} from '@/shared/api/menu'

const emptyForm = {
  name: '',
  description: '',
  price: 0,
  categoryId: 'hot',
  image: '',
  badge: '' as '' | 'hit' | 'new',
  isAvailable: true,
}

export default function AdminPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Dish | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function reload() {
    const [d, c] = await Promise.all([fetchAllDishes(), fetchCategories()])
    setDishes(d)
    setCategories(c.filter((x) => x.id !== 'all'))
    setLoading(false)
  }

  useEffect(() => {
    reload()
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setCreating(true)
    setEditing(null)
  }

  function openEdit(dish: Dish) {
    setForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      categoryId: dish.categoryId,
      image: dish.image || '',
      badge: dish.badge || '',
      isAvailable: dish.isAvailable,
    })
    setEditing(dish)
    setCreating(false)
  }

  function closeForm() {
    setEditing(null)
    setCreating(false)
  }

  async function handleSave() {
    if (!form.name || form.price <= 0) {
      alert('Укажите название и цену')
      return
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      categoryId: form.categoryId,
      image: form.image || undefined,
      badge: (form.badge || undefined) as 'hit' | 'new' | undefined,
      isAvailable: form.isAvailable,
    }
    if (creating) {
      await createDish(payload)
    } else if (editing) {
      await updateDish(editing.id, payload)
    }
    closeForm()
    reload()
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить блюдо?')) return
    await deleteDish(id)
    reload()
  }

  async function handleToggle(id: string) {
    await toggleDishVisibility(id)
    reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <div className="w-10 h-10 border-4 border-garden-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <header className="bg-garden-900 text-white px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-white/10">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-lg">Админка — Блюда</h1>
            <p className="text-xs text-white/50">Добавление, изменение, скрытие</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/staff"
            className="px-3 py-2 rounded-xl text-sm bg-white/10 hover:bg-white/20"
          >
            Заказы →
          </Link>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-garden-700 text-sm font-semibold"
          >
            <Plus size={16} /> Добавить
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className={`flex items-center gap-3 p-4 rounded-2xl bg-white border shadow-sm ${
              !dish.isAvailable ? 'opacity-50' : ''
            }`}
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-garden-100 shrink-0">
              {dish.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dish.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl opacity-30">🍽</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{dish.name}</p>
              <p className="text-xs text-[#6B7B6E] truncate">{dish.description}</p>
              <p className="text-sm font-bold text-garden-700 mt-0.5">{dish.price} с</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleToggle(dish.id)}
                className="p-2 rounded-xl hover:bg-black/5"
                title={dish.isAvailable ? 'Скрыть' : 'Показать'}
              >
                {dish.isAvailable ? <Eye size={18} /> : <EyeOff size={18} className="text-red-400" />}
              </button>
              <button onClick={() => openEdit(dish)} className="p-2 rounded-xl hover:bg-black/5" title="Изменить">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(dish.id)} className="p-2 rounded-xl hover:bg-red-50 text-red-500" title="Удалить">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Form modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold">{creating ? 'Новое блюдо' : 'Редактировать'}</h2>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-black/5">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <Field label="Название">
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Описание">
                <textarea
                  className="input min-h-[60px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
              <Field label="Цена (сом)">
                <input
                  type="number"
                  className="input"
                  value={form.price || ''}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </Field>
              <Field label="Категория">
                <select
                  className="input"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="URL картинки">
                <input
                  className="input"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Бейдж">
                <select
                  className="input"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value as any })}
                >
                  <option value="">Нет</option>
                  <option value="hit">Хит</option>
                  <option value="new">Новинка</option>
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                />
                Показывать в меню
              </label>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-garden-700 text-white font-semibold text-sm"
              >
                <Save size={16} /> Сохранить
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          ring: 2px;
          border-color: #1b5e3b;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="text-[#6B7B6E] mb-1 block">{label}</span>
      {children}
    </label>
  )
}
