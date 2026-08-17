import type { Category, Dish } from '@/entities/dish'
import { load, save } from './storage'

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'Все блюда', icon: 'leaf' },
  { id: 'breakfast', name: 'Завтраки', icon: 'coffee' },
  { id: 'salads', name: 'Салаты', icon: 'salad' },
  { id: 'soups', name: 'Супы', icon: 'soup' },
  { id: 'hot', name: 'Горячие блюда', icon: 'utensils' },
  { id: 'drinks', name: 'Напитки', icon: 'cup' },
  { id: 'desserts', name: 'Десерты', icon: 'cake' },
]

const DEFAULT_DISHES: Dish[] = [
  {
    id: 'd1', categoryId: 'salads', name: 'Салат «Чынара»',
    description: 'Свежие овощи, зелень, фирменный соус', price: 250, badge: 'hit', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  },
  {
    id: 'd2', categoryId: 'soups', name: 'Шорпо',
    description: 'Наваристый мясной бульон с овощами', price: 280, badge: 'new', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  },
  {
    id: 'd3', categoryId: 'hot', name: 'Плов «Ошский»',
    description: 'Ароматный плов с бараниной', price: 390, badge: 'hit', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8061d0f9d?w=600&q=80',
  },
  {
    id: 'd4', categoryId: 'desserts', name: 'Чизкейк',
    description: 'Нежный сливочный чизкейк с ягодами', price: 280, badge: 'new', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&q=80',
  },
  {
    id: 'd5', categoryId: 'hot', name: 'Манты с мясом',
    description: 'Классические паровые манты', price: 199, badge: 'hit', isAvailable: true,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
  },
  {
    id: 'd6', categoryId: 'hot', name: 'Куурдак',
    description: 'Традиционное жаркое из мяса', price: 380, isAvailable: true,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',
  },
  {
    id: 'd7', categoryId: 'hot', name: 'Бешбармак',
    description: 'С домашней лапшой', price: 420, isAvailable: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  },
  {
    id: 'd8', categoryId: 'drinks', name: 'Капучино',
    description: 'Классический', price: 180, isAvailable: true,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80',
  },
  {
    id: 'd9', categoryId: 'breakfast', name: 'Сырники',
    description: 'Со сметаной или вареньем', price: 220, isAvailable: true,
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80',
  },
  {
    id: 'd10', categoryId: 'salads', name: 'Цезарь с курицей',
    description: 'Классический с крутонами', price: 320, isAvailable: true,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
  },
]

function getDishes(): Dish[] {
  return load<Dish[]>('dishes', DEFAULT_DISHES)
}

function setDishes(list: Dish[]) {
  save('dishes', list)
}

export async function fetchCategories(): Promise<Category[]> {
  return DEFAULT_CATEGORIES
}

/** Только доступные блюда (для гостевого меню) */
export async function fetchDishes(): Promise<Dish[]> {
  return getDishes().filter((d) => d.isAvailable)
}

/** Все блюда включая скрытые (для админки) */
export async function fetchAllDishes(): Promise<Dish[]> {
  return getDishes()
}

export async function fetchMenu() {
  const [categories, dishes] = await Promise.all([fetchCategories(), fetchDishes()])
  return { categories, dishes }
}

export async function createDish(data: Omit<Dish, 'id'>): Promise<Dish> {
  const list = getDishes()
  const dish: Dish = { ...data, id: 'd' + Date.now() }
  list.push(dish)
  setDishes(list)
  return dish
}

export async function updateDish(id: string, patch: Partial<Dish>): Promise<Dish | null> {
  const list = getDishes()
  const i = list.findIndex((d) => d.id === id)
  if (i < 0) return null
  list[i] = { ...list[i], ...patch, id }
  setDishes(list)
  return list[i]
}

export async function deleteDish(id: string): Promise<boolean> {
  const list = getDishes().filter((d) => d.id !== id)
  setDishes(list)
  return true
}

export async function toggleDishVisibility(id: string): Promise<Dish | null> {
  const list = getDishes()
  const i = list.findIndex((d) => d.id === id)
  if (i < 0) return null
  list[i] = { ...list[i], isAvailable: !list[i].isAvailable }
  setDishes(list)
  return list[i]
}
