const PREFIX = 'chynara_'

export function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}
