import { Moon, Sun, Sparkles } from 'lucide-react'

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-gold/10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20">
          <Sparkles size={16} className="text-cream" />
        </div>
        <div>
          <div className="font-display text-lg font-medium text-ink dark:text-cream leading-none">
            Color Studio
          </div>
          <div className="text-[10px] tracking-widest uppercase text-gold font-medium">
            AI Style Intelligence
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 rounded-xl border border-gold/20 flex items-center justify-center
                     hover:border-gold hover:bg-gold/5 transition-all duration-200 text-warm dark:text-gold/70"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  )
}
