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
    <main style={{ maxWidth: 360, margin: '80px auto', padding: 24 }}>
      <h1>Panel · Iniciar sesión</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
        <input
          type="email" placeholder="Correo" value={email} required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" placeholder="Contraseña" value={password} required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={cargando}>{cargando ? 'Entrando…' : 'Entrar'}</button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
      <p style={{ marginTop: 16 }}><a href="/">← Ver CV público</a></p>
    </main>
  )
}
