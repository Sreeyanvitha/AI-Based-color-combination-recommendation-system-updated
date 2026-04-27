import { useState, useEffect, useRef } from 'react'
import { Sparkles, RefreshCw, Download, Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'

/* ─── Garment piece definitions ──────────────────────────────
   Each piece maps to SVG path data and which palette slot to use.
   Slot 0 = primary garment  (dominant outfit color)
   Slot 1 = secondary        (complementary 1)
   Slot 2 = accent           (complementary 2)
   Slot 3 = detail / trim    (accent 1)
   Slot 4 = background / bg  (analogue 1)
──────────────────────────────────────────────────────────── */
const OUTFIT_STYLES = [
  { label: 'Dress',       id: 'dress' },
  { label: 'Suit',        id: 'suit' },
  { label: 'Casual',      id: 'casual' },
  { label: 'Saree Drape', id: 'saree' },
]

function darken(hex, amount = 30) {
  let r = parseInt(hex.slice(1,3),16)
  let g = parseInt(hex.slice(3,5),16)
  let b = parseInt(hex.slice(5,7),16)
  r = Math.max(0, r - amount)
  g = Math.max(0, g - amount)
  b = Math.max(0, b - amount)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function lighten(hex, amount = 30) {
  let r = parseInt(hex.slice(1,3),16)
  let g = parseInt(hex.slice(3,5),16)
  let b = parseInt(hex.slice(5,7),16)
  r = Math.min(255, r + amount)
  g = Math.min(255, g + amount)
  b = Math.min(255, b + amount)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

/* ── SVG silhouette renderers per style ──────────────────── */
function DressSilhouette({ colors, animate }) {
  const [c0, c1, c2, c3] = colors
  return (
    <svg viewBox="0 0 220 420" className="w-full h-full drop-shadow-2xl" style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.4))'}}>
      <defs>
        <linearGradient id="bodice" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(c0,15)}/>
          <stop offset="100%" stopColor={darken(c0,10)}/>
        </linearGradient>
        <linearGradient id="skirt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1}/>
          <stop offset="100%" stopColor={darken(c1,20)}/>
        </linearGradient>
        <linearGradient id="sash" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c2}/>
          <stop offset="100%" stopColor={darken(c2,15)}/>
        </linearGradient>
      </defs>

      {/* Neck */}
      <ellipse cx="110" cy="62" rx="18" ry="8" fill="#D4A574" opacity="0.9"/>
      {/* Head */}
      <ellipse cx="110" cy="40" rx="24" ry="28" fill="#D4A574"/>
      {/* Hair */}
      <ellipse cx="110" cy="24" rx="26" ry="18" fill="#2C1810"/>
      <path d="M84 32 Q78 55 82 72" fill="#2C1810" stroke="none"/>
      <path d="M136 32 Q142 55 138 72" fill="#2C1810" stroke="none"/>

      {/* Bodice */}
      <path d="M88 72 Q78 80 72 100 L72 185 Q110 195 148 185 L148 100 Q142 80 132 72 Q121 68 110 68 Q99 68 88 72Z"
        fill="url(#bodice)" stroke={darken(c0,30)} strokeWidth="0.8"/>

      {/* Neckline detail */}
      <path d="M92 72 Q110 82 128 72" fill="none" stroke={darken(c0,40)} strokeWidth="1.5"/>

      {/* Arms */}
      <path d="M72 100 Q55 110 50 140 Q48 155 55 165 Q62 140 72 130Z" fill={darken(c0,5)} stroke={darken(c0,30)} strokeWidth="0.8"/>
      <path d="M148 100 Q165 110 170 140 Q172 155 165 165 Q158 140 148 130Z" fill={darken(c0,5)} stroke={darken(c0,30)} strokeWidth="0.8"/>

      {/* Sash / belt */}
      <rect x="72" y="178" width="76" height="14" rx="3" fill="url(#sash)"/>

      {/* Skirt */}
      <path d="M72 185 Q55 220 45 270 Q38 310 42 360 L178 360 Q182 310 175 270 Q165 220 148 185Z"
        fill="url(#skirt)" stroke={darken(c1,20)} strokeWidth="0.8"/>

      {/* Skirt fold lines */}
      <path d="M90 200 Q80 260 78 340" fill="none" stroke={darken(c1,30)} strokeWidth="0.5" opacity="0.5"/>
      <path d="M110 200 Q108 265 108 350" fill="none" stroke={darken(c1,30)} strokeWidth="0.5" opacity="0.4"/>
      <path d="M130 200 Q140 260 142 340" fill="none" stroke={darken(c1,30)} strokeWidth="0.5" opacity="0.5"/>

      {/* Trim at hem */}
      <path d="M42 355 Q110 370 178 355 L178 360 L42 360Z" fill={c3} opacity="0.7"/>

      {/* Shoes */}
      <ellipse cx="85" cy="373" rx="20" ry="7" fill={darken(c3,20)}/>
      <ellipse cx="135" cy="373" rx="20" ry="7" fill={darken(c3,20)}/>

      {/* Shine on bodice */}
      <path d="M95 78 Q105 76 112 80" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"/>

      {animate && (
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="3s" repeatCount="indefinite"/>
      )}
    </svg>
  )
}

