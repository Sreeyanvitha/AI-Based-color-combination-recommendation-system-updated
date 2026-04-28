import { useState } from 'react'
import { Eye, EyeOff, UserPlus, Sparkles, ArrowLeft, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'One uppercase letter',  test: p => /[A-Z]/.test(p) },
  { label: 'One number',            test: p => /\d/.test(p) },
]

export default function SignupPage({ onNavigate }) {
  const { signup } = useAuth()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [agreed, setAgreed]   = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name    = 'Full name is required'
    if (!form.email)        e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)     e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!agreed) e.agreed = 'Please accept the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 700))
      signup(form.name.trim(), form.email, form.password)
      toast.success(`Welcome to Color Studio, ${form.name.split(' ')[0]}! 🎨`)
      onNavigate('app')
    } catch (err) {
      toast.error(err.message)
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setErrors(e => ({...e, [k]: '', general: ''})) }
  const pwStrength = PASSWORD_RULES.filter(r => r.test(form.password)).length

  return (
    <div className="min-h-screen bg-[#0C0A08] flex items-center justify-center px-4 py-12 relative overflow-hidden font-body">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#9BAF8A]/8 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-[#C9A84C]/6 blur-3xl" />
      </div>

      <style>{`
        .auth-card {
          background: rgba(255,252,248,0.04);
          border: 1px solid rgba(201,168,76,0.18);
          backdrop-filter: blur(24px);
          border-radius: 28px;
          padding: 44px;
          width: 100%;
          max-width: 460px;
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
        .auth-input.error { border-color: rgba(220,80,80,0.6); }
        .auth-input::placeholder { color: rgba(196,168,130,0.4); }
        .btn-gold-full {
          width: 100%;
          background: linear-gradient(135deg, #C9A84C, #B8924A);
          color: #0C0A08;
          font-weight: 600;
          border-radius: 14px;
          padding: 14px;
          font-size: 15px;
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
        .strength-bar { height: 3px; border-radius: 2px; transition: all 0.3s; }
      `}</style>

      <div className="relative z-10 w-full max-w-md">
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

          <h1 className="font-display text-3xl font-light text-[#FAF7F2] mb-1">Create your account</h1>
          <p className="text-sm text-[#C4A882]/60 mb-8">Start styling smarter — it's free</p>

          {errors.general && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="text-xs tracking-widest uppercase text-[#C9A84C]/80 font-medium block mb-2">Full Name</label>
              <input type="text" autoComplete="name" placeholder="Jane Doe"
                value={form.name} onChange={e => set('name', e.target.value)}
                className={`auth-input ${errors.name ? 'error' : ''}`} />
              {errors.name && <p className="err-msg">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs tracking-widest uppercase text-[#C9A84C]/80 font-medium block mb-2">Email Address</label>
              <input type="email" autoComplete="email" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)}
                className={`auth-input ${errors.email ? 'error' : ''}`} />
              {errors.email && <p className="err-msg">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs tracking-widest uppercase text-[#C9A84C]/80 font-medium block mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  className={`auth-input pr-12 ${errors.password ? 'error' : ''}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C4A882]/40 hover:text-[#C9A84C] transition-colors">
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {errors.password && <p className="err-msg">{errors.password}</p>}
              {/* Strength indicator */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-2">
                    {[0,1,2].map(i => (
                      <div key={i} className="flex-1 strength-bar"
                        style={{ background: i < pwStrength
                          ? ['#C05050','#C9A84C','#9BAF8A'][pwStrength-1]
                          : 'rgba(201,168,76,0.12)' }} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    {PASSWORD_RULES.map((r,i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
                          ${r.test(form.password) ? 'bg-[#9BAF8A]/20' : 'bg-transparent'}`}>
                          {r.test(form.password)
                            ? <Check size={9} className="text-[#9BAF8A]"/>
                            : <div className="w-1 h-1 rounded-full bg-[#C4A882]/30"/>}
                        </div>
                        <span className={`text-[11px] ${r.test(form.password) ? 'text-[#9BAF8A]' : 'text-[#C4A882]/40'}`}>
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs tracking-widest uppercase text-[#C9A84C]/80 font-medium block mb-2">Confirm Password</label>
              <input type="password" autoComplete="new-password" placeholder="Repeat password"
                value={form.confirm} onChange={e => set('confirm', e.target.value)}
                className={`auth-input ${errors.confirm ? 'error' : ''}`} />
              {errors.confirm && <p className="err-msg">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <div onClick={() => { setAgreed(!agreed); setErrors(e => ({...e, agreed:''})) }}
                  className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center mt-0.5 transition-all
                    ${agreed ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-[#C9A84C]/30 bg-transparent'}`}>
                  {agreed && <Check size={11} className="text-[#0C0A08]"/>}
                </div>
                <span className="text-xs text-[#C4A882]/50 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-[#C9A84C]/80 hover:text-[#C9A84C] cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-[#C9A84C]/80 hover:text-[#C9A84C] cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {errors.agreed && <p className="err-msg mt-1">{errors.agreed}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-gold-full mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-[#0C0A08]/30 border-t-[#0C0A08] rounded-full animate-spin" /> Creating account…</>
              ) : (
                <><UserPlus size={15}/> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#C4A882]/40 mt-6">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="text-[#C9A84C] hover:underline font-medium">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
