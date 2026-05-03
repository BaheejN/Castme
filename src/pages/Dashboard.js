import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const gold = '#F5A623'
const colors = ['rgba(245,166,35,0.2)','rgba(76,175,125,0.2)','rgba(100,140,220,0.2)','rgba(200,100,150,0.2)','rgba(160,120,200,0.2)']
const initials = n => (n||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

export default function Dashboard() {
  const [artists, setArtists] = useState([])
  const [filtered, setFiltered] = useState([])
  const [shortlist, setShortlist] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [fGender, setFGender] = useState('')
  const [fLang, setFLang] = useState('')
  const [fExp, setFExp] = useState('')
  const [fState, setFState] = useState('')

  useEffect(()=>{ loadArtists() },[])
  useEffect(()=>{ applyFilters() },[fGender,fLang,fExp,fState,artists])

  async function loadArtists() {
    setLoading(true)
    const { data, error } = await supabase.from('artist_profiles').select('*').order('updated_at',{ascending:false})
    if (!error && data) {
      const parsed = data.map(a=>({...a, langs: safeJSON(a.languages)}))
      setArtists(parsed); setFiltered(parsed)
    }
    setLoading(false)
  }

  function safeJSON(str) { try { return JSON.parse(str) } catch { return {} } }

  function applyFilters() {
    let f = [...artists]
    if (fGender) f = f.filter(a=>a.gender===fGender)
    if (fLang) f = f.filter(a=>a.langs?.[fLang])
    if (fExp) f = f.filter(a=>a.acting_experience===fExp)
    if (fState) f = f.filter(a=>a.state===fState)
    setFiltered(f)
  }

  function toggleSL(id) {
    setShortlist(sl=>{ const n=new Set(sl); n.has(id)?n.delete(id):n.add(id); return n })
  }

  const sec = {background:'#231F1A',border:'1px solid rgba(245,166,35,0.22)',borderRadius:'10px',padding:'14px',marginBottom:'14px'}
  const btnGold = {padding:'8px 16px',borderRadius:'7px',fontSize:'12px',fontWeight:'500',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",background:gold,border:`1px solid ${gold}`,color:'#1A1714'}
  const btnGhost = {padding:'7px 14px',borderRadius:'7px',fontSize:'12px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",background:'transparent',border:'1px solid rgba(255,255,255,0.15)',color:'#8A8078'}

  return (
    <div style={{minHeight:'100vh',background:'#1A1714',color:'#E8E4DC',fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:'#231F1A',borderBottom:'1px solid rgba(245,166,35,0.22)',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'10px'}}>
        <div>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'20px',letterSpacing:'2px'}}>cast<span style={{color:gold}}>mee</span></span>
          <span style={{fontSize:'10px',color:'#8A8078',marginLeft:'10px',background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.22)',padding:'3px 10px',borderRadius:'10px'}}>Casting Director</span>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <button style={btnGhost} onClick={loadArtists}>Refresh</button>
          <button style={btnGold}>+ Post casting call</button>
        </div>
      </div>

      <div style={{padding:'18px 20px',maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'10px',marginBottom:'14px'}}>
          {[['Total artists',artists.length,false],['Matching',filtered.length,true],['Shortlisted',shortlist.size,false]].map(([l,v,g])=>(
            <div key={l} style={sec}>
              <div style={{fontSize:'10px',color:'#8A8078',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'4px'}}>{l}</div>
              <div style={{fontSize:'22px',fontWeight:'500',color:g?gold:'#E8E4DC'}}>{v}</div>
            </div>
          ))}
        </div>

        <div style={sec}>
          <div style={{fontSize:'10px',color:gold,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'10px'}}>Filter artists</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:'8px'}}>
            <select value={fGender} onChange={e=>setFGender(e.target.value)}>
              <option value="">Any gender</option><option>Male</option><option>Female</option><option>Non-binary</option>
            </select>
            <select value={fLang} onChange={e=>setFLang(e.target.value)}>
              <option value="">Any language</option>
              {['Hindi','Tamil','Malayalam','Telugu','Kannada','Bengali','Marathi','Punjabi'].map(l=><option key={l}>{l}</option>)}
            </select>
            <select value={fExp} onChange={e=>setFExp(e.target.value)}>
              <option value="">Any experience</option>
              <option>No</option><option>Theatre only</option><option>Short films</option>
              <option>Regional films</option><option>OTT / web series</option><option>Bollywood / national</option>
            </select>
            <select value={fState} onChange={e=>setFState(e.target.value)}>
              <option value="">Any state</option>
              {['Maharashtra','Karnataka','Tamil Nadu','Kerala','Delhi','West Bengal','Punjab','Telangana'].map(s=><option key={s}>{s}</option>)}
            </select>
            <button style={btnGhost} onClick={()=>{setFGender('');setFLang('');setFExp('');setFState('')}}>Clear</button>
          </div>
        </div>

        <div style={{fontSize:'12px',color:'#8A8078',marginBottom:'10px'}}>
          {loading ? 'Loading artists...' : `Showing ${filtered.length} of ${artists.length} artists`}
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'40px',color:'#8A8078'}}>Loading from database...</div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:'center',padding:'40px',color:'#8A8078'}}>No artists yet. Share your registration link to get started!</div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'10px',marginBottom:'14px'}}>
            {filtered.map((a,i)=>{
              const sl=shortlist.has(a.user_id)
              const name=`${a.first_name||''} ${a.last_name||''}`.trim()||'Artist'
              const langs=Object.keys(a.langs||{}).filter(l=>a.langs[l]?.speak).slice(0,2)
              return (
                <div key={a.user_id} style={{background:sl?'#1E2820':'#231F1A',border:`1px solid ${sl?'rgba(76,175,125,0.4)':'rgba(255,255,255,0.07)'}`,borderRadius:'10px',padding:'14px'}}>
                  <div style={{width:'42px',height:'42px',borderRadius:'50%',background:colors[i%colors.length],display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'500',fontSize:'13px',marginBottom:'10px',border:'2px solid rgba(245,166,35,0.3)',color:gold}}>
                    {initials(name)}
                  </div>
                  <div style={{fontWeight:'500',fontSize:'13px',marginBottom:'2px'}}>{name}</div>
                  <div style={{fontSize:'11px',color:'#8A8078',marginBottom:'8px'}}>{a.gender} · {a.state||'Unknown'}</div>
                  <div style={{marginBottom:'8px'}}>
                    {langs.map(l=><span key={l} style={{fontSize:'10px',padding:'2px 7px',borderRadius:'8px',background:'rgba(245,166,35,0.12)',color:gold,marginRight:'4px'}}>{l}</span>)}
                    {a.acting_experience&&a.acting_experience!=='No'&&<span style={{fontSize:'10px',padding:'2px 7px',borderRadius:'8px',background:'rgba(255,255,255,0.06)',color:'#8A8078'}}>{a.acting_experience}</span>}
                  </div>
                  {a.bio&&<div style={{fontSize:'11px',color:'#8A8078',lineHeight:'1.5',marginBottom:'8px'}}>{a.bio.slice(0,70)}...</div>}
                  <div style={{display:'flex',gap:'5px'}}>
                    <button onClick={()=>toggleSL(a.user_id)} style={{flex:1,padding:'6px',fontSize:'11px',borderRadius:'6px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",border:`1px solid ${sl?'rgba(76,175,125,0.4)':'rgba(255,255,255,0.1)'}`,background:sl?'rgba(76,175,125,0.1)':'transparent',color:sl?'#4CAF7D':'#8A8078'}}>
                      {sl?'✓ Listed':'+ Shortlist'}
                    </button>
                    <button style={{flex:1,padding:'6px',fontSize:'11px',borderRadius:'6px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",border:'1px solid rgba(245,166,35,0.3)',background:'rgba(245,166,35,0.1)',color:gold}}>View</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {shortlist.size>0&&(
          <div style={{background:'#231F1A',border:'1px solid rgba(76,175,125,0.3)',borderRadius:'10px',padding:'14px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
              <span style={{fontWeight:'500',color:'#4CAF7D',fontSize:'13px'}}>Shortlist ({shortlist.size})</span>
              <div style={{display:'flex',gap:'8px'}}>
                <button style={btnGhost}>Send audition invite</button>
                <button style={btnGold}>Request contacts</button>
              </div>
            </div>
            {[...shortlist].map(id=>{
              const a=artists.find(x=>x.user_id===id)
              if(!a) return null
              const name=`${a.first_name||''} ${a.last_name||''}`.trim()
              return (
                <div key={id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'12px'}}>
                  <div>
                    <span style={{fontWeight:'500'}}>{name}</span>
                    <span style={{color:'#8A8078',marginLeft:'8px',fontSize:'11px'}}>{a.state} · {a.acting_experience}</span>
                  </div>
                  <button onClick={()=>toggleSL(id)} style={{background:'none',border:'none',color:'#8A8078',cursor:'pointer',fontSize:'11px'}}>Remove</button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
