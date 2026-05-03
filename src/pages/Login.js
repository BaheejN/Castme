import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    const user = data.user
    let { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (!profile) {
      const meta = user.user_metadata || {}
      const resolvedRole = meta.role === 'casting_director' ? 'casting_director' : 'artist'
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: meta.full_name || '',
        email: user.email || email,
        role: resolvedRole,
        created_at: new Date().toISOString(),
      })
      if (upsertError) {
        setError(upsertError.message)
        setLoading(false)
        return
      }
      profile = { role: resolvedRole }
    }
    if (profile.role === 'casting_director') { navigate('/dashboard') } else { navigate('/artist/profile') }
    setLoading(false)
  }

  const gold = '#F5A623'
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#1A1714',padding:'20px'}}>
      <div style={{background:'#231F1A',border:'1px solid rgba(245,166,35,0.22)',borderRadius:'14px',padding:'36px 32px',width:'100%',maxWidth:'400px'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'28px',letterSpacing:'3px',textAlign:'center',marginBottom:'6px',color:'#E8E4DC'}}>
          cast<span style={{color:gold}}>mee</span>
        </div>
        <p style={{textAlign:'center',fontSize:'12px',color:'#8A8078',marginBottom:'28px'}}>The Future of Talent Management</p>
        <form onSubmit={handleLogin}>
          {error && <div style={{background:'rgba(224,80,80,0.1)',border:'1px solid rgba(224,80,80,0.3)',borderRadius:'6px',padding:'9px 12px',fontSize:'12px',color:'#E05050',marginBottom:'14px'}}>{error}</div>}
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'11px',color:'#8A8078',marginBottom:'5px'}}>Email address</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'11px',color:'#8A8078',marginBottom:'5px'}}>Password</label>
            <input type="password" placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',background:gold,border:'none',borderRadius:'8px',color:'#1A1714',fontSize:'14px',fontWeight:'500',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
            {loading ? 'Signing in...' : 'Sign in to Castmee'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:'18px',fontSize:'12px',color:'#8A8078'}}>
          New to Castmee? <Link to="/register" style={{color:gold,textDecoration:'none'}}>Create your account</Link>
        </div>
      </div>
    </div>
  )
}
