import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const gold = '#F5A623'
const LANGUAGES = ['English','Hindi','Tamil','Telugu','Kannada','Malayalam','Tulu','Kodava','Konkani','Marathi','Bengali','Assamese','Bodo','Dogri','Gujarati','Kashmiri','Maithili','Meitei','Odia','Punjabi','Sanskrit','Sindhi','Urdu']
const SKILLS = ['Martial arts','Bharatanatyam','Kathak','Western dance','Hip-hop','Gymnastics','Swimming','Horse riding','Stunts/Action','Singing classical','Singing playback','Musical instrument','Comedy/Mimicry','Voice dubbing','Ramp walk']
const SHOOT_TYPES = ['Film','Drama','Modelling','Print shoot','Traditional shoot','Ramp shows','Ethnic wear','Western shoot','Bikini/Swimwear','Gym/Sports wear','Calendar shoots','Music albums','TV serials','Kissing scene','Intimate scene','Singing','Dancing','Anchoring','Web series','Bold/Semi bold','Advertisement','Smoking','Drinking']
const HAIR = ['Straight hair','Wavy hair','Curly hair','Coily hair','No hair']
const EYES = ['Black','Brown','Blue','Green','Grey','Amber']
const SKIN = ['Very fair','Fair','Wheatish','Dark','Very dark']
const STEPS = ['Personal','Physical','Languages','Skills','Shoot Types','Social & Submit']

