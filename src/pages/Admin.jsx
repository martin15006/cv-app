import { useEffect, useState } from 'react'
import { obtenerSesion, alCambiarSesion, cerrarSesion } from '../lib/auth.js'
import { SECCIONES } from '../lib/secciones.js'
import Login from '../components/admin/Login.jsx'
import PerfilEditor from '../components/admin/PerfilEditor.jsx'
import TablaCrud from '../components/admin/TablaCrud.jsx'
import '../admin.css'

export default function Admin() {
  // undefined = cargando · null = sin sesión · objeto = logueado
  const [sesion, setSesion] = useState(undefined)

  useEffect(() => {
    document.body.classList.add('tema-admin')
    obtenerSesion().then(({ data }) => setSesion(data.session))
    const { data } = alCambiarSesion(setSesion)
    return () => {
      data.subscription.unsubscribe()
      document.body.classList.remove('tema-admin')
    }
  }, [])

  if (sesion === undefined) return <p style={{ padding: 24 }}>Cargando…</p>
  if (!sesion) return <Login />

  return (
    <main className="admin-wrap">
      <div className="admin-top">
        <h1>Panel de edición</h1>
        <button className="a-btn" onClick={() => cerrarSesion()}>Cerrar sesión</button>
      </div>
      <p className="admin-sub">
        <a href="/">← Ver CV público</a> · los cambios se reflejan al instante
      </p>

      <PerfilEditor />
      {SECCIONES.map((s) => (
        <TablaCrud key={s.tabla} seccion={s} />
      ))}
    </main>
  )
}
