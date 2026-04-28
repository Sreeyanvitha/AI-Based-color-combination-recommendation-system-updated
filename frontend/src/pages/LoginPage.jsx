import { useState } from 'react'
import { Eye, EyeOff, LogIn, Sparkles, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600)) // Simulate network
      login(form.email, form.password)
      toast.success('Welcome back! 👋')
      onNavigate('app')
    } catch (err) {
      toast.error(err.message)
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setErrors(e => ({...e, [k]: '', general: ''})) }

  return (
    <div className="min-h-screen bg-[#0C0A08] flex items-center justify-center px-4 relative overflow-hidden font-body">

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#C9A84C]/8 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#9BAF8A]/6 blur-3xl" />
      </div>

      <style>{`
        .auth-card {
          background: rgba(255,252,248,0.04);
          border: 1px solid rgba(201,168,76,0.18);
          backdrop-filter: blur(24px);
          border-radius: 28px;
          padding: 44px;
          width: 100%;
          max-width: 440px;
          animation: slideUp 0.5s ease forwards;
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .auth-input {
          width: 100%;
          background: rgba(255,252,248,0.05);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 12px;
          padding: 13px 16px;
          color: #FAF7F2;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .auth-input:focus {
          border-color: #C9A84C;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        .auth-input.error {
          border-color: rgba(220,80,80,0.6);
        }
        .auth-input::placeholder { color: rgba(196,168,130,0.4); }
        .btn-gold-full {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C, #B8924A);
          color: #0C0A08;
          font-weight: 600;
          border-radius: 14px;
          padding: 14px;
          font-size: 15px;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(201,168,76,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-gold-full:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 36px rgba(201,168,76,0.4);
        }
        .btn-gold-full:disabled { opacity: 0.55; cursor: not-allowed; }
        .err-msg { color: rgba(255,100,100,0.9); font-size: 12px; margin-top: 5px; }
        .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
        .divider::before, .divider::after { content:''; flex:1; height:1px; background:rgba(201,168,76,0.12); }
        .divider span { font-size: 11px; color: rgba(196,168,130,0.4); }
      `}</style>

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[#C4A882]/60 hover:text-[#C9A84C] text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to home
        </button>

        <div className="auth-card">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#8B7355] flex items-center justify-center">
              <Sparkles size={15} className="text-[#0C0A08]" />
            </div>
            <div>
              <div className="font-display text-base font-medium text-[#FAF7F2]">Color Studio</div>
              <div className="text-[10px] tracking-widest uppercase text-[#C9A84C]">Style Intelligence</div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-light text-[#FAF7F2] mb-1">Welcome back</h1>
          <p className="text-sm text-[#C4A882]/60 mb-8">Sign in to your style account</p>

          {errors.general && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="text-xs tracking-widest uppercase text-[#C9A84C]/80 font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email" autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={`auth-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <p className="err-msg">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs tracking-widest uppercase text-[#C9A84C]/80 font-medium block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className={`auth-input pr-12 ${errors.password ? 'error' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C4A882]/40 hover:text-[#C9A84C] transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="err-msg">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-gold-full mt-1">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-[#0C0A08]/30 border-t-[#0C0A08] rounded-full animate-spin" /> Signing in…</>
              ) : (
                <><LogIn size={15} /> Sign In</>
              )}
            </button>
          </form>

          <div className="divider"><span>or</span></div>

          {/* Demo account */}
          <button
            onClick={() => { set('email','demo@colorstudio.ai'); set('password','demo123') }}
            className="w-full py-2.5 rounded-xl border border-[#C9A84C]/15 text-[#C4A882]/50
                       hover:border-[#C9A84C]/30 hover:text-[#C4A882] transition-all text-xs tracking-wide">
            Use Demo Account
          </button>

          <p className="text-center text-sm text-[#C4A882]/40 mt-6">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')}
              className="text-[#C9A84C] hover:underline font-medium">
              Create one free
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
