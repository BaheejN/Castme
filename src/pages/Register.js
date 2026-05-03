import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('artist')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    // With "Confirm email" enabled, signUp often returns no session — REST runs as anon and RLS blocks insert.
    // Profile is then created on first sign-in (see Login.js) from user_metadata.
    if (data.session) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        email,
        role,
        created_at: new Date().toISOString(),
      })
      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }
    setSuccess('Account created! Check your email to confirm, then sign in.')
    setLoading(false)
    setTimeout(() => navigate('/login'), 3000)
  }

  const gold = '#F5A623'
  const roleBtn = (active) => ({flex:1,padding:'12px 8px',background:active?'rgba(245,166,35,0.12)':'rgba(255,255,255,0.04)',border:`1px solid ${active?gold:'rgba(255,255,255,0.1)'}`,borderRadius:'8px',color:active?gold:'#8A8078',fontSize:'12px',fontWeight:'500',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",textAlign:'center'})

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#1A1714',padding:'20px'}}>
      <div style={{background:'#231F1A',border:'1px solid rgba(245,166,35,0.22)',borderRadius:'14px',padding:'36px 32px',width:'100%',maxWidth:'420px'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'26px',letterSpacing:'3px',textAlign:'center',marginBottom:'4px',color:'#E8E4DC'}}>
          cast<span style={{color:gold}}>mee</span>
        </div>
        <p style={{textAlign:'center',fontSize:'12px',color:'#8A8078',marginBottom:'24px'}}>Create your account</p>
        <div style={{display:'flex',gap:'10px',marginBottom:'18px'}}>
          <button style={roleBtn(role==='artist')} onClick={()=>setRole('artist')}>
            <span style={{display:'block',fontSize:'20px',marginBottom:'4px'}}>🎭</span>I am an Artist
          </button>
          <button style={roleBtn(role==='casting_director')} onClick={()=>setRole('casting_director')}>
            <span style={{display:'block',fontSize:'20px',marginBottom:'4px'}}>🎬</span>I am a Casting Director
          </button>
        </div>
        <form onSubmit={handleRegister}>
          {error && <div style={{background:'rgba(224,80,80,0.1)',border:'1px solid rgba(224,80,80,0.3)',borderRadius:'6px',padding:'9px 12px',fontSize:'12px',color:'#E05050',marginBottom:'12px'}}>{error}</div>}
          {success && <div style={{background:'rgba(76,175,125,0.1)',border:'1px solid rgba(76,175,125,0.3)',borderRadius:'6px',padding:'9px 12px',fontSize:'12px',color:'#4CAF7D',marginBottom:'12px'}}>{success}</div>}
          <div style={{marginBottom:'12px'}}>
            <label style={{display:'block',fontSize:'11px',color:'#8A8078',marginBottom:'5px'}}>Full name</label>
            <input type="text" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div style={{marginBottom:'12px'}}>
            <label style={{display:'block',fontSize:'11px',color:'#8A8078',marginBottom:'5px'}}>Email address</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div style={{marginBottom:'12px'}}>
            <label style={{display:'block',fontSize:'11px',color:'#8A8078',marginBottom:'5px'}}>Password (min 6 characters)</label>
            <input type="password" placeholder="Create a password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',background:gold,border:'none',borderRadius:'8px',color:'#1A1714',fontSize:'14px',fontWeight:'500',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
            {loading ? 'Creating account...' : 'Create Castmee account'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:'18px',fontSize:'12px',color:'#8A8078'}}>
          Already have an account? <Link to="/login" style={{color:gold,textDecoration:'none'}}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
