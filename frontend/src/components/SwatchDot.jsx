import { useState } from 'react'
import { copyToClipboard, formatHex } from '../utils/colors.js'
import toast from 'react-hot-toast'

export default function SwatchDot({ hex, size = 28, label = false, clickable = true }) {
  const handleClick = async (e) => {
    if (!clickable) return
    e.stopPropagation()
    const ok = await copyToClipboard(formatHex(hex))
    if (ok) toast.success(`${formatHex(hex)} copied!`)
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        onClick={handleClick}
        title={formatHex(hex)}
        className={`rounded-full border-2 border-white/60 shadow-md transition-transform duration-150
                    ${clickable ? 'cursor-pointer hover:scale-110' : ''}`}
        style={{ width: size, height: size, background: hex }}
      />
      {label && (
        <span className="text-[9px] font-mono text-warm/60">{formatHex(hex)}</span>
      )}
    </div>
  )
}
