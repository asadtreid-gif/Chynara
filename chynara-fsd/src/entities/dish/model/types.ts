export type DishBadge = 'hit' | 'new'

export type Category = {
  id: string
  name: string
  icon: string
}

export type Dish = {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image?: string
  badge?: DishBadge
  isAvailable: boolean
}
