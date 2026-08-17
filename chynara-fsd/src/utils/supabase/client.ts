import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.error("ОШИБКА: Ключи Supabase не найдены! Проверь .env.local")
  }
  
  return createBrowserClient(url!, key!)
}