function SuitSilhouette({ colors }) {
  const [c0, c1, c2, c3] = colors
  return (
    <svg viewBox="0 0 220 420" className="w-full h-full drop-shadow-2xl" style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.4))'}}>
      <defs>
        <linearGradient id="jacket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(c0,10)}/><stop offset="100%" stopColor={darken(c0,15)}/>
        </linearGradient>
        <linearGradient id="pants" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={darken(c1,20)}/>
        </linearGradient>
      </defs>
      {/* Head */}
      <ellipse cx="110" cy="38" rx="22" ry="26" fill="#C68642"/>
      <ellipse cx="110" cy="20" rx="23" ry="15" fill="#1A0F0A"/>
      <ellipse cx="110" cy="62" rx="16" ry="7" fill="#C68642" opacity="0.9"/>
      {/* Shirt */}
      <path d="M94 70 L94 185 L126 185 L126 70 Q110 62 94 70Z" fill="white" opacity="0.95"/>
      {/* Tie */}
      <path d="M107 72 L110 75 L113 72 L111 170 L110 175 L109 170Z" fill={c2}/>
      {/* Jacket */}
      <path d="M70 75 Q60 82 55 105 L55 210 L95 210 L95 185 L94 70Z" fill="url(#jacket)" stroke={darken(c0,30)} strokeWidth="0.8"/>
      <path d="M150 75 Q160 82 165 105 L165 210 L125 210 L125 185 L126 70Z" fill="url(#jacket)" stroke={darken(c0,30)} strokeWidth="0.8"/>
      {/* Lapels */}
      <path d="M94 70 Q100 90 95 115" fill="none" stroke={darken(c0,40)} strokeWidth="1.5"/>
      <path d="M126 70 Q120 90 125 115" fill="none" stroke={darken(c0,40)} strokeWidth="1.5"/>
      {/* Pocket square */}
      <rect x="56" y="130" width="14" height="10" rx="2" fill={c3} opacity="0.9"/>
      {/* Arms */}
      <path d="M55 105 Q38 125 35 165 Q35 180 42 185 Q47 155 58 135Z" fill={darken(c0,5)} stroke={darken(c0,30)} strokeWidth="0.8"/>
      <path d="M165 105 Q182 125 185 165 Q185 180 178 185 Q173 155 162 135Z" fill={darken(c0,5)} stroke={darken(c0,30)} strokeWidth="0.8"/>
      {/* Shirt cuffs */}
      <rect x="34" y="183" width="10" height="6" rx="2" fill="white"/>
      <rect x="176" y="183" width="10" height="6" rx="2" fill="white"/>
      {/* Trousers */}
      <path d="M70 205 L70 370 L105 370 L110 290 L115 370 L150 370 L150 205Z" fill="url(#pants)" stroke={darken(c1,20)} strokeWidth="0.8"/>
      {/* Crease lines */}
      <path d="M88 210 L86 365" fill="none" stroke={darken(c1,30)} strokeWidth="0.8" opacity="0.5"/>
      <path d="M132 210 L134 365" fill="none" stroke={darken(c1,30)} strokeWidth="0.8" opacity="0.5"/>
      {/* Shoes */}
      <path d="M70 370 Q72 380 90 382 Q100 383 106 378 L105 370Z" fill={darken(c3,30)}/>
      <path d="M150 370 Q148 380 130 382 Q120 383 114 378 L115 370Z" fill={darken(c3,30)}/>
    </svg>
  )
}

