import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { getContrastColor, formatHex, getRgbString, copyToClipboard } from '../utils/colors.js'
import toast from 'react-hot-toast'

export default function ColorCard({ hex, name, tag, size = 'md' }) {
  const [copied, setCopied] = useState(false)
  const contrastColor = getContrastColor(hex)

  const handleCopy = async () => {
    const success = await copyToClipboard(formatHex(hex))
    if (success) {
      setCopied(true)
      toast.success(`${formatHex(hex)} copied!`)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const swatchH = size === 'sm' ? 'h-20' : size === 'lg' ? 'h-36' : 'h-28'

  return (
    <div
      className="color-swatch-card group"
      onClick={handleCopy}
      title={`Click to copy ${formatHex(hex)}`}
    >
      {/* Swatch */}
      <div
        className={`${swatchH} relative flex items-start justify-between p-2.5`}
        style={{ background: hex }}
      >
        {tag && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: `${contrastColor}25`,
              color: contrastColor,
              backdropFilter: 'blur(4px)',
            }}
          >
            {tag}
          </span>
        )}
        <button
          className="ml-auto w-7 h-7 rounded-full flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ background: `${contrastColor}20`, color: contrastColor }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 bg-white/90 dark:bg-white/5 border-t border-gold/10">
        <p className="text-xs font-medium text-ink dark:text-cream truncate">{name}</p>
        <p className="text-[10px] text-warm/70 font-mono mt-0.5">{formatHex(hex)}</p>
        <p className="text-[10px] text-warm/50 font-mono">{getRgbString(hex)}</p>
      </div>
    </div>
  )
}
