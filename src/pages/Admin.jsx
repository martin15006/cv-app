import { useEffect, useState } from 'react'
import { obtenerSesion, alCambiarSesion, cerrarSesion } from '../lib/auth.js'
import { SECCIONES } from '../lib/secciones.js'
import Login from '../components/admin/Login.jsx'
import PerfilEditor from '../components/admin/PerfilEditor.jsx'
import TablaCrud from '../components/admin/TablaCrud.jsx'

export default function Admin() {
  // undefined = cargando · null = sin sesión · objeto = logueado
  const [sesion, setSesion] = useState(undefined)

  useEffect(() => {
    obtenerSesion().then(({ data }) => setSesion(data.session))
    const { data } = alCambiarSesion(setSesion)
    return () => data.subscription.unsubscribe()
  }, [])

  if (sesion === undefined) return <p style={{ padding: 24 }}>Cargando…</p>
  if (!sesion) return <Login />

  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Panel de edición</h1>
        <button onClick={() => cerrarSesion()}>Cerrar sesión</button>
      </div>
      <p><a href="/">← Ver CV público</a></p>

      <PerfilEditor />
      {SECCIONES.map((s) => (
        <TablaCrud key={s.tabla} seccion={s} />
      ))}
    </main>
  )
}
