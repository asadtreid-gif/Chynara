'use client'

import { motion } from 'motion/react'
import { cn } from '@/shared/lib/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: Props) {
  const base =
    'inline-flex items-center justify-center font-semibold transition focus:outline-none disabled:opacity-50'

  const variants = {
    primary: 'bg-garden-700 text-white shadow-soft hover:bg-garden-800',
    secondary: 'bg-white text-garden-700 border border-black/10 hover:bg-garden-50',
    ghost: 'text-garden-700 hover:bg-black/5',
    icon: 'bg-garden-700 text-white shadow-md',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-4 py-2.5 text-sm rounded-2xl',
    lg: 'px-6 py-3.5 text-sm rounded-2xl',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
