import { useEffect, useState } from 'react'
import { cargarCv } from '../lib/cv.js'
import Seccion from '../components/Seccion.jsx'

export default function CvPublico() {
  const [cv, setCv] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarCv()
      .then(setCv)
      .catch((e) => setError(e.message))
  }, [])

  if (error)
    return <p style={{ padding: 24, color: 'crimson' }}>Error: {error}</p>
  if (!cv) return <p style={{ padding: 24 }}>Cargando…</p>

  const p = cv.perfil
  return (
    <main
      style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px 80px' }}
    >
      <h1 style={{ marginBottom: 4 }}>{p?.nombre}</h1>
      <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{p?.titulo}</p>
      <p style={{ margin: '0 0 12px', color: '#444' }}>{p?.tagline}</p>
      <p style={{ margin: '0 0 8px', fontSize: 14, color: '#444' }}>
        {[p?.ubicacion, p?.telefono, p?.email, p?.github, p?.portafolio]
          .filter(Boolean)
          .join('  ·  ')}
      </p>

      <Seccion titulo="Perfil profesional">
        <p>{p?.perfil_texto}</p>
      </Seccion>

      <Seccion titulo="Habilidades">
        {cv.habilidades.map((h) => (
          <p key={h.id} style={{ margin: '4px 0' }}>
            <strong>{h.categoria}:</strong> {(h.items || []).join('  ·  ')}
          </p>
        ))}
      </Seccion>

      <Seccion titulo="Proyectos">
        {cv.proyectos.map((pr) => (
          <div key={pr.id} style={{ marginBottom: 10 }}>
            <strong>{pr.titulo}</strong>
            {pr.subtitulo ? ` — ${pr.subtitulo}` : ''}
            <ul style={{ margin: '4px 0' }}>
              {(pr.bullets || []).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </Seccion>

      <Seccion titulo="Educación">
        {cv.educacion.map((e) => (
          <div key={e.id} style={{ marginBottom: 6 }}>
            <strong>{e.titulo}</strong>
            {e.institucion ? ` — ${e.institucion}` : ''}
            {e.detalle ? ` · ${e.detalle}` : ''}
          </div>
        ))}
      </Seccion>

      <Seccion titulo="Cursos y certificaciones">
        {cv.cursos.map((c) => (
          <div key={c.id} style={{ marginBottom: 6 }}>
            {c.nombre}
            {c.entidad ? ` — ${c.entidad}` : ''}
            {c.detalle ? ` · ${c.detalle}` : ''}
          </div>
        ))}
      </Seccion>

      <Seccion titulo="Idiomas">
        {cv.idiomas.map((i) => (
          <div key={i.id}>
            <strong>{i.idioma}:</strong> {i.nivel}
          </div>
        ))}
      </Seccion>
    </main>
  )
}