function CasualSilhouette({ colors }) {
  const [c0, c1, c2, c3] = colors
  return (
    <svg viewBox="0 0 220 420" className="w-full h-full drop-shadow-2xl" style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.4))'}}>
      <defs>
        <linearGradient id="tee" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(c0,15)}/><stop offset="100%" stopColor={darken(c0,10)}/>
        </linearGradient>
        <linearGradient id="jeans" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={darken(c1,25)}/>
        </linearGradient>
      </defs>
      {/* Head */}
      <ellipse cx="110" cy="38" rx="23" ry="27" fill="#8D5524"/>
      <ellipse cx="110" cy="18" rx="26" ry="16" fill="#1A0F0A"/>
      <ellipse cx="110" cy="64" rx="17" ry="8" fill="#8D5524" opacity="0.9"/>
      {/* T-shirt */}
      <path d="M76 70 Q64 80 58 100 L60 185 L160 185 L162 100 Q156 80 144 70 Q127 65 110 65 Q93 65 76 70Z"
        fill="url(#tee)" stroke={darken(c0,25)} strokeWidth="0.8"/>
      {/* Collar */}
      <path d="M95 70 Q110 78 125 70" fill={c0} stroke={darken(c0,35)} strokeWidth="1.2"/>
      {/* Short sleeves */}
      <path d="M58 100 Q40 105 38 130 Q38 140 45 142 Q52 120 62 110Z" fill={darken(c0,5)} stroke={darken(c0,25)} strokeWidth="0.8"/>
      <path d="M162 100 Q180 105 182 130 Q182 140 175 142 Q168 120 158 110Z" fill={darken(c0,5)} stroke={darken(c0,25)} strokeWidth="0.8"/>
      {/* Graphic print on shirt */}
      <circle cx="110" cy="135" r="18" fill={c2} opacity="0.3"/>
      <circle cx="110" cy="135" r="12" fill={c2} opacity="0.2"/>
      {/* Belt */}
      <rect x="62" y="183" width="96" height="12" rx="4" fill={darken(c3,10)}/>
      <rect x="106" y="184" width="8" height="10" rx="2" fill={lighten(c3,20)}/>
      {/* Jeans */}
      <path d="M62 190 L62 368 L100 368 L110 295 L120 368 L158 368 L158 190Z"
        fill="url(#jeans)" stroke={darken(c1,25)} strokeWidth="0.8"/>
      {/* Jeans stitching */}
      <path d="M85 193 L83 363" fill="none" stroke={lighten(c1,20)} strokeWidth="0.7" opacity="0.4" strokeDasharray="3,3"/>
      <path d="M135 193 L137 363" fill="none" stroke={lighten(c1,20)} strokeWidth="0.7" opacity="0.4" strokeDasharray="3,3"/>
      {/* Pocket */}
      <path d="M64 215 Q70 213 78 218 L76 235 Q70 240 64 237Z" fill={darken(c1,15)} stroke={darken(c1,30)} strokeWidth="0.6"/>
      {/* Sneakers */}
      <path d="M62 368 L62 376 Q68 382 90 382 Q104 383 107 376 L100 368Z" fill={lighten(c3,30)}/>
      <path d="M158 368 L158 376 Q152 382 130 382 Q116 383 113 376 L120 368Z" fill={lighten(c3,30)}/>
      <path d="M62 372 Q85 374 107 372" fill="none" stroke="white" strokeWidth="1" opacity="0.6"/>
      <path d="M158 372 Q135 374 113 372" fill="none" stroke="white" strokeWidth="1" opacity="0.6"/>
    </svg>
  )
}

