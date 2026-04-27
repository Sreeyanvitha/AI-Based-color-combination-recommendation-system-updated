import { useState, useEffect } from 'react'
import { Bookmark, Trash2, X, BookmarkX } from 'lucide-react'
import { getSavedPalettes, deleteSavedPalette } from '../utils/colors.js'
import SwatchDot from './SwatchDot.jsx'
import toast from 'react-hot-toast'

export default function SavedPalettes({ open, onClose }) {
  const [palettes, setPalettes] = useState([])

  useEffect(() => {
    if (open) setPalettes(getSavedPalettes())
  }, [open])

  const handleDelete = (id) => {
    deleteSavedPalette(id)
    setPalettes(getSavedPalettes())
    toast.success('Palette removed')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-sm h-full bg-cream dark:bg-ink border-l border-gold/15 shadow-2xl
                      overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-cream/95 dark:bg-ink/95 backdrop-blur-sm border-b border-gold/10
                        flex items-center justify-between px-5 py-4 z-10">
          <div className="flex items-center gap-2">
            <Bookmark size={15} className="text-gold" />
            <span className="font-display text-base font-medium text-ink dark:text-cream">Saved Palettes</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-gold/20 flex items-center
                                               justify-center hover:border-gold transition-all text-warm">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 flex-1">
          {palettes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
              <BookmarkX size={32} className="text-gold/30" />
              <p className="text-sm text-warm/60">No saved palettes yet.</p>
              <p className="text-xs text-warm/40">Click the heart icon on any palette to save it.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {palettes.map((p) => (
                <div key={p.id} className="card p-4 group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-ink dark:text-cream">{p.name}</p>
                      <p className="text-[10px] text-warm/50 mt-0.5">
                        {new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:bg-red-50
                                 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {p.colors.map((c, i) => (
                      <SwatchDot key={i} hex={c.hex} size={32} label />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
