import { useEffect, useState } from 'react'
import { obtenerPerfil, guardarPerfil } from '../../lib/crud.js'
import { CAMPOS_PERFIL } from '../../lib/secciones.js'
import Formulario from './Formulario.jsx'

export default function PerfilEditor() {
  const [perfil, setPerfil] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    obtenerPerfil().then(setPerfil).catch((e) => setMsg(e.message))
  }, [])

  async function guardar(fila) {
    try {
      await guardarPerfil(fila)
      setMsg('Perfil guardado ✅')
    } catch (e) {
      setMsg(e.message)
    }
  }

  if (!perfil) return <p>Cargando perfil…</p>

  return (
    <section style={{ marginBottom: 28 }}>
      <h3>Perfil</h3>
      {msg && <p>{msg}</p>}
      <Formulario campos={CAMPOS_PERFIL} inicial={perfil} onGuardar={guardar} />
    </section>
  )
}