export default function ArtistForm() {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [form, setForm] = useState({
    first_name:'',last_name:'',stage_name:'',dob:'',gender:'',guardian_phone:'',
    contact_number:'',email:'',address:'',city:'',state:'',pincode:'',
    profession:'',education:'',hobbies:'',height:'',weight:'',chest:'',
    waist:'',hips:'',shoe_size:'',hair_type:'',hair_color:'',eye_color:'',
    skin_tone:'',body_type:'',bio:'',acting_experience:'No',experience_years:'',
    guild_union:'',notable_works:'',video_link:'',showreel_link:'',
    instagram:'',youtube:'',facebook:'',imdb:'',
    languages:{},skills:{},shoot_types:{},terms_accepted:false
  })

  const set = (f,v) => setForm(p=>({...p,[f]:v}))
  const toggleLang = (lang,key) => setForm(p=>({...p,languages:{...p.languages,[lang]:{...p.languages[lang],[key]:!p.languages[lang]?.[key]}}}))
  const toggleCheck = (group,item) => setForm(p=>({...p,[group]:{...p[group],[item]:!p[group][item]}}))

  const sec = {background:'#231F1A',border:'1px solid rgba(245,166,35,0.22)',borderRadius:'10px',padding:'18px',marginBottom:'14px'}
  const secTitle = {fontSize:'10px',fontWeight:'500',color:gold,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'14px',display:'block'}
  const grid = {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))',gap:'10px'}
  const field = (label, children) => (
    <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
      <label style={{fontSize:'11px',color:'#8A8078'}}>{label}</label>
      {children}
    </div>
  )
  const cbItem = {display:'flex',alignItems:'center',gap:'8px',padding:'7px 10px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'6px',cursor:'pointer',fontSize:'12px',color:'#E8E4DC'}

  async function saveProfile() {
    if (!form.terms_accepted) { setSaveError('Please accept the Terms and Conditions.'); return }
    setSaving(true); setSaveError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('artist_profiles').upsert({
      user_id: user.id, ...form,
      languages: JSON.stringify(form.languages),
      skills: JSON.stringify(form.skills),
      shoot_types: JSON.stringify(form.shoot_types),
      updated_at: new Date().toISOString()
    })
    if (error) { setSaveError(error.message) } else { setSaved(true) }
    setSaving(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'#1A1714',color:'#E8E4DC',fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:'#231F1A',borderBottom:'1px solid rgba(245,166,35,0.22)',padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'10px'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'22px',letterSpacing:'2px'}}>cast<span style={{color:gold}}>mee</span></div>
        <div style={{display:'flex',gap:'0',overflowX:'auto'}}>
          {STEPS.map((t,i)=>(
            <button key={t} onClick={()=>setStep(i)} style={{padding:'7px 14px',fontSize:'11px',color:step===i?gold:'#8A8078',background:'none',border:'none',borderBottom:`2px solid ${step===i?gold:'transparent'}`,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap'}}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{padding:'20px',maxWidth:'860px',margin:'0 auto'}}>
        <div style={{height:'2px',background:'rgba(255,255,255,0.08)',marginBottom:'20px',borderRadius:'2px'}}>
          <div style={{height:'100%',background:gold,width:`${((step+1)/STEPS.length)*100}%`,borderRadius:'2px',transition:'width 0.4s'}}/>
        </div>

        {step===0 && <>
          <div style={sec}>
            <span style={secTitle}>Identity</span>
            <div style={grid}>
              {field('First name *',<input value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="First"/>)}
              {field('Last name *',<input value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Last"/>)}
              {field('Stage name',<input value={form.stage_name} onChange={e=>set('stage_name',e.target.value)} placeholder="Screen name"/>)}
              {field('Date of birth *',<input type="date" value={form.dob} onChange={e=>set('dob',e.target.value)}/>)}
              {field('Gender',<select value={form.gender} onChange={e=>set('gender',e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option><option>Non-binary</option></select>)}
              {field('Guardian phone',<input value={form.guardian_phone} onChange={e=>set('guardian_phone',e.target.value)} placeholder="+91 (for minors)"/>)}
              {field('Contact number *',<input value={form.contact_number} onChange={e=>set('contact_number',e.target.value)} placeholder="+91"/>)}
              {field('Email *',<input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/>)}
              {field('City',<input value={form.city} onChange={e=>set('city',e.target.value)}/>)}
              {field('State',<select value={form.state} onChange={e=>set('state',e.target.value)}><option value="">Select</option>{['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'].map(s=><option key={s}>{s}</option>)}</select>)}
              {field('Profession',<input value={form.profession} onChange={e=>set('profession',e.target.value)} placeholder="Actor, Model..."/>)}
              {field('Education',<input value={form.education} onChange={e=>set('education',e.target.value)}/>)}
            </div>
          </div>
        </>}

        {step===1 && <>
          <div style={sec}>
            <span style={secTitle}>Measurements</span>
            <div style={grid}>
              {field('Height (ft) *',<input type="number" value={form.height} onChange={e=>set('height',e.target.value)} placeholder="5.6"/>)}
              {field('Weight (kg) *',<input type="number" value={form.weight} onChange={e=>set('weight',e.target.value)} placeholder="60"/>)}
              {field('Chest/bust (in)',<input type="number" value={form.chest} onChange={e=>set('chest',e.target.value)}/>)}
              {field('Waist (in)',<input type="number" value={form.waist} onChange={e=>set('waist',e.target.value)}/>)}
              {field('Hips (in)',<input type="number" value={form.hips} onChange={e=>set('hips',e.target.value)}/>)}
              {field('Shoe size (UK)',<input type="number" value={form.shoe_size} onChange={e=>set('shoe_size',e.target.value)}/>)}
            </div>
          </div>
          <div style={sec}>
            <span style={secTitle}>Hair type</span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {HAIR.map(h=><label key={h} style={cbItem}><input type="radio" name="hair" checked={form.hair_type===h} onChange={()=>set('hair_type',h)} style={{accentColor:gold}}/>{h}</label>)}
            </div>
          </div>
          <div style={sec}>
            <span style={secTitle}>Eye colour</span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {EYES.map(e=><label key={e} style={cbItem}><input type="radio" name="eye" checked={form.eye_color===e} onChange={()=>set('eye_color',e)} style={{accentColor:gold}}/>{e}</label>)}
            </div>
          </div>
          <div style={sec}>
            <span style={secTitle}>Skin tone</span>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {SKIN.map(s=><label key={s} style={cbItem}><input type="radio" name="skin" checked={form.skin_tone===s} onChange={()=>set('skin_tone',s)} style={{accentColor:gold}}/>{s}</label>)}
            </div>
          </div>
          <div style={sec}>
            <span style={secTitle}>Body type & Bio</span>
            <div style={grid}>
              {field('Body type',<select value={form.body_type} onChange={e=>set('body_type',e.target.value)}><option value="">Select</option><option>Slim/lean</option><option>Athletic/fit</option><option>Average</option><option>Muscular</option><option>Curvy</option><option>Plus size</option></select>)}
              {field('Hair colour',<input value={form.hair_color} onChange={e=>set('hair_color',e.target.value)} placeholder="e.g. Black"/>)}
            </div>
            <div style={{marginTop:'10px'}}>{field('Bio',<textarea rows={3} value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Short bio about yourself..."/>)}</div>
          </div>
        </>}

        {step===2 && <div style={sec}>
          <span style={secTitle}>Language knowledge</span>
          <div style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 80px',fontSize:'10px',color:gold,textTransform:'uppercase',letterSpacing:'0.08em',padding:'0 4px 8px',borderBottom:'1px solid rgba(245,166,35,0.22)',marginBottom:'6px'}}>
            <span>Language</span><span style={{textAlign:'center'}}>Speak</span><span style={{textAlign:'center'}}>Read</span><span style={{textAlign:'center'}}>Write</span>
          </div>
          {LANGUAGES.map(lang=>(
            <div key={lang} style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 80px',alignItems:'center',padding:'5px 4px',borderBottom:'1px solid rgba(255,255,255,0.04)',fontSize:'12px'}}>
              <span>{lang}</span>
              {['speak','read','write'].map(key=>(
                <div key={key} style={{display:'flex',justifyContent:'center'}}>
                  <input type="checkbox" style={{accentColor:gold,width:'14px',height:'14px',cursor:'pointer'}} checked={!!form.languages[lang]?.[key]} onChange={()=>toggleLang(lang,key)}/>
                </div>
              ))}
            </div>
          ))}
        </div>}

        {step===3 && <>
          <div style={sec}>
            <span style={secTitle}>Acting experience</span>
            <div style={grid}>
              {field('Experience level',<select value={form.acting_experience} onChange={e=>set('acting_experience',e.target.value)}><option>No</option><option>Theatre only</option><option>Short films</option><option>Regional films</option><option>OTT / web series</option><option>Bollywood / national</option></select>)}
              {field('Years',<input type="number" value={form.experience_years} onChange={e=>set('experience_years',e.target.value)} min="0"/>)}
              {field('Video link',<input type="url" value={form.video_link} onChange={e=>set('video_link',e.target.value)} placeholder="YouTube/Drive"/>)}
            </div>
            <div style={{marginTop:'10px'}}>{field('Notable works',<textarea rows={2} value={form.notable_works} onChange={e=>set('notable_works',e.target.value)}/>)}</div>
          </div>
          <div style={sec}>
            <span style={secTitle}>Special skills & talents</span>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'6px'}}>
              {SKILLS.map(sk=><label key={sk} style={cbItem}><input type="checkbox" style={{accentColor:gold}} checked={!!form.skills[sk]} onChange={()=>toggleCheck('skills',sk)}/>{sk}</label>)}
            </div>
          </div>
        </>}

        {step===4 && <div style={sec}>
          <span style={secTitle}>Willing to work in — tick all that apply</span>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))',gap:'6px'}}>
            {SHOOT_TYPES.map(st=><label key={st} style={cbItem}><input type="checkbox" style={{accentColor:gold}} checked={!!form.shoot_types[st]} onChange={()=>toggleCheck('shoot_types',st)}/>{st}</label>)}
          </div>
        </div>}

        {step===5 && <>
          <div style={sec}>
            <span style={secTitle}>Social media</span>
            <div style={grid}>
              {field('Instagram',<input value={form.instagram} onChange={e=>set('instagram',e.target.value)} placeholder="@username"/>)}
              {field('YouTube',<input value={form.youtube} onChange={e=>set('youtube',e.target.value)}/>)}
              {field('Facebook',<input value={form.facebook} onChange={e=>set('facebook',e.target.value)}/>)}
              {field('IMDb',<input value={form.imdb} onChange={e=>set('imdb',e.target.value)}/>)}
            </div>
          </div>
          <div style={sec}>
            <span style={secTitle}>Terms and conditions</span>
            <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'6px',padding:'12px',fontSize:'11px',color:'#8A8078',maxHeight:'80px',overflowY:'auto',lineHeight:'1.6',marginBottom:'12px'}}>
              By submitting your profile, you give Castmee permission to share this information with production houses for casting opportunities. Castmee is not responsible for any financial transactions between artists and production houses.
            </div>
            <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',cursor:'pointer'}}>
              <input type="checkbox" style={{accentColor:gold}} checked={form.terms_accepted} onChange={e=>set('terms_accepted',e.target.checked)}/>
              I accept the Terms and Conditions
            </label>
          </div>
          {saveError && <div style={{background:'rgba(224,80,80,0.1)',border:'1px solid rgba(224,80,80,0.3)',borderRadius:'8px',padding:'12px',fontSize:'13px',color:'#E05050',marginBottom:'14px'}}>{saveError}</div>}
          {saved && <div style={{background:'rgba(76,175,125,0.1)',border:'1px solid rgba(76,175,125,0.3)',borderRadius:'8px',padding:'12px',fontSize:'13px',color:'#4CAF7D',marginBottom:'14px',textAlign:'center'}}>Profile saved! Casting directors can now find you ✓</div>}
          <button onClick={saveProfile} disabled={saving} style={{width:'100%',padding:'13px',background:gold,border:'none',borderRadius:'8px',color:'#1A1714',fontSize:'14px',fontWeight:'500',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
            {saving ? 'Saving...' : 'Save profile to Castmee'}
          </button>
        </>}

        <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',marginTop:'16px'}}>
          {step>0 && <button onClick={()=>setStep(s=>s-1)} style={{padding:'10px 22px',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:'transparent',border:'1px solid rgba(255,255,255,0.15)',color:'#8A8078',fontFamily:"'DM Sans',sans-serif"}}>Back</button>}
          {step<5 && <button onClick={()=>setStep(s=>s+1)} style={{padding:'10px 22px',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:gold,border:`1px solid ${gold}`,color:'#1A1714',fontFamily:"'DM Sans',sans-serif"}}>Continue</button>}
        </div>
      </div>
    </div>
  )
}
