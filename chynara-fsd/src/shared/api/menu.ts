import { createClient } from '@/utils/supabase/client'
import type { Category, Dish } from '@/entities/dish'

function mapDbDish(row: any): Dish {
  return {
    id: String(row.id),
    categoryId: row.category_id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price),
    image: row.image || '',
    badge: row.badge || undefined,
    isAvailable: row.is_available ?? true,
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('categories').select('*')

  if (error) {
    console.error('Ошибка загрузки категорий:', error.message)
    return []
  }


  return data.map((c) => ({
    id: String(c.id),
    name: c.name,
    icon: c.icon || 'leaf',
  }))
}

export async function fetchDishes(): Promise<Dish[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)

  if (error) {
    console.error('Ошибка загрузки меню:', error.message)
    return []
  }

  return data.map(mapDbDish)
}

export async function fetchAllDishes(): Promise<Dish[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Ошибка загрузки всех блюд:', error.message)
    return []
  }

  return data.map(mapDbDish)
}

export async function fetchMenu() {
  const [categories, dishes] = await Promise.all([fetchCategories(), fetchDishes()])
  return { categories, dishes }
}

export async function createDish(data: Omit<Dish, 'id'>): Promise<Dish | null> {
  const supabase = createClient()

  const payload = {
    category_id: data.categoryId,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    badge: data.badge || null,
    is_available: data.isAvailable,
  }

  const { data: inserted, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error('Ошибка создания блюда:', error.message)
    alert('Не удалось создать блюдо: ' + error.message)
    return null
  }

  return mapDbDish(inserted)
}

export async function createCategory(payload: { id: string; name: string }) {
  const supabase = createClient()
  const { error } = await supabase.from('categories').insert([payload])
  if (error) throw error
}

export async function updateDish(id: string, patch: Partial<Dish>): Promise<Dish | null> {
  const supabase = createClient()

  const payload: any = {}
  if (patch.categoryId !== undefined) payload.category_id = patch.categoryId
  if (patch.name !== undefined) payload.name = patch.name
  if (patch.description !== undefined) payload.description = patch.description
  if (patch.price !== undefined) payload.price = patch.price
  if (patch.image !== undefined) payload.image = patch.image
  if (patch.badge !== undefined) payload.badge = patch.badge || null
  if (patch.isAvailable !== undefined) payload.is_available = patch.isAvailable

  const { data: updated, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Ошибка обновления блюда:', error.message)
    alert('Не удалось обновить блюдо: ' + error.message)
    return null
  }

  return mapDbDish(updated)
}

export async function deleteDish(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    console.error('Ошибка удаления блюда:', error.message)
    alert('Не удалось удалить блюдо: ' + error.message)
    return false
  }

  return true
}

export async function toggleDishVisibility(id: string): Promise<Dish | null> {
  const supabase = createClient()

  const { data: current, error: fetchError } = await supabase
    .from('products')
    .select('is_available')
    .eq('id', id)
    .single()

  if (fetchError || !current) {
    console.error('Не удалось найти блюдо для переключения')
    return null
  }

  const newStatus = !current.is_available

  const { data: updated, error } = await supabase
    .from('products')
    .update({ is_available: newStatus })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Ошибка изменения видимости:', error.message)
    return null
  }

  return mapDbDish(updated)
}