function SareeSilhouette({ colors }) {
  const [c0, c1, c2, c3] = colors
  return (
    <svg viewBox="0 0 220 420" className="w-full h-full drop-shadow-2xl" style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.4))'}}>
      <defs>
        <linearGradient id="saree1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lighten(c0,10)}/><stop offset="100%" stopColor={darken(c0,15)}/>
        </linearGradient>
        <linearGradient id="pallu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={darken(c1,20)}/>
        </linearGradient>
        <linearGradient id="blouse" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c2}/><stop offset="100%" stopColor={darken(c2,15)}/>
        </linearGradient>
      </defs>
      {/* Head */}
      <ellipse cx="110" cy="36" rx="22" ry="26" fill="#8D5524"/>
      {/* Bun / hair */}
      <ellipse cx="110" cy="16" rx="20" ry="12" fill="#1A0F0A"/>
      <circle cx="128" cy="14" rx="6" ry="6" fill="#1A0F0A"/>
      {/* Bindi */}
      <circle cx="110" cy="30" r="2.5" fill={c2}/>
      {/* Neck + shoulders */}
      <ellipse cx="110" cy="61" rx="16" ry="8" fill="#8D5524" opacity="0.9"/>
      {/* Blouse */}
      <path d="M88 66 Q78 74 74 88 L74 140 L146 140 L146 88 Q142 74 132 66 Q121 62 110 62 Q99 62 88 66Z"
        fill="url(#blouse)" stroke={darken(c2,30)} strokeWidth="0.8"/>
      {/* Blouse sleeves */}
      <path d="M74 88 Q58 95 55 118 Q54 130 60 134 Q65 115 76 102Z" fill={darken(c2,5)} stroke={darken(c2,25)} strokeWidth="0.7"/>
      <path d="M146 88 Q162 95 165 118 Q166 130 160 134 Q155 115 144 102Z" fill={darken(c2,5)} stroke={darken(c2,25)} strokeWidth="0.7"/>
      {/* Navel / midriff */}
      <path d="M88 138 L88 160 Q110 165 132 160 L132 138Z" fill="#8D5524" opacity="0.6"/>
      {/* Saree drape body */}
      <path d="M74 140 Q60 165 55 200 Q48 240 50 320 Q52 355 65 370 L95 370 L95 280 L125 280 L125 370 L155 370 Q168 355 170 320 Q172 240 165 200 Q160 165 146 140Z"
        fill="url(#saree1)" stroke={darken(c0,20)} strokeWidth="0.8"/>
      {/* Pallu (drape over shoulder) */}
      <path d="M132 66 Q150 55 165 60 Q175 80 170 140 Q160 150 146 140 Q145 100 138 75Z"
        fill="url(#pallu)" stroke={darken(c1,20)} strokeWidth="0.8"/>
      {/* Border on pallu */}
      <path d="M134 68 Q152 57 167 62" fill="none" stroke={c3} strokeWidth="3" opacity="0.8"/>
      <path d="M146 140 Q160 152 170 140" fill="none" stroke={c3} strokeWidth="3" opacity="0.8"/>
      {/* Saree border at hem */}
      <path d="M50 358 Q110 370 170 358 L170 370 L50 370Z" fill={c3} opacity="0.85"/>
      {/* Border pattern */}
      {[60,75,90,105,120,135,150].map(x => (
        <circle key={x} cx={x+5} cy="362" r="2.5" fill={lighten(c3,30)} opacity="0.8"/>
      ))}
      {/* Feet / anklets */}
      <ellipse cx="85" cy="376" rx="16" ry="5" fill="#8D5524" opacity="0.7"/>
      <ellipse cx="135" cy="376" rx="16" ry="5" fill="#8D5524" opacity="0.7"/>
      <path d="M74 374 Q85 379 96 374" fill="none" stroke={c3} strokeWidth="1.5" opacity="0.7"/>
      <path d="M124 374 Q135 379 146 374" fill="none" stroke={c3} strokeWidth="1.5" opacity="0.7"/>
    </svg>
  )
}

const SILHOUETTES = { dress: DressSilhouette, suit: SuitSilhouette, casual: CasualSilhouette, saree: SareeSilhouette }

