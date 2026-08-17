'use client'

import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Поиск блюд...' }: Props) {
  return (
    <div className="relative max-w-md">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7B6E]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-black/5 text-sm outline-none focus:ring-2 focus:ring-garden-700/30 shadow-sm"
      />
    </div>
  )
}
