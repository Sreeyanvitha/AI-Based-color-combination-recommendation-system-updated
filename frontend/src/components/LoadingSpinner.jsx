export default function LoadingSpinner({ message = 'Analysing your outfit…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 animate-fade-in">
      {/* Spinning rings */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
        <div className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent
                        border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-gold/50
                        border-b-transparent border-l-transparent animate-spin"
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full bg-gold/10 flex items-center justify-center">
          <span className="text-lg">🎨</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-ink dark:text-cream">{message}</p>
        <p className="text-xs text-warm/50 mt-1">Extracting colors & building palettes…</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
