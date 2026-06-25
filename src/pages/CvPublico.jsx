import { useEffect, useState } from 'react'
import { cargarCv } from '../lib/cv.js'
import '../monarca.css'

function partirNombre(nombre = '') {
  const w = nombre.trim().split(/\s+/)
  return [w.slice(0, 2).join(' '), w.slice(2).join(' ')]
}

const PCT = { nativo: 100, 'básico-intermedio': 55, intermedio: 65, avanzado: 85, básico: 40 }
const nivelPct = (n) => PCT[(n || '').toLowerCase()] ?? 60

function leadBold(texto = '') {
  const i = texto.indexOf('. ')
  if (i < 0) return [texto, '']
  return [texto.slice(0, i + 1), texto.slice(i + 2)]
}

const Icono = {
  ubi: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  tel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>,
  git: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  web: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
}

export default function CvPublico() {
  const [cv, setCv] = useState(null)
  const [error, setError] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    document.body.classList.add('cv-monarca')
    cargarCv().then(setCv).catch((e) => setError(e.message))
    return () => document.body.classList.remove('cv-monarca')
  }, [])

  // Animaciones (cuando el contenido ya está renderizado)
  useEffect(() => {
    if (!cv) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const limpiezas = []

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const boot = document.getElementById('boot')
    if (boot) {
      if (reduce) boot.style.display = 'none'
      else {
        const t = setTimeout(() => boot.classList.add('done'), 1650)
        limpiezas.push(() => clearTimeout(t))
      }
    }

    const sweep = document.getElementById('sweep')
    if (sweep && !reduce) requestAnimationFrame(() => sweep.classList.add('go'))

    const tbid = document.getElementById('tbid')
    if (tbid && !reduce) {
      const tags = ['root@monarca', 'ARQUITECTO DEL SISTEMA', 'SISTEMA : DESPIERTO', 'NIVEL : ∞']
      let i = 0
      const iv = setInterval(() => {
        tbid.style.opacity = '0'
        setTimeout(() => { i = (i + 1) % tags.length; tbid.textContent = tags[i]; tbid.style.opacity = '1' }, 350)
      }, 3500)
      limpiezas.push(() => clearInterval(iv))
    }

    const revs = document.querySelectorAll('.reveal')
    if (reduce) revs.forEach((el) => el.classList.add('in'))
    else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.classList.toggle('in', e.isIntersecting)),
        { threshold: 0.14 }
      )
      revs.forEach((el) => io.observe(el))
      limpiezas.push(() => io.disconnect())
    } else revs.forEach((el) => el.classList.add('in'))

    if (!reduce && window.matchMedia('(pointer:fine)').matches) {
      document.querySelectorAll('.tilt').forEach((card) => {
        const mm = (ev) => {
          const r = card.getBoundingClientRect()
          const px = (ev.clientX - r.left) / r.width - 0.5
          const py = (ev.clientY - r.top) / r.height - 0.5
          card.style.transform = `perspective(900px) rotateY(${(px * 7).toFixed(2)}deg) rotateX(${(-py * 7).toFixed(2)}deg) translateY(-4px)`
          card.style.boxShadow = '0 22px 60px rgba(124,92,255,0.42), 0 0 42px rgba(34,211,238,0.3)'
        }
        const ml = () => { card.style.transform = ''; card.style.boxShadow = '' }
        card.addEventListener('mousemove', mm)
        card.addEventListener('mouseleave', ml)
        limpiezas.push(() => { card.removeEventListener('mousemove', mm); card.removeEventListener('mouseleave', ml) })
      })
    }

    const cvs = document.getElementById('fx-canvas')
    if (cvs && !reduce) {
      const ctx = cvs.getContext('2d')
      let w, h, dpr, pts = [], raf
      const mouse = { x: -9999, y: -9999 }
      const size = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); w = cvs.clientWidth; h = cvs.clientHeight; cvs.width = w * dpr; cvs.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
      const init = () => { const n = Math.round(Math.min(72, Math.max(28, (w * h) / 26000))); pts = []; for (let i = 0; i < n; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.6 + 0.5 }) }
      const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
      const onOut = () => { mouse.x = -9999; mouse.y = -9999 }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseout', onOut)
      const step = () => {
        ctx.clearRect(0, 0, w, h)
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i]; p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
          const dmx = p.x - mouse.x, dmy = p.y - mouse.y, dm = dmx * dmx + dmy * dmy
          if (dm < 18000 && dm > 0.1) { const f = (1 - dm / 18000) * 1.2, dd = Math.sqrt(dm); p.x += dmx / dd * f; p.y += dmy / dd * f }
        }
        for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) {
          const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y, dsq = dx * dx + dy * dy
          if (dsq < 14000) { const o = (1 - dsq / 14000) * 0.5; ctx.strokeStyle = `rgba(124,92,255,${o.toFixed(3)})`; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke() }
        }
        for (let k = 0; k < pts.length; k++) { const q = pts[k]; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.283); ctx.fillStyle = 'rgba(34,211,238,0.65)'; ctx.fill() }
        raf = requestAnimationFrame(step)
      }
      const startC = () => { size(); init(); cancelAnimationFrame(raf); step() }
      let rt
      const onResize = () => { clearTimeout(rt); rt = setTimeout(startC, 180) }
      window.addEventListener('resize', onResize)
      startC()
      limpiezas.push(() => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseout', onOut); window.removeEventListener('resize', onResize) })
    } else if (cvs) cvs.style.display = 'none'

    return () => limpiezas.forEach((fn) => fn())
  }, [cv])

  async function descargarPdf() {
    if (!cv) return
    setPdfLoading(true)
    try {
      const [{ pdf }, { default: CvPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../pdf/CvPdf.jsx'),
      ])
      const blob = await pdf(<CvPdf cv={cv} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'CV-Juan-Sebastian-Martin-Moncada.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      sessionStorage.removeItem('pdf-reload')
    } catch (e) {
      const msg = String(e?.message || e)
      // Si el chunk del PDF cambió por un redeploy, esta pestaña quedó con la
      // versión vieja: recargamos para traer la nueva y reintentamos UNA vez.
      const chunkViejo = /dynamically imported module|module script failed|Failed to fetch/i.test(msg)
      if (chunkViejo && sessionStorage.getItem('pdf-reload') !== 'done') {
        sessionStorage.setItem('pdf-reload', 'pending')
        window.location.reload()
        return
      }
      sessionStorage.removeItem('pdf-reload')
      alert('No se pudo generar el PDF: ' + msg)
    } finally {
      setPdfLoading(false)
    }
  }

  // Tras recargar por un chunk viejo, reintenta la descarga automáticamente.
  useEffect(() => {
    if (cv && sessionStorage.getItem('pdf-reload') === 'pending') {
      sessionStorage.setItem('pdf-reload', 'done')
      descargarPdf()
    }
  }, [cv])

  const p = cv?.perfil
  const [nA, nB] = partirNombre(p?.nombre)
  const [lead, resto] = leadBold(p?.perfil_texto)

  return (
    <>
      <div id="boot" aria-hidden="true">
        <div className="boot-frame">
          <span className="bk tl"></span><span className="bk br"></span>
          <span className="ln">// system.window — auth ok</span>
          <div className="nm">Juan Sebastián <span className="g">Martín</span></div>
          <div className="boot-bar"><i></i></div>
        </div>
      </div>

      <div className="bg-grad" aria-hidden="true"></div>
      <div className="aura a1" aria-hidden="true"></div>
      <div className="aura a2" aria-hidden="true"></div>
      <div className="aura a3" aria-hidden="true"></div>
      <div className="grid-overlay" aria-hidden="true"></div>
      <canvas id="fx-canvas" aria-hidden="true"></canvas>
      <div className="scanlines" aria-hidden="true"></div>

      <main className="wrap">
        {error && <p style={{ color: '#ff8a8a' }}>Error: {error}</p>}
        {!error && !cv && null}
        {cv && (
          <>
            {/* HERO */}
            <section className="panel hero boot-open">
              <span className="bracket tl"></span><span className="bracket tr"></span>
              <span className="bracket bl"></span><span className="bracket br"></span>
              <div className="sweep" id="sweep"></div>
              <div className="titlebar">
                <span className="dot"></span><span className="dot c2"></span><span className="dot c3"></span>
                <span>sistema // ficha_de_jugador</span>
                <span className="tb-id" id="tbid">root@monarca</span>
              </div>
              <div className="hero-inner">
                <div className="hero-main">
                  <div className="crown" aria-hidden="true">
                    <svg viewBox="0 0 28 22" fill="none"><path d="M2 19h24M3 19 5 6l6 6 3-10 3 10 6-6 2 13" stroke="url(#cg)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/><defs><linearGradient id="cg" x1="0" y1="0" x2="28" y2="0"><stop stopColor="#a855f7"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs></svg>
                    jugador desbloqueado
                  </div>
                  <h1 className="player-name">
                    <span className="a">{nA}</span><br /><span className="b">{nB}</span>
                  </h1>
                  <p className="role">{p.titulo}</p>
                  <p className="tagline">{p.tagline}</p>
                  <div className="cta-row">
                    <a className="btn primary" href={`mailto:${p.email}`}>&#9993; Contactar</a>
                    <a className="btn ghost" href={`https://${p.github?.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener">&#9740; GitHub</a>
                    <button className="btn ghost" onClick={descargarPdf} disabled={pdfLoading}>&#11015; {pdfLoading ? 'Generando…' : 'Descargar PDF'}</button>
                  </div>
                </div>
                <aside className="hero-side">
                  {p.disponible && <span className="avail"><span className="pulse" aria-hidden="true"></span>Disponible para trabajar</span>}
                  <div className="stat"><span className="k">Clase</span><span className="v">Full-Stack<small>web + móvil</small></span></div>
                  <div className="stat"><span className="k">Stack base</span><span className="v">JS / TS<small>React · Node</small></span></div>
                  <div className="stat"><span className="k">Proyectos</span><span className="v">{cv.proyectos.length} realizados<small>+140 tests</small></span></div>
                  <div className="stat"><span className="k">Rango</span><span className="v">Aprendiz SENA<small>ID+I / SENNOVA</small></span></div>
                </aside>
              </div>
            </section>

            {/* CONTACTO */}
            <section className="panel contact reveal">
              <ItemContacto icono={Icono.ubi} k="Ubicación" v={p.ubicacion} />
              <ItemContacto icono={Icono.tel} k="Teléfono" v={p.telefono} />
              <ItemContacto icono={Icono.mail} k="Email" href={`mailto:${p.email}`} v={p.email} />
              <ItemContacto icono={Icono.git} k="GitHub" href={`https://${p.github?.replace(/^https?:\/\//, '')}`} v={p.github} />
              <ItemContacto icono={Icono.web} k="Portafolio" href={p.portafolio} v={p.portafolio?.replace(/^https?:\/\//, '')} />
            </section>

            {/* PERFIL */}
            <section className="reveal">
              <div className="sec-head"><span className="label">status</span><h2>Perfil profesional</h2><span className="idx">// 01</span></div>
              <div className="panel profile-body">
                <span className="bracket tl"></span><span className="bracket br"></span>
                <p><strong>{lead}</strong> {resto}</p>
              </div>
            </section>

            {/* HABILIDADES */}
            <section className="reveal">
              <div className="sec-head"><span className="label">habilidades</span><h2>Stack técnico</h2><span className="idx">// 02</span></div>
              <div className="skills-grid">
                {cv.habilidades.map((h) => (
                  <div className="panel skill-card" key={h.id}>
                    <span className="label">{h.categoria}</span>
                    <div className="chips">{(h.items || []).map((it, i) => <span className="chip" key={i}>{it}</span>)}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROYECTOS */}
            <section className="reveal">
              <div className="sec-head"><span className="label">proyectos = quests</span><h2>Proyectos y logros</h2><span className="idx">// 03</span></div>
              <div className="quests">
                {cv.proyectos.map((pr, idx) => (
                  <article className="panel quest tilt" key={pr.id}>
                    <div className="q-top">
                      <span>quest_0{idx + 1}</span>
                      {pr.rango && <span className="q-rank">RANK&nbsp;{pr.rango}</span>}
                    </div>
                    <div className="q-body">
                      <h3 className="q-title">{pr.titulo}</h3>
                      {pr.subtitulo && <div className="q-meta">{pr.subtitulo}</div>}
                      <div className="q-stack">{(pr.stack || []).map((s, i) => <span key={i}>{s}</span>)}</div>
                      <ul className="q-list">{(pr.bullets || []).map((b, i) => <li key={i}>{b}</li>)}</ul>
                      {pr.enlace
                        ? <a className="q-link" href={`https://${pr.enlace.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener">&#9740; {pr.enlace}</a>
                        : <span className="q-link muted">Proyecto formativo / personal</span>}
                    </div>
                  </article>
                ))}
              </div>
              <div className="note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <span><strong>Nota:</strong> estos son proyectos formativos del SENA y personales/de estudio, no empleos remunerados.</span>
              </div>
            </section>

            {/* EDUCACIÓN + IDIOMAS */}
            <section className="reveal">
              <div className="sec-head"><span className="label">registro</span><h2>Educación e idiomas</h2><span className="idx">// 04</span></div>
              <div className="two-col">
                <div className="panel edu-body">
                  <span className="label">educación</span>
                  <div style={{ height: 14 }}></div>
                  {cv.educacion.map((e) => (
                    <div className="edu-item" key={e.id}>
                      <h3>{e.titulo}</h3>
                      <p>{[e.institucion, e.detalle].filter(Boolean).join(' · ')}</p>
                    </div>
                  ))}
                </div>
                <div className="panel lang-body">
                  <span className="label">idiomas</span>
                  <div style={{ height: 14 }}></div>
                  {cv.idiomas.map((i) => (
                    <div className="lang-row" key={i.id}>
                      <div className="lang-top"><span className="n">{i.idioma}</span><span className="lvl">{i.nivel}</span></div>
                      <div className="bar"><i data-w={nivelPct(i.nivel)} style={{ width: nivelPct(i.nivel) + '%' }}></i></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CURSOS */}
            <section className="reveal">
              <div className="sec-head"><span className="label">formación complementaria</span><h2>Cursos y certificaciones</h2><span className="idx">// 05</span></div>
              <div className="panel cursos-body">
                <span className="bracket tl"></span><span className="bracket br"></span>
                <ul className="cursos-list">
                  {cv.cursos.map((c) => (
                    <li key={c.id}>
                      <span className="cur-n">{c.nombre}</span>
                      <span className="cur-e">{[c.entidad, c.detalle].filter(Boolean).join(' · ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <footer>
              {p.nombre} <span className="sep">//</span> {p.titulo} <span className="sep">//</span> 2026
            </footer>
          </>
        )}
      </main>
    </>
  )
}

function ItemContacto({ icono, k, v, href }) {
  if (!v) return null
  return (
    <div className="c-item">
      <span className="c-ico" aria-hidden="true">{icono}</span>
      <div>
        <div className="c-k">{k}</div>
        {href ? <a className="c-v" href={href} target="_blank" rel="noopener">{v}</a> : <div className="c-v">{v}</div>}
      </div>
    </div>
  )
}
