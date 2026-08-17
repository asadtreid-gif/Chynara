'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, MapPin, Phone, Clock, Instagram } from 'lucide-react'
import { SITE } from '@/shared/config/site'

type Props = { open: boolean; onClose: () => void }

export function AboutModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-x-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-garden-700 text-white px-6 pt-6 pb-5 relative">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10">
                <X size={18} />
              </button>
              <p className="text-2xl font-bold">{SITE.name}</p>
              <p className="text-sm text-white/70 mt-1">{SITE.tagline}</p>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-garden-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Адрес</p>
                  <p className="text-[#6B7B6E]">{SITE.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-garden-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Телефон</p>
                  <a href={`tel:+${SITE.whatsapp}`} className="text-garden-700 hover:underline">
                    {SITE.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-garden-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Часы работы</p>
                  <p className="text-[#6B7B6E]">Ежедневно 07:00 – 00:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Instagram size={18} className="text-garden-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Instagram</p>
                  <a
                    href={`https://instagram.com/${SITE.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-garden-700 hover:underline"
                  >
                    @{SITE.instagram}
                  </a>
                </div>
              </div>
              <p className="text-xs text-[#6B7B6E] pt-2 border-t border-black/5">
                Халяль • Намазкана • Доставка через Яндекс
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
