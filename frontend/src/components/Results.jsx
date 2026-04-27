import { useState } from 'react'
import { Heart, Copy, Check, Lightbulb, AlertTriangle, User } from 'lucide-react'
import { copyToClipboard, formatHex, savePalette } from '../utils/colors.js'
import toast from 'react-hot-toast'

/* ── tiny helpers ─────────────────────────────────────────── */
function getContrast(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.55 ? '#1A1410' : '#FAF7F2'
}

/* ── Single swatch pill ───────────────────────────────────── */
function Swatch({ hex, name, size = 'md', showLabel = true }) {
  const [copied, setCopied] = useState(false)
  const contrast = getContrast(hex)

  const handleCopy = async () => {
    await copyToClipboard(formatHex(hex))
    setCopied(true)
    toast.success(`${formatHex(hex)} copied!`)
    setTimeout(() => setCopied(false), 1800)
  }

  const h = size === 'lg' ? 'h-16' : size === 'sm' ? 'h-9' : 'h-12'

  return (
    <div onClick={handleCopy}
      className="group relative cursor-pointer rounded-xl overflow-hidden transition-transform duration-150 hover:scale-105 hover:shadow-lg"
      title={`${name} · ${formatHex(hex)}`}>
      <div className={`${h} w-full`} style={{ background: hex }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {copied
            ? <Check size={13} style={{ color: contrast }} />
            : <Copy size={11} style={{ color: contrast, opacity: 0.7 }} />}
        </div>
      </div>
      {showLabel && (
        <div className="px-2 py-1.5 bg-white/90 dark:bg-white/5 border-t border-black/5">
          <p className="text-[10px] font-medium text-ink dark:text-cream truncate">{name}</p>
          <p className="text-[9px] font-mono text-warm/50">{formatHex(hex)}</p>
        </div>
      )}
    </div>
  )
}

/* ── Horizontal color strip (bar) ────────────────────────── */
function ColorStrip({ colors, label, icon, description, accent }) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    savePalette(colors, `${label} — ${new Date().toLocaleDateString()}`)
    setSaved(true)
    toast.success('Palette saved!')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mb-4">
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-medium text-ink dark:text-cream">{label}</span>
          {description && (
            <span className="hidden sm:inline text-[10px] text-warm/45 ml-1">— {description}</span>
          )}
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] border transition-all duration-200
            ${saved
              ? 'border-rose-300 text-rose-400 bg-rose-50/50 dark:bg-rose-900/10'
              : 'border-gold/20 text-warm/50 hover:border-gold hover:text-gold'}`}>
          <Heart size={9} fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Strip */}
      <div className="flex rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5">
        {colors.map((c, i) => {
          const contrast = getContrast(c.hex)
          return (
            <SwatchSegment key={i} color={c} contrast={contrast} isFirst={i===0} isLast={i===colors.length-1} total={colors.length} />
          )
        })}
      </div>
    </div>
  )
}

function SwatchSegment({ color, contrast, isFirst, isLast, total }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(formatHex(color.hex))
    setCopied(true)
    toast.success(`${formatHex(color.hex)} copied!`)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-1 cursor-pointer transition-all duration-200"
      style={{
        background: color.hex,
        height: hovered ? 72 : 56,
        transition: 'height 0.2s ease',
      }}
      title={`${color.name} · ${formatHex(color.hex)}`}
    >
      {/* Hover tooltip */}
      {hovered && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ zIndex: 10 }}>
          <p className="text-[9px] font-medium whitespace-nowrap px-1.5 py-0.5 rounded-md"
            style={{ color: contrast, background: `${color.hex}cc`, backdropFilter: 'blur(4px)' }}>
            {formatHex(color.hex)}
          </p>
        </div>
      )}
      {/* Copy icon on hover */}
      <div className="absolute top-1.5 right-1.5 opacity-0 transition-opacity duration-150"
        style={{ opacity: hovered ? 0.7 : 0 }}>
        {copied
          ? <Check size={9} style={{ color: contrast }} />
          : <Copy size={9} style={{ color: contrast }} />}
      </div>
    </div>
  )
}

/* ── Main Results ─────────────────────────────────────────── */
export default function Results({ data }) {
  if (!data) return null
  const { base_colors, palettes, avoid, styling_tip, skin_tone_detected, skin_description } = data

  const paletteRows = [
    { key: 'complementary', label: 'Complementary', icon: '🔄', short: 'High contrast' },
    { key: 'analogous',     label: 'Analogous',     icon: '🌈', short: 'Harmonious'   },
    { key: 'monochromatic', label: 'Monochromatic', icon: '🎨', short: 'Tonal layers'  },
    { key: 'accent',        label: 'Accent Pops',   icon: '✨', short: 'Bold touches'  },
  ]

  return (
    <div className="animate-fade-up space-y-5 mt-6">

      {/* ── Skin tone chip ── */}
      {skin_tone_detected && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gold/15 bg-gold/4">
          <User size={13} className="text-gold flex-shrink-0" />
          <span className="text-xs font-medium text-ink dark:text-cream">{skin_tone_detected} skin tone</span>
          {skin_description && (
            <span className="text-[10px] text-warm/50 hidden sm:block leading-snug">{skin_description}</span>
          )}
        </div>
      )}

      {/* ── Base Colors ── */}
      <div className="card p-4">
        <p className="text-[10px] tracking-widest uppercase text-gold font-medium mb-3">Your Outfit Colors</p>
        <div className="flex rounded-xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 mb-3">
          {base_colors.map((c, i) => (
            <SwatchSegment key={i} color={c} contrast={getContrast(c.hex)} isFirst={i===0} isLast={i===base_colors.length-1} total={base_colors.length} />
          ))}
        </div>
        {/* Name labels */}
        <div className="flex gap-1 flex-wrap">
          {base_colors.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] border border-gold/12 text-warm/60">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.hex }} />
              {c.name}
              {i === 0 && <span className="text-gold ml-0.5">·&nbsp;Primary</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── Recommended Palettes ── */}
      <div className="card p-4">
        <p className="text-[10px] tracking-widest uppercase text-gold font-medium mb-4">Recommended Palettes</p>
        <div className="space-y-1">
          {paletteRows.map(({ key, label, icon, short }) =>
            palettes[key] ? (
              <ColorStrip
                key={key}
                label={label}
                icon={icon}
                description={short}
                colors={palettes[key].colors}
              />
            ) : null
          )}
        </div>
      </div>

      {/* ── Avoid ── */}
      {avoid?.colors?.length > 0 && (
        <div className="card p-4 border-red-200/25 dark:border-red-800/15 bg-red-50/20 dark:bg-red-900/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
            <p className="text-[10px] tracking-widest uppercase text-red-400 font-medium">Avoid</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {avoid.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg border-2 border-dashed border-red-300/40"
                  style={{ background: c.hex }} />
                <span className="text-[10px] text-warm/50 font-mono">{formatHex(c.hex)}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-warm/40 mt-2 leading-relaxed">{avoid.reason}</p>
        </div>
      )}

      {/* ── Tip ── */}
      {styling_tip && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-gold/15 bg-gold/4">
          <Lightbulb size={13} className="text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-ink dark:text-cream/80 leading-relaxed">{styling_tip}</p>
        </div>
      )}
    </div>
  )
}
