import { useState, useEffect } from 'react'
import { Bookmark, AlertCircle, Wand2, LogOut, User } from 'lucide-react'
import Header from './components/Header.jsx'
import ImageUpload from './components/ImageUpload.jsx'
import Results from './components/Results.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import SavedPalettes from './components/SavedPalettes.jsx'
import OutfitPreview from './components/OutfitPreview.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { analyzeOutfit } from './utils/api.js'
import toast from 'react-hot-toast'

const SKIN_TONES = [
  { value: 'Fair',   label: 'Fair',   color: '#F5D5B5', desc: 'Light, cool-pink undertones' },
  { value: 'Medium', label: 'Medium', color: '#C68642', desc: 'Warm, golden undertones'     },
  { value: 'Olive',  label: 'Olive',  color: '#8D5524', desc: 'Warm, olive undertones'      },
  { value: 'Dark',   label: 'Dark',   color: '#4A2912', desc: 'Deep, rich undertones'       },
]

const OCCASIONS = [
  { value: 'Casual',   label: '🌿 Casual Everyday' },
  { value: 'Office',   label: '💼 Office / Business' },
  { value: 'Party',    label: '✨ Party / Night Out' },
  { value: 'Wedding',  label: '💐 Wedding / Formal' },
  { value: 'Date',     label: '🌹 Romantic Date' },
  { value: 'Festival', label: '🎨 Festival / Boho' },
]

const STYLE_TIPS = [
  "The 60-30-10 rule: dominant color 60%, secondary 30%, accent 10% — effortless harmony.",
  "Warm skin tones shine in earthy hues — terracotta, rust, gold, and olive are your allies.",
  "Cool skin tones radiate in jewel tones — emerald, sapphire, amethyst, and rose.",
  "Neutrals like cream, taupe, and charcoal are the ultimate wardrobe workhorses.",
  "When in doubt, choose a monochromatic outfit — it's always elegant and put-together.",
  "Contrast draws the eye — pair a bold color with a neutral for maximum impact.",
]

