'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, LogOut, Lock, Mail, FolderPlus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import type { Dish, Category } from '@/entities/dish'
import {
  fetchAllDishes,
  fetchCategories,
  createDish,
  updateDish,
  deleteDish,
  toggleDishVisibility,
  createCategory,
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
  const [session, setSession] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Dish | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)

  const [creatingCategory, setCreatingCategory] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '' })

  // Создаём клиент только один раз
  const [supabase] = useState(() => createClient())

  async function reload() {
    setLoading(true)
    try {
      const [d, c] = await Promise.all([fetchAllDishes(), fetchCategories()])
      setDishes(d)
      setCategories(c.filter((x) => x.id !== 'all'))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setAuthLoading(false)
      if (session) {
        reload()
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        reload()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoginError('Неверный email или пароль')
      setLoggingIn(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('dishes')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('dishes').getPublicUrl(filePath)
      setForm({ ...form, image: data.publicUrl })
    } catch (error: any) {
      alert('Не удалось загрузить изображение: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  function openCreate() {
    setForm(emptyForm)
    setCreating(true)
    setEditing(null)
  }

  function openEdit(dish: Dish) {
    setForm({
      name: dish.name || '',
      description: dish.description || '',
      price: dish.price || 0,
      categoryId: dish.categoryId || 'hot',
      image: dish.image || '',
      badge: dish.badge || '',
      isAvailable: dish.isAvailable ?? true,
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

  async function handleSaveCategory() {
    if (!categoryForm.id || !categoryForm.name) {
      alert('Заполните ID (латиницей) и название')
      return
    }
    try {
      await createCategory(categoryForm)
      setCreatingCategory(false)
      setCategoryForm({ id: '', name: '' })
      reload()
    } catch (error: any) {
      alert('Ошибка при создании категории: ' + error.message)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0]">
        <div className="w-10 h-10 border-4 border-garden-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-black/5">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">Вход в админку</h1>
            <p className="text-xs text-[#6B7B6E] mt-1">Кафе «Чынара»</p>
          </div>
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs text-center font-medium">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-[#6B7B6E] block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-black/10 text-sm outline-none focus:border-garden-700"
                  placeholder="admin@chynara.kg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#6B7B6E] block mb-1">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-black/10 text-sm outline-none focus:border-garden-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-garden-700 text-white font-semibold text-sm hover:bg-garden-800 transition disabled:opacity-50"
            >
              {loggingIn ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link className="text-xs text-[#6B7B6E] hover:underline" href="/">
              ← На главную сайта
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <header className="bg-garden-900 text-white px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-lg">Админка — Блюда и Категории</h1>
          <p className="text-xs text-white/50">Управление контентом кафе</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link className="px-3 py-2 rounded-xl text-sm bg-white/10 hover:bg-white/20" href="/staff">
            Заказы →
          </Link>
          <button
            onClick={() => setCreatingCategory(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold"
          >
            <FolderPlus size={16} /> Категория
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-garden-700 text-sm font-semibold"
          >
            <Plus size={16} /> Блюдо
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-red-200"
            title="Выйти"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className={`flex items-center gap-3 p-4 rounded-2xl bg-white border shadow-sm ${!dish.isAvailable ? 'opacity-50' : ''}`}
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-garden-100 shrink-0">
              {dish.image ? (
                <img src={dish.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl opacity-30">🍽️</div>
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
                {dish.isAvailable ? <Eye size={18} /> : <EyeOff className="text-red-400" size={18} />}
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

      {/* Модалка создания категории */}
      {creatingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Новая категория</h2>
              <button onClick={() => setCreatingCategory(false)} className="p-2 rounded-xl hover:bg-black/5">
                <X size={18} />
              </button>
            </div>
            <Field label="ID категории (латиницей, например: drinks, salads)">
              <input
                className="input"
                placeholder="drinks"
                value={categoryForm.id}
                onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
              />
            </Field>
            <Field label="Название (например: Напитки, Салаты)">
              <input
                className="input"
                placeholder="Напитки"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </Field>
            <button
              onClick={handleSaveCategory}
              className="w-full py-3 rounded-2xl bg-garden-700 text-white font-semibold text-sm"
            >
              Создать категорию
            </button>
          </motion.div>
        </div>
      )}

      {/* Модалка создания/редактирования блюда */}
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
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Описание">
                <textarea
                  className="input min-h-[60px]"
                  value={form.description || ''}
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
              <Field label="Изображение блюда">
                <div className="space-y-2">
                  <input
                    className="input"
                    value={form.image || ''}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://... или загрузите файл"
                  />
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-sm font-medium transition">
                      <span>{uploading ? 'Загрузка...' : '📁 Выбрать файл'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {form.image && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-gray-50 mt-2">
                      <img src={form.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
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