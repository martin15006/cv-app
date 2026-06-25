import { useEffect, useState } from 'react'
import { obtenerPerfil, guardarPerfil } from '../../lib/crud.js'
import { CAMPOS_PERFIL } from '../../lib/secciones.js'
import Formulario from './Formulario.jsx'
import Modal from './Modal.jsx'

export default function PerfilEditor() {
  const [perfil, setPerfil] = useState(null)
  const [msg, setMsg] = useState(null)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    obtenerPerfil().then(setPerfil).catch((e) => setMsg(e.message))
  }, [])

  async function guardar(fila) {
    try {
      await guardarPerfil(fila)
      setPerfil((p) => ({ ...p, ...fila }))
      setMsg('Perfil guardado ✅')
      setAbierto(false)
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <section className="a-panel">
      <div className="a-row" style={{ borderBottom: 'none', padding: 0 }}>
        <span style={{ flex: 1 }}>
          <strong style={{ color: 'var(--ink)' }}>Perfil</strong>
          {perfil ? ` — ${perfil.nombre}` : ' — cargando…'}
        </span>
        <button className="a-btn small primary" onClick={() => setAbierto(true)} disabled={!perfil}>
          Editar perfil
        </button>
      </div>
      {msg && <p className="a-msg">{msg}</p>}

      {abierto && perfil && (
        <Modal titulo="Editar perfil" onCerrar={() => setAbierto(false)}>
          <Formulario campos={CAMPOS_PERFIL} inicial={perfil} onGuardar={guardar} onCancelar={() => setAbierto(false)} />
        </Modal>
      )}
    </section>
  )
}
