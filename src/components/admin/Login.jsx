import { useState } from 'react'
import { iniciarSesion } from '../../lib/auth.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    const { error } = await iniciarSesion(email, password)
    setCargando(false)
    if (error) setError(error.message)
  }

  return (
    <main className="admin-wrap a-login">
      <div className="a-panel">
        <h2>Panel · Iniciar sesión</h2>
        <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
          <input
            className="a-input" type="email" placeholder="Correo" value={email} required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="a-input" type="password" placeholder="Contraseña" value={password} required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="a-btn primary" disabled={cargando}>
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
          {error && <p className="a-msg a-err">{error}</p>}
        </form>
      </div>
      <p style={{ textAlign: 'center' }}><a href="/">← Ver CV público</a></p>
    </main>
  )
}
