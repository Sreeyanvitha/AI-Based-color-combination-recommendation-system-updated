import { useState, useEffect } from 'react'
import { ArrowRight, Sparkles, Palette, Wand2, Star, ChevronDown, LogIn, UserPlus } from 'lucide-react'

const FEATURES = [
  { icon: '🎨', title: 'AI Color Extraction', desc: 'K-Means ML clustering pulls the 6 dominant colors from any outfit photo in seconds.' },
  { icon: '🌗', title: 'Color Harmony Engine', desc: 'Generates complementary, analogous, monochromatic & accent palettes using color science.' },
  { icon: '🧬', title: 'Skin-Tone Aware', desc: 'Recommendations adapt to your unique skin tone — Fair, Medium, Olive, or Dark.' },
  { icon: '✨', title: 'Occasion Intelligence', desc: 'Palettes shift contextually for Casual, Office, Party, Wedding, Date, and Festival.' },
  { icon: '👗', title: 'AI Outfit Preview', desc: 'See a live AI-rendered silhouette wearing your selected color palette before you commit.' },
  { icon: '💾', title: 'Save Palettes', desc: 'Bookmark your favourite palettes and revisit them anytime from your personal library.' },
]

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Fashion Blogger', text: 'Color Studio changed how I dress entirely. I finally understand what works for my olive skin!', stars: 5 },
  { name: 'Meera R.', role: 'Wedding Stylist', text: 'I use it for every client consultation. The occasion-based palettes are spot-on.', stars: 5 },
  { name: 'Aisha K.', role: 'Content Creator', text: 'The AI outfit preview is incredible — I can visualize the whole look before buying anything.', stars: 5 },
]

const FLOAT_COLORS = ['#C9A84C','#9BAF8A','#E8D5C4','#8B7355','#C4A882','#4A6FA5']