/* ─── Main component ─────────────────────────────────────── */
export default function OutfitPreview({ results }) {
  const [style, setStyle]       = useState('dress')
  const [animating, setAnim]    = useState(false)
  const [generating, setGen]    = useState(false)
  const [selectedPalette, setSel] = useState('complementary')
  const svgRef = useRef(null)

  // Pull colors from results
  const baseColors  = results?.base_colors?.map(c => c.hex) || []
  const paletteData = results?.palettes?.[selectedPalette]?.colors?.map(c => c.hex) || []

  // Combine: base[0] as primary, rest from selected palette
  const colors = [
    baseColors[0]    || '#8B7355',
    paletteData[0]   || baseColors[1] || '#9BAF8A',
    paletteData[1]   || baseColors[2] || '#C9A84C',
    paletteData[2]   || baseColors[3] || '#4A2912',
    paletteData[3]   || '#FAF7F2',
  ]

  const triggerGenerate = () => {
    setGen(true)
    setTimeout(() => setGen(false), 1400)
    setAnim(true)
    setTimeout(() => setAnim(false), 3000)
  }

  useEffect(() => { if (results) triggerGenerate() }, [results, selectedPalette, style])

  const Silhouette = SILHOUETTES[style]

  const handleDownload = () => {
    const svg = svgRef.current?.querySelector('svg')
    if (!svg) return
    const blob = new Blob([svg.outerHTML], {type:'image/svg+xml'})
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'outfit-preview.svg'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Preview downloaded!')
  }

  const PALETTE_LABELS = { complementary:'Complementary', analogous:'Analogous', monochromatic:'Monochromatic', accent:'Accent' }

  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="field-label">AI Outfit Preview</span>
          <h3 className="font-display text-xl text-ink dark:text-cream font-medium">Virtual Try-On</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={triggerGenerate}
            className="w-8 h-8 rounded-xl border border-gold/20 hover:border-gold flex items-center
                       justify-center text-warm transition-all duration-200 hover:bg-gold/5"
            title="Regenerate preview">
            <RefreshCw size={13} className={generating ? 'animate-spin' : ''} />
          </button>
          <button onClick={handleDownload}
            className="w-8 h-8 rounded-xl border border-gold/20 hover:border-gold flex items-center
                       justify-center text-warm transition-all duration-200 hover:bg-gold/5"
            title="Download SVG">
            <Download size={13} />
          </button>
        </div>
      </div>

      {!results ? (
        /* Placeholder */
        <div className="flex-1 flex flex-col items-center justify-center py-10 gap-4 text-center
                        border-2 border-dashed border-gold/15 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gold/8 flex items-center justify-center text-3xl">👗</div>
          <p className="text-sm font-medium text-ink dark:text-cream">Outfit Preview</p>
          <p className="text-xs text-warm/50 max-w-48 leading-relaxed">
            Analyse an outfit to see a live AI-rendered silhouette wearing your color palette.
          </p>
        </div>
      ) : (
        <>
          {/* Style selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {OUTFIT_STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${style === s.id
                    ? 'bg-gold/15 border border-gold text-ink dark:text-cream'
                    : 'border border-gold/15 text-warm/60 hover:border-gold/30 hover:text-warm'}`}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Palette selector */}
          <div className="mb-4">
            <p className="text-[10px] tracking-widest uppercase text-warm/40 mb-2">Apply Palette</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(PALETTE_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => setSel(key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all duration-200
                    ${selectedPalette === key
                      ? 'bg-gold/15 border border-gold/50 text-ink dark:text-cream font-medium'
                      : 'border border-gold/10 text-warm/50 hover:border-gold/25'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Applied colors strip */}
          <div className="flex gap-1.5 mb-5 items-center">
            <span className="text-[10px] text-warm/40 mr-1">Colors:</span>
            {colors.slice(0,5).map((c, i) => (
              <div key={i} title={c}
                className="w-6 h-6 rounded-full border-2 border-white/30 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                style={{background: c}} />
            ))}
          </div>

          {/* Silhouette */}
          <div ref={svgRef}
            className={`flex-1 flex items-center justify-center transition-all duration-500
              ${generating ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'}`}
            style={{ minHeight: 280 }}>
            <div className="relative w-full max-w-[200px] mx-auto" style={{aspectRatio:'220/420'}}>
              {/* Glow behind silhouette */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-20 scale-75"
                style={{ background: `radial-gradient(circle, ${colors[0]}, ${colors[1]})` }} />
              <Silhouette colors={colors} animate={animating} />
            </div>
          </div>

          {generating && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <Wand2 size={12} className="text-gold animate-pulse" />
              <span className="text-xs text-warm/50 animate-pulse">Applying palette…</span>
            </div>
          )}

          {/* Palette name */}
          {results?.palettes?.[selectedPalette] && (
            <div className="mt-4 pt-4 border-t border-gold/10 text-center">
              <p className="text-[10px] tracking-widest uppercase text-gold/60 mb-1">
                {PALETTE_LABELS[selectedPalette]}
              </p>
              <p className="text-sm font-display font-medium text-ink dark:text-cream">
                {results.palettes[selectedPalette].name}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
