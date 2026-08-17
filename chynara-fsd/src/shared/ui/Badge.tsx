import { cn } from '@/shared/lib/cn'

export function Badge({
  children,
  variant = 'hit',
}: {
  children: React.ReactNode
  variant?: 'hit' | 'new'
}) {
  return (
    <span
      className={cn(
        'absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white',
        variant === 'hit' ? 'bg-garden-700' : 'bg-garden-600'
      )}
    >
      {children}
    </span>
  )
}