export default function HomePage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0C0A08] text-cream overflow-x-hidden font-body">

      {/* ── Floating color orbs background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {FLOAT_COLORS.map((c, i) => (
          <div key={i} className="absolute rounded-full opacity-10 blur-3xl"
            style={{
              background: c,
              width: `${200 + i * 60}px`,
              height: `${200 + i * 60}px`,
              top: `${[10,60,20,70,40,5][i]}%`,
              left: `${[5,70,40,10,80,55][i]}%`,
              animation: `floatOrb ${6 + i * 1.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes floatOrb {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-40px) scale(1.1); }
        }
        @keyframes slideUp {
          from { opacity:0; transform: translateY(32px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .slide-up  { animation: slideUp 0.7s ease forwards; }
        .fade-in   { animation: fadeIn 0.5s ease forwards; }
        .delay-1   { animation-delay: 0.1s; opacity:0; }
        .delay-2   { animation-delay: 0.25s; opacity:0; }
        .delay-3   { animation-delay: 0.4s; opacity:0; }
        .delay-4   { animation-delay: 0.55s; opacity:0; }
        .shimmer-text {
          background: linear-gradient(90deg, #C9A84C, #FAF7F2, #C9A84C, #9BAF8A);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .glass {
          background: rgba(255,252,248,0.04);
          border: 1px solid rgba(201,168,76,0.15);
          backdrop-filter: blur(16px);
        }
        .btn-gold {
          background: linear-gradient(135deg, #C9A84C, #B8924A);
          color: #0C0A08;
          font-weight: 600;
          border-radius: 14px;
          padding: 14px 28px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          letter-spacing: 0.02em;
          transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(201,168,76,0.3);
          cursor: pointer;
          border: none;
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(201,168,76,0.45);
        }
        .btn-outline {
          background: transparent;
          color: #FAF7F2;
          border: 1.5px solid rgba(201,168,76,0.4);
          border-radius: 14px;
          padding: 13px 24px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-outline:hover {
          border-color: #C9A84C;
          background: rgba(201,168,76,0.08);
        }
        .feature-card {
          background: rgba(255,252,248,0.03);
          border: 1px solid rgba(201,168,76,0.12);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s;
        }
        .feature-card:hover {
          background: rgba(201,168,76,0.06);
          border-color: rgba(201,168,76,0.3);
          transform: translateY(-4px);
        }
        .palette-strip {
          display: flex;
          border-radius: 12px;
          overflow: hidden;
          height: 10px;
          margin-top: 12px;
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 glass' : 'py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8B7355] flex items-center justify-center">
              <Sparkles size={14} className="text-[#0C0A08]" />
            </div>
            <span className="font-display text-lg font-medium text-cream">Color Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('login')} className="btn-outline text-sm py-2 px-5">
              <LogIn size={14} /> Sign In
            </button>
            <button onClick={() => onNavigate('signup')} className="btn-gold text-sm py-2.5 px-5">
              <UserPlus size={14} /> Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="slide-up delay-1">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs tracking-widest uppercase text-[#C9A84C] mb-6">
            <Sparkles size={10} /> AI-Powered Style Intelligence
          </span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-light leading-[1.05] mb-6 slide-up delay-2">
          Dress in<br />
          <span className="shimmer-text italic">Perfect Color</span>
        </h1>

        <p className="text-[#C4A882]/80 text-base sm:text-lg max-w-lg leading-relaxed mb-10 slide-up delay-3">
          Upload your outfit. Our AI extracts dominant colors, builds harmony palettes tuned to your skin tone and occasion, and previews the look on a virtual silhouette.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 slide-up delay-4">
          <button onClick={() => onNavigate('signup')} className="btn-gold">
            Start Styling Free <ArrowRight size={15} />
          </button>
          <button onClick={() => onNavigate('login')} className="btn-outline">
            Sign In
          </button>
        </div>

        {/* Hero palette strip */}
        <div className="mt-16 flex gap-2 items-center slide-up delay-4">
          {['#C9A84C','#9BAF8A','#8B7355','#E8D5C4','#4A6FA5','#C4A882'].map((c,i) => (
            <div key={i} className="rounded-full border border-white/10 shadow-lg hover:scale-110 transition-transform duration-200"
              style={{ width: 36, height: 36, background: c, animationDelay: `${i*0.1}s` }} />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-[10px] tracking-widest uppercase text-cream/50">Scroll</span>
          <ChevronDown size={14} className="text-cream/50 animate-bounce" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-3">What You Get</p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-cream">Everything you need<br /><em className="italic text-[#C4A882]">to style perfectly</em></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i*0.08}s` }}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-medium text-cream text-base mb-2">{f.title}</h3>
              <p className="text-sm text-[#C4A882]/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#C9A84C] mb-3">Simple & Fast</p>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-cream">Three steps to<br /><em className="italic text-[#9BAF8A]">your perfect palette</em></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { n:'01', icon:'📸', title:'Upload', desc:'Drop your outfit photo. Any angle, any lighting — our AI handles it.' },
            { n:'02', icon:'🎨', title:'Customise', desc:'Select your skin tone and occasion. The palette adapts instantly.' },
            { n:'03', icon:'👗', title:'Preview', desc:'See the colors on a virtual outfit silhouette before committing.' },
          ].map((s,i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-2xl">{s.icon}</div>
              <span className="font-display text-4xl font-light text-[#C9A84C]/30">{s.n}</span>
              <h3 className="font-medium text-cream text-base">{s.title}</h3>
              <p className="text-sm text-[#C4A882]/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-light text-cream">Loved by style-conscious<br /><em className="italic text-[#C9A84C]">people everywhere</em></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t,i) => (
            <div key={i} className="feature-card">
              <div className="flex gap-1 mb-4">
                {Array.from({length: t.stars}).map((_,j) => (
                  <Star key={j} size={12} fill="#C9A84C" className="text-[#C9A84C]" />
                ))}
              </div>
              <p className="text-sm text-cream/80 leading-relaxed mb-5 italic">"{t.text}"</p>
              <div>
                <p className="text-sm font-medium text-cream">{t.name}</p>
                <p className="text-xs text-[#C4A882]/60">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="glass rounded-3xl p-12">
          <div className="flex justify-center gap-3 mb-8">
            {['#C9A84C','#9BAF8A','#E8D5C4','#8B7355','#C4A882'].map((c,i) => (
              <div key={i} className="w-8 h-8 rounded-full shadow-lg border border-white/10"
                style={{ background: c }} />
            ))}
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-cream mb-4">
            Ready to dress in<br /><em className="shimmer-text italic">perfect color?</em>
          </h2>
          <p className="text-sm text-[#C4A882]/70 mb-8 max-w-sm mx-auto">
            Join thousands of style-conscious people who use Color Studio every day. Free to start.
          </p>
          <button onClick={() => onNavigate('signup')} className="btn-gold mx-auto">
            Create Free Account <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[#C9A84C]/10 py-8 text-center">
        <p className="text-xs text-[#C4A882]/30">
          © 2025 Outfit Color Studio · AI Style Intelligence · Built with FastAPI & React
        </p>
      </footer>
    </div>
  )
}
