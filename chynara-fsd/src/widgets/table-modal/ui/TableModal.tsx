'use client'

import { motion, AnimatePresence } from 'motion/react'
import type { Table } from '@/entities/table'
import { SITE } from '@/shared/config/site'

type Props = {
  open: boolean
  tables: Table[]
  selectedId?: string
  onSelect: (t: Table) => void
  canClose?: boolean
  onClose?: () => void
}

export function TableModal({ open, tables, selectedId, onSelect, canClose, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={() => canClose && onClose?.()}
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-7 pb-4 text-center border-b border-black/5">
              <div className="mx-auto mb-2 w-12 h-12 rounded-full border-2 border-garden-300 flex items-center justify-center text-2xl">
                🌿
              </div>
              <h2 className="text-2xl font-bold text-garden-700">{SITE.name}</h2>
              <p className="text-xs tracking-[0.25em] uppercase mt-1 text-garden-600">
                Выберите ваш столик
              </p>
            </div>
            <div className="px-6 py-6">
              {tables.length === 0 ? (
                <p className="text-center text-sm opacity-50 py-4">Столики не настроены</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {tables.map((table) => {
                    const active = selectedId === table.id
                    return (
                      <motion.button
                        key={table.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(table)}
                        className="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center font-medium transition-colors"
                        style={
                          active
                            ? { backgroundColor: '#1B5E3B', borderColor: '#1B5E3B', color: '#fff' }
                            : { backgroundColor: '#F7F5F0', borderColor: '#E0EBE3', color: '#1B5E3B' }
                        }
                      >
                        <span className="text-sm">{table.name || `№ ${table.number}`}</span>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>
            {canClose && (
              <div className="px-6 pb-6">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl text-sm font-medium border border-black/10"
                >
                  Закрыть
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
