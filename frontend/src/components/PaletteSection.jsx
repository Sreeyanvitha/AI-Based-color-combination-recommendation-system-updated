import { useState } from 'react'
import { Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react'
import ColorCard from './ColorCard.jsx'
import SwatchDot from './SwatchDot.jsx'
import { savePalette } from '../utils/colors.js'
import toast from 'react-hot-toast'

export default function PaletteSection({ type, icon, palette, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    savePalette(palette.colors, `${palette.name} — ${new Date().toLocaleDateString()}`)
    setSaved(true)
    toast.success('Palette saved!')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="card p-5 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{icon}</span>
            <span className="text-[10px] tracking-widest uppercase text-gold font-medium">{type}</span>
          </div>
          <h3 className="font-display text-lg text-ink dark:text-cream font-medium">{palette.name}</h3>
          <p className="text-xs text-warm/70 mt-1 leading-relaxed max-w-lg">{palette.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          {/* Quick color preview */}
          <div className="flex -space-x-1.5 mr-2">
            {palette.colors.slice(0, 4).map((c, i) => (
              <SwatchDot key={i} hex={c.hex} size={22} />
            ))}
          </div>
          <button
            onClick={handleSave}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200
              ${saved ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-500'
                      : 'border-gold/20 hover:border-gold hover:bg-gold/5 text-warm dark:text-gold/60'}`}
            title="Save palette"
          >
            <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-xl border border-gold/20 hover:border-gold
                       flex items-center justify-center transition-all duration-200 text-warm"
          >
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Color grid */}
      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 animate-fade-in">
          {palette.colors.map((color, i) => (
            <ColorCard key={i} hex={color.hex} name={color.name} size="sm" />
          ))}
        </div>
      )}
    </div>
  )
}
