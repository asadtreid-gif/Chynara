'use client'

import { motion } from 'motion/react'
import { Leaf, UtensilsCrossed, MapPin } from 'lucide-react'

export function PromoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-12 rounded-3xl overflow-hidden bg-garden-700 text-white relative"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative z-10 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold">
          Уютная атмосфера
          <br />и вкусная еда
        </h3>
        <p className="text-sm text-white/70 mt-2 max-w-md">
          Приходите к нам и наслаждайтесь каждым моментом
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-white/80">
          <span className="flex items-center gap-1.5"><Leaf size={14} /> Свежие продукты</span>
          <span className="flex items-center gap-1.5"><UtensilsCrossed size={14} /> Опытные повара</span>
          <span className="flex items-center gap-1.5"><MapPin size={14} /> Уютная атмосфера</span>
        </div>
      </div>
    </motion.div>
  )
}