export default function AppPage({ onNavigate, darkMode, setDarkMode }) {
  const { user, logout } = useAuth()
  const [outfitFile, setOutfitFile]       = useState(null)
  const [outfitPreview, setOutfitPreview] = useState(null)
  const [skinFile, setSkinFile]           = useState(null)
  const [skinPreview, setSkinPreview]     = useState(null)
  const [skinTone, setSkinTone]           = useState('Medium')
  const [occasion, setOccasion]           = useState('Casual')
  const [loading, setLoading]             = useState(false)
  const [results, setResults]             = useState(null)
  const [error, setError]                 = useState(null)
  const [savedOpen, setSavedOpen]         = useState(false)
  const [tip]                             = useState(() => STYLE_TIPS[Math.floor(Math.random() * STYLE_TIPS.length)])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleOutfitFile = (file) => {
    setOutfitFile(file)
    setOutfitPreview(URL.createObjectURL(file))
    setResults(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!outfitFile) { toast.error('Please upload an outfit image first.'); return }
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const data = await analyzeOutfit({ outfitFile, skinTone, occasion, skinFile })
      setResults(data)
      setTimeout(() => {
        document.getElementById('results-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Analysis failed. Make sure the backend is running on port 8000.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    onNavigate('home')
    toast.success('Signed out successfully')
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0F0D0B] transition-colors duration-300">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: darkMode
            ? 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(155,175,138,0.05) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(201,168,76,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(155,175,138,0.10) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10">
        {/* Top bar with user info */}
        <div className="border-b border-gold/10 px-6 py-4 flex items-center justify-between bg-cream/80 dark:bg-[#0F0D0B]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20">
              <span className="text-cream text-xs font-bold">{user?.avatar || '?'}</span>
            </div>
            <div>
              <div className="font-display text-base font-medium text-ink dark:text-cream leading-none">Color Studio</div>
              <div className="text-[10px] tracking-widest uppercase text-gold font-medium">AI Style Intelligence</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold/8 border border-gold/15">
                <User size={11} className="text-gold" />
                <span className="text-xs text-warm dark:text-gold/70 font-medium">{user.name}</span>
              </div>
            )}
            <button onClick={() => setDarkMode(!darkMode)}
              className="w-8 h-8 rounded-xl border border-gold/20 flex items-center justify-center
                         hover:border-gold hover:bg-gold/5 transition-all text-warm dark:text-gold/70 text-sm">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setSavedOpen(true)}
              className="w-8 h-8 rounded-xl border border-gold/20 flex items-center justify-center
                         hover:border-gold hover:bg-gold/5 transition-all text-warm dark:text-gold/70">
              <Bookmark size={13} />
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gold/20
                         hover:border-red-300 hover:text-red-400 transition-all text-warm text-xs">
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          {/* Hero */}
          <div className="text-center mb-10">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-3">AI-Powered Style Intelligence</p>
            <h1 className="font-display text-4xl sm:text-5xl font-light text-ink dark:text-cream leading-[1.1] mb-3">
              Outfit <em className="italic text-warm">Color</em> Studio
            </h1>
            <p className="text-sm text-warm/60 max-w-md mx-auto">
              Upload your outfit · select skin tone · get AI-curated palettes and a virtual try-on preview.
            </p>
          </div>

          {/* Main 3-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT: Controls (3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <div className="card p-5">
                <span className="field-label">01 — Outfit Image</span>
                <ImageUpload
                  label="Drop your outfit photo"
                  icon="🧥"
                  hint="JPG, PNG, WEBP · Max 10MB"
                  preview={outfitPreview}
                  onFile={handleOutfitFile}
                  onClear={() => { setOutfitFile(null); setOutfitPreview(null); setResults(null) }}
                />
              </div>

              <div className="card p-5">
                <span className="field-label">02 — Skin Tone</span>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {SKIN_TONES.map(t => (
                    <button key={t.value} onClick={() => setSkinTone(t.value)}
                      className={`pill justify-start ${skinTone === t.value ? 'active' : ''}`}>
                      <span className="w-3 h-3 rounded-full border border-white/40 shadow-sm flex-shrink-0"
                            style={{ background: t.color }} />
                      <span className="text-xs">{t.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-warm/50 leading-relaxed">
                  {SKIN_TONES.find(t => t.value === skinTone)?.desc}
                </p>
                <div className="mt-3 pt-3 border-t border-gold/10">
                  <p className="text-[10px] tracking-widest uppercase text-warm/40 mb-2">Or upload skin photo</p>
                  <ImageUpload label="Skin photo" icon="🤳" hint="Optional — auto-detects skin tone"
                    preview={skinPreview} onFile={f => { setSkinFile(f); setSkinPreview(URL.createObjectURL(f)) }}
                    onClear={() => { setSkinFile(null); setSkinPreview(null) }} />
                </div>
              </div>

              <div className="card p-5">
                <span className="field-label">03 — Occasion</span>
                <div className="relative">
                  <select value={occasion} onChange={e => setOccasion(e.target.value)} className="select-input">
                    {OCCASIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-warm/50">
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <button onClick={handleAnalyze} disabled={!outfitFile || loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                {loading ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-cream/40 border-t-cream animate-spin" />Analysing…</>
                ) : (
                  <><Wand2 size={15} />Analyse Colors</>
                )}
              </button>

              {error && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-900/10
                                border border-red-200/60 text-red-600 dark:text-red-400">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">{error}</p>
                </div>
              )}

              <div className="card p-4 bg-gradient-to-br from-gold/5 to-sage/5 border-gold/15">
                <p className="text-[10px] tracking-widest uppercase text-gold font-medium mb-2">Daily Tip</p>
                <p className="text-xs text-ink dark:text-cream/80 leading-relaxed">{tip}</p>
              </div>
            </div>

            {/* MIDDLE: Results (5 cols) */}
            <div className="lg:col-span-5">
              {!results && !loading && (
                <div className="flex flex-col gap-5">
                  <div className="card p-6">
                    <span className="field-label">How It Works</span>
                    {[
                      { icon:'🎨', t:'Color Extraction', d:'K-Means clustering extracts 6 dominant colors from your image.' },
                      { icon:'🌗', t:'Harmony Theory',   d:'Generates 4 palette types using classical color science.' },
                      { icon:'👗', t:'AI Preview',       d:'See a live silhouette wearing your selected palette in 4 outfit styles.' },
                      { icon:'💾', t:'Save Palettes',    d:'Heart any palette to save it locally.' },
                    ].map(({icon,t,d}) => (
                      <div key={t} className="flex gap-3 items-start mb-4 last:mb-0">
                        <div className="w-9 h-9 rounded-xl bg-gold/8 flex items-center justify-center flex-shrink-0 text-lg">{icon}</div>
                        <div>
                          <p className="text-sm font-medium text-ink dark:text-cream mb-0.5">{t}</p>
                          <p className="text-xs text-warm/55 leading-relaxed">{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card p-5">
                    <p className="text-[10px] tracking-widest uppercase text-gold font-medium mb-3">60 — 30 — 10 Rule</p>
                    <div className="flex gap-1.5 h-8 rounded-xl overflow-hidden">
                      <div className="flex-[6] bg-warm/40 rounded-l-xl flex items-center justify-center">
                        <span className="text-[10px] text-cream font-medium">60%</span>
                      </div>
                      <div className="flex-[3] bg-gold/50 flex items-center justify-center">
                        <span className="text-[10px] text-cream font-medium">30%</span>
                      </div>
                      <div className="flex-[1] bg-sage/70 rounded-r-xl flex items-center justify-center">
                        <span className="text-[9px] text-cream font-medium">10%</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1.5 px-1">
                      <span className="text-[10px] text-warm/40">Dominant</span>
                      <span className="text-[10px] text-warm/40">Secondary</span>
                      <span className="text-[10px] text-warm/40">Accent</span>
                    </div>
                  </div>
                </div>
              )}
              {loading && <LoadingSpinner />}
              <div id="results-anchor" />
              {results && !loading && <Results data={results} />}
            </div>

            {/* RIGHT: Outfit Preview (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-6">
                <OutfitPreview results={results} />
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-gold/10 mt-12 py-6 text-center">
          <p className="text-xs text-warm/30">
            Outfit Color Studio · AI-powered color intelligence · Built with FastAPI & React
          </p>
        </footer>
      </div>

      <SavedPalettes open={savedOpen} onClose={() => setSavedOpen(false)} />
    </div>
  )
}
